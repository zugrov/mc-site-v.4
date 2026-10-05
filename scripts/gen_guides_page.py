#!/usr/bin/env python3
"""Генерация хаба /gajdy — каталог PDF и HTML-гайдов."""
import html
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from guides_catalog import load_guides
from pro_css import load_diag_css
from publish_common import YANDEX_METRIKA
from service_landing_common import (
    BRAND_INNER,
    EXTRA_CSS,
    HUB_PRO_THEME_CSS,
    SITE_HOME,
    footer_html,
    json_ld_script,
)
from site_nav import nav_guides_hub_desktop, nav_guides_hub_mobile

I = {
    "aur": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "men": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>',
    "x": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    "chr": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
}

BLOG_HREF = "/blog/"

GUIDES_CSS = """
.guides-section { padding: 0 0 80px; }
.guides-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; margin-top: 28px; }
.guide-card {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 22px 20px;
  background: #111313;
  display: flex;
  flex-direction: column;
  min-height: 220px;
}
.guide-card h2 { margin: 10px 0 8px; font-size: 20px; font-family: 'Space Grotesk', sans-serif; letter-spacing: -.03em; }
.guide-card p { flex: 1; margin: 0; font-size: 14px; line-height: 1.5; color: #a8aea6; }
.guide-card__meta { margin-top: 12px; font-family: 'DM Mono', monospace; font-size: 10px; color: #7a8279; letter-spacing: .06em; text-transform: uppercase; }
.guide-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.guide-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  border: 1px solid rgba(13, 148, 136, .45);
  color: var(--accent-light);
}
.guide-badge--pdf { border-color: rgba(215, 243, 107, .35); color: #d7f36b; }
.guide-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--line); }
.guides-empty {
  margin-top: 28px;
  padding: 28px 24px;
  border: 1px dashed rgba(238, 234, 225, .2);
  border-radius: 12px;
  color: #a8aea6;
  font-size: 15px;
  line-height: 1.55;
  max-width: 640px;
}
.guides-empty a { color: var(--accent-light); font-weight: 600; }
.guides-note { margin-top: 40px; font-size: 13px; color: #7a8279; max-width: 560px; line-height: 1.5; }
.guides-cta { margin-top: 48px; padding: 24px; border: 1px solid rgba(13, 148, 136, .35); border-radius: 14px; background: rgba(13, 148, 136, .06); }
.guides-cta h2 { margin: 0 0 8px; font-size: 22px; }
.guides-cta p { margin: 0 0 16px; color: #a8aea6; font-size: 14px; }
"""

CSS = load_diag_css(
    ROOT / "maxima-financial-diagnostics-pro/client/src/index.css",
    EXTRA_CSS + GUIDES_CSS,
)

BASE_JS = """
(function () {
  var header = document.querySelector(".site-header");
  var menuBtn = document.getElementById("menuToggle");
  if (menuBtn && header) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("site-header--open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.innerHTML = open ? __MENU_CLOSE__ : __MENU_OPEN__;
    });
  }
  document.querySelectorAll(".mobile-nav a").forEach(function (el) {
    el.addEventListener("click", function () { header.classList.remove("site-header--open"); });
  });
})();
"""


def js_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


BASE_JS = BASE_JS.replace("__MENU_OPEN__", js_str(I["men"])).replace("__MENU_CLOSE__", js_str(I["x"]))


def guide_card(g: dict) -> str:
    title = html.escape(str(g.get("title", "")))
    desc = html.escape(str(g.get("description", "")))
    updated = g.get("updated")
    meta = f"Обновлено: {html.escape(str(updated))}" if updated else ""
    badges: list[str] = []
    actions: list[str] = []
    if g.get("pdf"):
        badges.append('<span class="guide-badge guide-badge--pdf">PDF</span>')
        pdf_url = html.escape(str(g["pdf"]))
        actions.append(
            f'<a class="button button--small button--outline" href="{pdf_url}" '
            f'target="_blank" rel="noopener">Скачать PDF {I["aur"]}</a>'
        )
    if g.get("html"):
        badges.append('<span class="guide-badge">HTML</span>')
        html_url = html.escape(str(g["html"]))
        actions.append(
            f'<a class="button button--small button--lime" href="{html_url}">Читать онлайн {I["aur"]}</a>'
        )
    badge_html = '<div class="guide-badges">' + "".join(badges) + "</div>" if badges else ""
    actions_html = '<div class="guide-actions">' + "".join(actions) + "</div>" if actions else ""
    meta_html = f'<div class="guide-card__meta">{meta}</div>' if meta else ""
    return (
        f'<article class="guide-card reveal">'
        f'<span class="section-index">гайд</span>{badge_html}'
        f"<h2>{title}</h2><p>{desc}</p>{meta_html}{actions_html}</article>"
    )


