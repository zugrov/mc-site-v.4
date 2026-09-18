#!/usr/bin/env bash
set -euo pipefail

SRC="/opt/maxima-consulting/apps/mc-site-v.4"
DST="/var/www/maxima-consulting/static/mc-site-v4"

cd "$SRC"
git pull origin main

if [ -f blog-app/package.json ]; then
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
  --exclude maxima-nds-2026-pro/node_modules

echo "Deployed to $DST"
