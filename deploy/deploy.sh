#!/usr/bin/env bash
set -euo pipefail

SRC="/opt/maxima-consulting/apps/mc-site-v.4"
DST="/var/www/maxima-consulting/static/mc-site-v4"

cd "$SRC"
git pull origin main

mkdir -p "$DST"
rsync -av --delete "$SRC/" "$DST/" \
  --exclude .git \
  --exclude deploy

echo "Deployed to $DST"
