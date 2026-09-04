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

Скрипт раз в сутки выгружает из Bitrix24 сделки в целевых стадиях и отправляет
офлайн-конверсии в Метрику (Offline Conversions API). Дедупликация и курсор
хранятся в `server/data/conversion-export-state.json`.

### 1. Переменные окружения

Добавить в `server/.env` (см. также `.env.example`):

```bash
YANDEX_METRIKA_COUNTER_ID=112291401
YANDEX_METRIKA_OAUTH_TOKEN=your_oauth_token
BITRIX_CONVERSION_GOALS={"C2:UC_MEETING":"meeting_held","C2:WON":"won"}
BITRIX_UF_CLIENT_ID_CODE=
BITRIX_UF_YCLID_CODE=
```

- `BITRIX_CONVERSION_GOALS` — JSON: ключ = `STATUS_ID` сделки, значение = идентификатор цели в Метрике.
- `BITRIX_UF_*` — опционально; если пусто, `client_id`/`yclid` берутся из `COMMENTS` связанного лида.

### 2. Ручной запуск

```bash
cd /opt/maxima-consulting/apps/mc-site-v.4/server
npm run export:conversions
```

Логи: `server/data/conversion-export.log`

### 3. Cron (ежедневно в 04:00 UTC)

```bash
sudo crontab -e
```

```cron
0 4 * * * cd /opt/maxima-consulting/apps/mc-site-v.4/server && /usr/bin/node scripts/export-offline-conversions.js >> data/conversion-export-cron.log 2>&1
```

Убедиться, что каталог `server/data/` доступен пользователю cron (обычно `www-data` или `root`).

### 4. Проверка

1. Создать в Bitrix24 сделку в стадии из `BITRIX_CONVERSION_GOALS` со связанным лидом, у которого в комментарии есть `client_id:` или `yclid:`.
2. Запустить скрипт вручную.
3. Проверить `conversion-export.log` — статус `completed`, `uploaded > 0`.
4. В Метрике — раздел офлайн-конверсий / отчёт по целям (задержка до нескольких часов).
