#!/usr/bin/env python3
"""Проставляет общую шапку, шрифты и токены на уже собранные HTML-страницы."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from site_chrome import (  # noqa: E402
    HEAD_ASSETS,
    MOTION_SCRIPT,
    apply_page,
    footer_html,
    header_html,
    lead_form_html,
)

LANDINGS = [
    "uslugi.html",
    "gajdy.html",
    "financial-diagnostics.html",
    "nds-2026.html",
    "upravlenchesky-uchet.html",
    "finansovaya-model.html",
    "nalogovaya-optimizatsiya.html",
    "cfo-light.html",
    "advisory-dlya-sobstvennika.html",
    "nda.html",
    "privacy.html",
]

CTA = {
    "uslugi.html": "#request",
    "gajdy.html": "#request",
    "financial-diagnostics.html": "#request",
    "nds-2026.html": "#request",
    "upravlenchesky-uchet.html": "#request",
    "finansovaya-model.html": "#request",
    "nalogovaya-optimizatsiya.html": "#request",
    "cfo-light.html": "#request",
    "advisory-dlya-sobstvennika.html": "#request",
}

CURRENT = {
    "uslugi.html": "uslugi",
    "gajdy.html": "gajdy",
}

CANONICAL = {
    "nda.html": "https://maxima-consulting.ru/nda.html",
    "privacy.html": "https://maxima-consulting.ru/privacy",
}

DRAFT_NOTE = (
    "<!-- TODO(owner): черновик. Удалить или закрыть от индексации? "
    "ТЗ 4.13. Сейчас страница оставлена как была. -->\n"
)


def ensure_canonical(html: str, url: str) -> str:
    if 'rel="canonical"' in html or "rel='canonical'" in html:
        return html
    tag = f'<link rel="canonical" href="{url}">\n'
    return html.replace("</title>", "</title>\n  " + tag, 1)


def soften_fonts(html: str) -> str:
    html = html.replace("fonts.googleapis.com", "fonts.googleapis.com")
    html = html.replace("font-family: 'Inter'", "font-family: Manrope, Arial")
    html = html.replace("font-family:'Inter'", "font-family:Manrope,Arial")
    html = html.replace('font-family: "Inter"', "font-family: Manrope, Arial")
    html = html.replace("font-family:Inter", "font-family:Manrope,Arial")
    return html


def main() -> None:
    for name in LANDINGS:
        path = ROOT / name
        html = soften_fonts(path.read_text(encoding="utf-8"))
        theme = name not in {"nda.html", "privacy.html"}
        html = apply_page(
            html,
            current=CURRENT.get(name, ""),
            cta_href=CTA.get(name, "/#contact"),
            theme=theme,
        )
        if name in CANONICAL:
            html = ensure_canonical(html, CANONICAL[name])
        path.write_text(html, encoding="utf-8")
        print("page", name, "chrome", "data-mc-chrome" in html, "google", "fonts.googleapis.com" in html)

    guide_form = (
        '<section class="guide-cta-band" id="request">'
        "<h2>Нужен разбор под вашу компанию?</h2>"
        "<p>30 минут, без обязательств.</p>"
        + lead_form_html("guide")
        + "</section>\n"
    )
    for path in sorted((ROOT / "guides").glob("*/index.html")):
        slug = path.parent.name
        html = soften_fonts(path.read_text(encoding="utf-8"))
        html = apply_page(html, current="gajdy", theme=False)
        # apply_page не трогает внутренние <footer> гайда: шапка уже вставлена,
        # если тега header не было — ниже страхуемся отдельно.
        if "data-mc-chrome" not in html:
            html = html.replace(
                "<body>",
                "<body>\n" + header_html("gajdy") + '<main id="content">',
                1,
            )
            html = html.replace(
                "</body>",
                "</main>\n" + guide_form + footer_html() + MOTION_SCRIPT + "\n</body>",
                1,
            )
        elif 'id="request"' not in html:
            html = html.replace(
                "</body>",
                guide_form + "\n</body>",
                1,
            )
        html = ensure_canonical(html, f"https://maxima-consulting.ru/guides/{slug}/")
        if "/assets/lead-form.js" not in html:
            html = html.replace(
                "</body>",
                '<script src="/assets/lead-form.js?v=20260905" defer></script>\n</body>',
                1,
            )
        if "reading" not in html:
            html = html.replace("<body", '<body data-reading', 1)
        path.write_text(html, encoding="utf-8")
        print("guide", slug, "google", "fonts.googleapis.com" in html)

    for path in list(ROOT.glob("variant-*.html")) + list(ROOT.glob("preview-*.html")):
        html = path.read_text(encoding="utf-8")
        if "TODO(owner): черновик" not in html:
            html = html.replace("<head>", "<head>\n  " + DRAFT_NOTE, 1)
        import re
        html = soften_fonts(html)
        html = re.sub(r"<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*", "", html, flags=re.I)
        html = re.sub(r"@import\s+url\(['\"]https://fonts\.googleapis\.com[^)]+\);?", "", html, flags=re.I)
        html = html.replace("Cormorant Garamond", "Manrope")
        if "assets/fonts.css" not in html:
            html = html.replace("</head>", HEAD_ASSETS + "\n</head>", 1)
        path.write_text(html, encoding="utf-8")
        print("draft", path.name, "google", "fonts.googleapis.com" in html)

    gajdy = ROOT / "gajdy.html"
    text = gajdy.read_text(encoding="utf-8")
    if 'data-view-toggle' not in text and 'class="guides-grid"' in text:
        text = text.replace(
            '<div class="guides-grid">',
            '<div class="view-toggle" data-view-toggle=".guides-grid">'
            '<button type="button" data-view="grid" aria-pressed="true">Сетка</button>'
            '<button type="button" data-view="list" aria-pressed="false">Список</button>'
            '</div><div class="guides-grid">',
            1,
        )
    if 'id="request"' not in text:
        text = text.replace(
            "</body>",
            guide_form + "\n</body>",
            1,
        )
    if "/assets/lead-form.js" not in text:
        text = text.replace(
            "</body>",
            '<script src="/assets/lead-form.js?v=20260905" defer></script>\n</body>',
            1,
        )
    gajdy.write_text(text, encoding="utf-8")
    print("gajdy form", 'id="request"' in text)


if __name__ == "__main__":
    main()
