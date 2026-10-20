#!/usr/bin/env bash
# Деплой статики, nginx-конфига и Lead API.
# Юнит API по умолчанию — maxima-lead-api (см. DEPLOY.md).
# Другое имя: API_SYSTEMD_SERVICE=my-api ./deploy/deploy.sh
set -euo pipefail

SRC="/opt/maxima-consulting/apps/mc-site-v.4"
DST="/var/www/maxima-consulting/static/mc-site-v4"
API_SYSTEMD_SERVICE="${API_SYSTEMD_SERVICE:-maxima-lead-api}"
NGINX_AVAILABLE="${NGINX_AVAILABLE:-/etc/nginx/sites-available/maximaconsulting.conf}"
NGINX_ENABLED="${NGINX_ENABLED:-/etc/nginx/sites-enabled/maximaconsulting.conf}"
NGINX_SRC="$SRC/deploy/nginx/maximaconsulting.conf"

NGINX_BACKUP="$(mktemp)"
NGINX_HAD_PREVIOUS=0

cleanup() {
  rm -f "$NGINX_BACKUP"
}
trap cleanup EXIT

# Снимок текущего конфига до git pull: симлинк может указывать в репозиторий.
if [[ -e "$NGINX_ENABLED" || -L "$NGINX_ENABLED" ]]; then
  cp -L "$NGINX_ENABLED" "$NGINX_BACKUP"
  NGINX_HAD_PREVIOUS=1
elif [[ -e "$NGINX_AVAILABLE" || -L "$NGINX_AVAILABLE" ]]; then
  cp -L "$NGINX_AVAILABLE" "$NGINX_BACKUP"
  NGINX_HAD_PREVIOUS=1
fi

cd "$SRC"
git pull origin main

if [[ -f blog-app/package.json ]]; then
  (cd blog-app && npm ci --legacy-peer-deps && npm run build)
fi

mkdir -p "$DST"
rsync -av --delete "$SRC/" "$DST/" \
  --exclude .git \
  --exclude deploy \
  --exclude Visual \
  --exclude blog-app/node_modules \
  --exclude maxima-consulting-pro/node_modules \
  --exclude maxima-financial-diagnostics-pro/node_modules \
  --exclude maxima-nds-2026-pro/node_modules \
  --exclude server/node_modules \
  --exclude server/.env \
  --exclude server/data

apply_nginx_config() {
  if [[ ! -f "$NGINX_SRC" ]]; then
    echo "Нет файла nginx-конфига: $NGINX_SRC" >&2
    return 1
  fi

  mkdir -p "$(dirname "$NGINX_AVAILABLE")"
  cp "$NGINX_SRC" "$NGINX_AVAILABLE"
  ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"

  if nginx -t; then
    systemctl reload nginx
    echo "Nginx config applied"
    return 0
  fi

  echo "nginx -t не прошёл, откатываю предыдущий конфиг" >&2
  if [[ "$NGINX_HAD_PREVIOUS" -eq 1 && -s "$NGINX_BACKUP" ]]; then
    cp "$NGINX_BACKUP" "$NGINX_AVAILABLE"
    ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"
    nginx -t || true
  else
    rm -f "$NGINX_ENABLED"
    rm -f "$NGINX_AVAILABLE"
  fi
  return 1
}

apply_nginx_config

if [[ -f "$SRC/server/package.json" ]]; then
  (cd "$SRC/server" && npm ci --omit=dev)
fi

if ! systemctl cat "${API_SYSTEMD_SERVICE}.service" >/dev/null 2>&1; then
  echo "Не найден systemd-unit ${API_SYSTEMD_SERVICE}.service." >&2
  echo "Ожидается maxima-lead-api (DEPLOY.md). Имя задаётся переменной API_SYSTEMD_SERVICE." >&2
  exit 1
fi

systemctl restart "$API_SYSTEMD_SERVICE"
systemctl is-active --quiet "$API_SYSTEMD_SERVICE"
echo "API service restarted: $API_SYSTEMD_SERVICE"
echo "Deployed to $DST"
