# Деплой mc-site-v4 на VPS

Статический лендинг maxima consulting. Основной домен: **maxima-consulting.ru**.

Примечание: **maximaconsulting.ru** (без дефиса) на этот VPS не указывает — домен
проксируется через Cloudflare на отдельный сторонний сервис и к этому репозиторию
отношения не имеет.

## Требования

- Ubuntu/Debian VPS с nginx
- certbot (`certbot python3-certbot-nginx`)
- git, rsync
- DNS: A-записи `@` и `www` для maxima-consulting.ru → IP VPS

## Первоначальная установка

### 1. Директории

```bash
sudo mkdir -p /opt/maxima-consulting/apps
sudo mkdir -p /var/www/maxima-consulting/static/mc-site-v4
```

### 2. Clone репозитория

```bash
cd /opt/maxima-consulting/apps
git clone https://github.com/zugrov/mc-site-v.4.git
chmod +x mc-site-v.4/deploy/deploy.sh
```

### 3. Первый деплой файлов

```bash
/opt/maxima-consulting/apps/mc-site-v.4/deploy/deploy.sh
```

### 4. Nginx

```bash
sudo ln -sf /opt/maxima-consulting/apps/mc-site-v.4/deploy/nginx/maximaconsulting.conf \
  /etc/nginx/sites-enabled/maximaconsulting.conf

sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL (Let's Encrypt)

```bash
sudo certbot --nginx \
  -d maxima-consulting.ru \
  -d www.maxima-consulting.ru
```

Certbot добавит HTTPS-блоки и настроит редирект HTTP → HTTPS.

## Обновление после push в GitHub

```bash
/opt/maxima-consulting/apps/mc-site-v.4/deploy/deploy.sh
```

Скрипт выполняет `git pull origin main` и `rsync` в web root (без `.git` и `deploy/`).

## Проверка

- https://maxima-consulting.ru — лендинг
- https://maxima-consulting.ru/sitemap.xml
- https://maxima-consulting.ru/robots.txt
- https://maxima-consulting.ru/api/health — Lead API (должен вернуть `{"status":"ok"}`)

## Lead API (Node.js)

Формы на сайте отправляют заявки через `POST /api/lead`. Nginx проксирует `/api/` на локальный сервис.

### 1. Установка Node.js на VPS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Зависимости и переменные окружения

```bash
cd /opt/maxima-consulting/apps/mc-site-v.4/server
npm install
cp ../.env.example .env
# Заполнить BITRIX24_WEBHOOK_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
nano .env
```

### 3. systemd unit

Создать `/etc/systemd/system/maxima-lead-api.service`:

```ini
[Unit]
Description=Maxima Lead API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/maxima-consulting/apps/mc-site-v.4/server
EnvironmentFile=/opt/maxima-consulting/apps/mc-site-v.4/server/.env
ExecStart=/usr/bin/node index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable maxima-lead-api
sudo systemctl start maxima-lead-api
sudo systemctl status maxima-lead-api
```

Порт 3011 выбран, так как 3001 на VPS уже занят другим сервисом (docker-proxy).
При деплое на другой сервер проверяйте занятость порта командой `ss -ltnp`.

### 4. Проверка end-to-end

```bash
curl -s http://127.0.0.1:3011/api/health
curl -s -X POST http://127.0.0.1:3011/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","contact":"@testuser","role":"owner","industry":"trade","revenue":"under_20","question":"Тестовый вопрос для проверки","urgency":"researching","consent_pdn":true}'
```

После деплоя nginx перезагрузить: `sudo nginx -t && sudo systemctl reload nginx`

## Экспорт офлайн-конверсий в Яндекс.Метрику

Основной путь — **триггер по событию** (робот Bitrix24 → HTTP-вебхук на наш сервер).
Fallback — **ночной cron** (гарантия «не реже раза в сутки»).

Дедупликация ведётся по `lead_id` (серверный UUID), а не по ID сделки в CRM.

### 1. Переменные окружения

Добавить в `server/.env` (см. также `.env.example`):

```bash
YANDEX_METRIKA_COUNTER_ID=112291401
YANDEX_METRIKA_OAUTH_TOKEN=your_oauth_token
YANDEX_METRIKA_CURRENCY=RUB
BITRIX_CONVERSION_GOALS={"C2:UC_QUALIFIED":"qualified_lead","C2:UC_MEETING":"meeting_held","C2:WON":"won_diagnostic"}
BITRIX_UF_CLIENT_ID_CODE=
BITRIX_UF_YCLID_CODE=
BITRIX_UF_LEAD_ID_CODE=
BITRIX_WEBHOOK_SECRET=your_random_secret
BITRIX_LEAD_FIELD_CODES={"utm_source":"UF_CRM_UTM_SOURCE","client_id":"UF_CRM_CLIENT_ID","lead_id":"UF_CRM_LEAD_ID"}
BITRIX_DEFAULT_OWNER_ID=
TELEGRAM_MANAGER_CHAT_ID=
TELEGRAM_ESCALATION_CHAT_ID=
```

- `BITRIX_CONVERSION_GOALS` — JSON: ключ = `STATUS_ID` сделки, значение = идентификатор цели в Метрике.
- Для целей `won_*` передаётся сумма сделки (`OPPORTUNITY`) в офлайн-конверсии.

### 2. Робот Bitrix24 → вебхук (предпочтительно)

В CRM → Роботы и триггеры на нужных стадиях сделки добавить действие
«Исходящий вебхук» / «HTTP-запрос»:

```
POST https://maxima-consulting.ru/api/internal/bitrix-webhook?secret=YOUR_SECRET
Content-Type: application/json

