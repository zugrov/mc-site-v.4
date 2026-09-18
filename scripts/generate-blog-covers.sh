#!/usr/bin/env bash
# Генерация обложек статей из Visual/ → public/images/blog/{slug}-cover.jpg
# Visual не деплоится; в git коммитятся только файлы в public/images/blog/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VISUAL="$ROOT/Visual"
OUT="$ROOT/public/images/blog"
TMP="/tmp/blog-covers-gen-$$"

if [[ ! -d "$VISUAL" ]]; then
  echo "Нет каталога Visual/: положите исходники (jpg/png/mp4) и запустите снова."
  exit 1
fi

mkdir -p "$OUT" "$TMP"

SLUGS=(
  nds-2026-usn-poroga-20mln
  upravlenchesky-uchet-s-nulya
  kejs-ekonomiya-nds-3-4-mln
  nds-2026-usn-kto-platit-i-marzha
  pribyl-est-a-deneg-net
  nds-22-s-vychetom-ili-5-7-bez-vycheta
  realnaya-marzha-po-klientam
  unit-ekonomika-marketplejs
  upravlenchesky-uchet-zachem-esli-est-buhgalter
  kassovyj-razryv-prognoz-30-60-dnej
  finmodel-dlya-investora-ili-banka
  zakonnoe-snizhenie-nalogov-2026
  vneshnij-finansovyj-direktor-vmesto-shtatnogo-cfo
  podveshennaya-zadolzhennost-mezhdu-svoimi-kompaniyami
  sbp-ne-otmenyaet-kassu
)

SOURCES=(
  pexels-olia-danilevich-5466788.jpg
  neat.png
  7947402-hd_1920_1080_30fps.mp4
  4393479-hd_1920_1080_30fps.mp4
  12920674-hd_1920_1080_30fps.mp4
  18743334-hd_1920_1080_60fps.mp4
  7055025-uhd_3840_2160_24fps.mp4
  5651765-uhd_3840_2160_25fps.mp4
  855388-uhd_3840_2160_25fps.mp4
  8479055-uhd_3840_2160_25fps.mp4
  14881643_1920_1080_30fps.mp4
  3130284-uhd_3840_2160_30fps.mp4
  6266426-uhd_3840_2160_25fps.mp4
  6700253-uhd_3840_2160_25fps.mp4
  6037155-hd_4096_2160_30fps.mp4
)

make_thumb() {
  local src="$1" thumb="$2"
  rm -f "$TMP"/*.png
  if [[ "$src" == *.mp4 ]]; then
    qlmanage -t -s 1600 -o "$TMP" "$src" >/dev/null 2>&1
    local base
    base=$(basename "$src")
    if [[ -f "$TMP/${base}.png" ]]; then
      mv "$TMP/${base}.png" "$thumb"
    else
      local f
      f=$(ls "$TMP"/*.png 2>/dev/null | head -1)
      [[ -n "$f" ]] && mv "$f" "$thumb"
    fi
  else
    sips -s format png "$src" --out "$thumb" >/dev/null
  fi
}

for i in "${!SLUGS[@]}"; do
  slug="${SLUGS[$i]}"
  src_name="${SOURCES[$i]}"
  src="$VISUAL/$src_name"
  [[ -f "$src" ]] || { echo "Пропуск $slug: нет $src"; continue; }
  thumb="$TMP/${slug}.png"
  make_thumb "$src" "$thumb"
  [[ -f "$thumb" ]] || { echo "Не удалось превью: $slug"; continue; }
  if sips -s format webp -Z 1600 "$thumb" --out "$OUT/${slug}-cover.webp" >/dev/null 2>&1; then
    echo "OK ${slug}-cover.webp"
  else
    sips -Z 1600 "$thumb" --out "$OUT/${slug}-cover.jpg" >/dev/null
    echo "OK ${slug}-cover.jpg"
  fi
done

rm -rf "$TMP"
echo "Готово. В MDX: coverImage и ogImage → /blog/images/blog/{slug}-cover.jpg"