def guides_list_html() -> str:
    guides = load_guides()
    published = [g for g in guides if g.get("title")]
    if not published:
        return (
            '<p class="guides-empty">Здесь будут практические гайды в формате '
            '<strong>PDF</strong> и/или <strong>HTML</strong> — чек-листы и разборы для собственников. '
            f'Пока можно читать <a href="{BLOG_HREF}">статьи в блоге</a>.</p>'
        )
    cards = "".join(guide_card(g) for g in published)
    return f'<div class="guides-grid">{cards}</div>'


def header_block() -> str:
    return f"""
    <header class="site-header" id="siteHeader">
      <div class="container header-inner">
        <a class="brand" href="{SITE_HOME}">{BRAND_INNER}</a>
        <nav class="desktop-nav" aria-label="Основная навигация">
          {nav_guides_hub_desktop()}
        </nav>
        <div class="header-actions">
          <a class="header-phone" href="tel:+79808488480">+7 980 848-84-80</a>
          <a class="button button--small button--outline" href="{SITE_HOME}#contact">Записаться на разбор {I["aur"]}</a>
          <button class="menu-toggle" id="menuToggle" type="button" aria-label="Открыть меню" aria-expanded="false">{I["men"]}</button>
        </div>
      </div>
      <nav class="mobile-nav" aria-label="Мобильная навигация">
        {nav_guides_hub_mobile(I["chr"])}
        <a class="button button--lime" href="{SITE_HOME}#contact">Записаться на разбор {I["aur"]}</a>
      </nav>
    </header>
"""


def render() -> str:
    url = f"{SITE_HOME}gajdy"
    schema = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Гайды maxima consulting",
            "description": "Практические материалы для собственников: PDF и HTML-гайды по финансам и налогам.",
            "url": url,
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Главная", "item": SITE_HOME},
                {"@type": "ListItem", "position": 2, "name": "Гайды", "item": url},
            ],
        },
    ]
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="canonical" href="{url}" />
  <title>Гайды для собственников бизнеса — maxima consulting</title>
  <meta name="description" content="Практические гайды в PDF и HTML: чек-листы и разборы по управленческому учёту, налогам и деньгам в бизнесе МСБ." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>.container {{ width: 100%; max-width: 1280px; margin-inline: auto; padding-inline: 40px; }}
{CSS}
{HUB_PRO_THEME_CSS}
  </style>
{json_ld_script(schema)}
{YANDEX_METRIKA}
</head>
<body>
  <div class="site-shell">
{header_block()}
    <main>
      <section class="hero section-grid hub-hero">
        <div class="container hub-hero-grid">
          <div class="hero-copy reveal">
            <nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="{SITE_HOME}">Главная</a> → <span>Гайды</span></nav>
            <div class="eyebrow"><span class="eyebrow-dot"></span> Материалы для скачивания и чтения</div>
            <h1>Гайды для <em>собственников</em></h1>
            <p class="hero-lead">Чек-листы и разборы в удобном формате: скачайте PDF или читайте в браузере. Без воды — только то, что можно применить в учёте и решениях.</p>
          </div>
        </div>
      </section>
      <section class="section guides-section">
        <div class="container reveal">
          <span class="section-index">каталог</span>
          <h2>Все <em>гайды</em></h2>
          {guides_list_html()}
          <aside class="guides-cta">
            <h2>Нужен разбор под вашу компанию?</h2>
            <p>30 минут, без обязательств — обсудим ситуацию и подскажем, с чего начать.</p>
            <a class="button button--lime" href="{SITE_HOME}#contact">Записаться на разбор {I["aur"]}</a>
          </aside>
        </div>
      </section>
    </main>
{footer_html("gajdy_s1")}
  </div>
  <script>{BASE_JS}</script>
</body>
</html>
"""


def main() -> None:
    out = ROOT / "gajdy.html"
    out.write_text(render(), encoding="utf-8")
    print("OK", out.name)


if __name__ == "__main__":
    main()
