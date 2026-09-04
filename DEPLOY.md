# Деплой mc-site-v4 на VPS

Статический лендинг maxima consulting. Основной домен: **maximaconsulting.ru**.  
Редирект: **maxima-consulting.ru** → 301 на основной.

## Требования

- Ubuntu/Debian VPS с nginx
- certbot (`certbot python3-certbot-nginx`)
- git, rsync
- DNS: A-записи `@` и `www` для обоих доменов → IP VPS

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
  -d maximaconsulting.ru \
  -d www.maximaconsulting.ru \
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

- https://maximaconsulting.ru — лендинг
- https://maxima-consulting.ru — редирект 301 на основной
- https://maximaconsulting.ru/sitemap.xml
- https://maximaconsulting.ru/robots.txt
- https://maximaconsulting.ru/api/health — Lead API (должен вернуть `{"status":"ok"}`)

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

### 4. Проверка end-to-end

```bash
curl -s http://127.0.0.1:3001/api/health
curl -s -X POST http://127.0.0.1:3001/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","contact":"@testuser","role":"owner","industry":"trade","revenue":"under_20","question":"Тестовый вопрос для проверки","urgency":"researching","consent_pdn":true}'
```

После деплоя nginx перезагрузить: `sudo nginx -t && sudo systemctl reload nginx`
