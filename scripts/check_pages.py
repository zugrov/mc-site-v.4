#!/usr/bin/env python3
"""Проверки SEO и вёрстки для CI: URL, title, description, один H1, без Google Fonts."""
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "seo_inventory_2026-11-25.csv"
if not INVENTORY.is_file():
    # Файл инвентаризации живёт рядом с ТЗ и может быть скопирован в корень вручную.
    alt = list(ROOT.glob("seo_inventory*.csv"))
    INVENTORY = alt[0] if alt else INVENTORY

GUIDES = [
    "5-shagov-nalogovoj-bezopasnosti",
    "5-signalov-poteri-upravlyaemosti",
    "ausn-bez-mifov",
    "droblenie-chek-list-gruppy",
    "kalkulyator-nds-i-pribyli",
    "nds-i-pribyl-usn-osno",
    "regionalnye-lgoty-usn",
    "upravlenchesky-uchet-s-nulya",
]


def path_for(url: str) -> Path:
    slug = url.replace("https://maxima-consulting.ru", "") or "/"
    if slug == "/":
        return ROOT / "index.html"
    if slug.endswith("/") and slug.startswith("/blog/"):
        return ROOT / "blog" / slug.strip("/") .split("/", 1)[1] / "index.html" if slug != "/blog/" else ROOT / "blog" / "index.html"
    if slug.startswith("/guides/"):
        name = slug.strip("/").split("/", 1)[1]
        return ROOT / "guides" / name / "index.html"
    if slug.endswith(".html"):
        return ROOT / slug.lstrip("/")
    return ROOT / f"{slug.strip('/')}.html"


def meta(html: str, name: str) -> str:
    match = re.search(
        rf'<meta[^>]+name="{name}"[^>]+content="([^"]*)"',
        html,
        re.I,
    )
    if not match:
        match = re.search(
            rf'<meta[^>]+content="([^"]*)"[^>]+name="{name}"',
            html,
            re.I,
        )
    return match.group(1) if match else ""


def title_of(html: str) -> str:
    match = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    if not match:
        return ""
    text = match.group(1).replace("&amp;", "&").replace("&#38;", "&")
    return re.sub(r"\s+", " ", text).strip()


def main() -> int:
    errors = []
    if not INVENTORY.is_file():
        print("Нет seo_inventory CSV — проверка title пропущена")
        rows = []
    else:
        rows = list(csv.DictReader(INVENTORY.open(encoding="utf-8")))

    checked = 0
    for row in rows:
        url = row["url"]
        path = path_for(url)
        if not path.is_file():
            errors.append(f"нет файла для {url} -> {path}")
            continue
        html = path.read_text(encoding="utf-8")
        checked += 1
        got_title = title_of(html)
        if got_title != row["title"]:
            errors.append(f"title {url}: {got_title!r} != {row['title']!r}")
        description = meta(html, "description")
        # Пустое description в инвентаризации оставляем пустым.
        if row["desc_len"] not in ("0", "") and not description:
            errors.append(f"пропало description {url}")
        h1 = len(re.findall(r"<h1\b", html, re.I))
        if h1 != 1:
            errors.append(f"H1={h1} {url}")
        if "fonts.googleapis.com" in html or "fonts.gstatic.com" in html:
            errors.append(f"Google Fonts {url}")
        if 'rel="canonical"' not in html and "rel='canonical'" not in html:
            errors.append(f"нет canonical {url}")

    for slug in GUIDES:
        path = ROOT / "guides" / slug / "index.html"
        if not path.is_file():
            errors.append(f"нет гайда {slug}")
            continue
        html = path.read_text(encoding="utf-8")
        if "fonts.googleapis.com" in html:
            errors.append(f"Google Fonts в гайде {slug}")
        if f"/guides/{slug}/" not in html:
            errors.append(f"нет canonical гайда {slug}")

    home = (ROOT / "index.html").read_text(encoding="utf-8")
    for needle in ("3 429 410", "5–990", "20 млн", "15 000", "22%", "12%", "@maxima_com", "+7 980 848-84-80"):
        plain = home.replace("&nbsp;", " ").replace("&#160;", " ")
        if needle not in plain and needle not in home:
            errors.append(f"на главной нет цифры или контакта: {needle}")
    if "снижаем налоги" in home.lower().replace("снижаем налоги", "снижаем налоги"):
        # Фраза допустима только в сохранённых meta, не в новом тексте секций.
        body = re.sub(r"<head>.*?</head>", "", home, flags=re.S | re.I)
        if "снижаем налоги" in body.lower():
            errors.append("фраза «снижаем налоги» появилась в тексте главной")

    print(f"проверено URL: {checked}")
    if errors:
        print("\n".join(errors))
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
