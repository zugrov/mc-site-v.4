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