{"deal_id":"{=Document:ID}","status_id":"{=Document:STATUS_ID}"}
```

Если робот недоступен на тарифе — работает только ночной cron (см. ниже).

### 3. Ручной запуск fallback-экспорта

```bash
cd /opt/maxima-consulting/apps/mc-site-v.4/server
npm run export:conversions
```

Логи: `server/data/conversion-export.log`

### 4. Cron fallback (ежедневно в 04:00 UTC)

```cron
0 4 * * * cd /opt/maxima-consulting/apps/mc-site-v.4/server && /usr/bin/node scripts/export-offline-conversions.js >> data/conversion-export-cron.log 2>&1
```

### 5. Проверка

1. Перевести сделку в стадию из `BITRIX_CONVERSION_GOALS` (или вызвать вебхук вручную).
2. Проверить `conversion-export.log` — статус `uploaded`, ключ `lead_id:goal`.
3. В Метрике — офлайн-конверсии (задержка до нескольких часов).

## SLA: автозадача и эскалация

При создании нового лида сервер автоматически:
1. Создаёт задачу в Bitrix24 (`tasks.task.add`) с дедлайном по SLA (15 мин в рабочее время).
2. Отправляет уведомление менеджеру в `TELEGRAM_MANAGER_CHAT_ID`.
3. Сохраняет задачу в `server/data/sla-tasks.json`.

Cron эскалации (каждые 5 минут):

```cron
*/5 * * * * cd /opt/maxima-consulting/apps/mc-site-v.4/server && /usr/bin/node scripts/check-sla-escalation.js >> data/sla-escalation-cron.log 2>&1
```

При просрочке SLA — уведомление в `TELEGRAM_ESCALATION_CHAT_ID`.

Ручная проверка:

```bash
cd /opt/maxima-consulting/apps/mc-site-v.4/server
npm run check:sla
```

## Дедупликация лидов

Повторная заявка с тем же телефоном/Telegram за 30 дней не создаёт новый лид в Bitrix —
добавляется комментарий к существующей карточке, в ответе API `crm_status: duplicate`.
Индекс контактов: `server/data/contacts-index.json`.
