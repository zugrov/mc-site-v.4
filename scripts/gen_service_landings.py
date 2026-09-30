#!/usr/bin/env python3
"""Генерация хаба /uslugi и продуктовых лендингов услуг."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from pro_css import load_diag_css
from publish_common import LEAD_FORM_SCRIPT, LEAD_THANKYOU_CSS, YANDEX_METRIKA
from landing_hero_visuals import (
    HUB_MAP_VISUAL_CSS,
    hub_services_visual_html,
    product_hero_for,
)
from service_landing_common import (
    BRAND_INNER,
    EXTRA_CSS,
    HUB_PRO_THEME_CSS,
    SITE_HOME,
    breadcrumb_ld,
    breadcrumbs_html,
    faq_ld,
    footer_html,
    json_ld_script,
    lead_form_html,
    service_ld,
)

I = {
    "aur": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "men": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>',
    "x": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    "chd": '<svg class="icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
    "chk": '<svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
    "chr": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
    "shd": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
}

def hub_card_html(tier: str, title: str, desc: str, term: str, price: str, href: str, center: bool = False) -> str:
    extra = " hub-card--center" if center else ""
    return (
        f'<a class="hub-card reveal{extra}" href="{href}">'
        f'<span class="section-index">{tier}</span><h3>{title}</h3><p>{desc}</p>'
        f'<div class="hub-meta">{term} · {price}</div>'
        f'<span class="hub-card-cta">Подробнее {I["aur"]}</span></a>'
    )

CSS = load_diag_css(
    ROOT / "maxima-financial-diagnostics-pro/client/src/index.css",
    EXTRA_CSS + LEAD_THANKYOU_CSS,
)


def js_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


BASE_JS = """
(function () {
  function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }
  document.querySelectorAll("[data-scroll]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); scrollToId(el.getAttribute("data-scroll")); });
  });
  var header = document.querySelector(".site-header");
  var menuBtn = document.getElementById("menuToggle");
  if (menuBtn && header) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("site-header--open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.innerHTML = open ? __MENU_CLOSE__ : __MENU_OPEN__;
    });
  }
  document.querySelectorAll(".mobile-nav a[data-scroll], .mobile-nav button[data-scroll]").forEach(function (el) {
    el.addEventListener("click", function () { header.classList.remove("site-header--open"); });
  });
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".reveal").forEach(function (node) {
    if (reduced) { node.classList.add("is-visible"); return; }
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 }).observe(node);
  });
  document.querySelectorAll("[data-faq]").forEach(function (item) {
    item.querySelector("button").addEventListener("click", function () {
      var open = item.classList.contains("faq-item--open");
      document.querySelectorAll("[data-faq]").forEach(function (o) {
        o.classList.remove("faq-item--open");
        o.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!open) { item.classList.add("faq-item--open"); item.querySelector("button").setAttribute("aria-expanded", "true"); }
    });
  });
  var floating = document.getElementById("floatingCta");
  var request = document.getElementById("request");
  if (floating && request) {
    new IntersectionObserver(function (entries) { floating.hidden = entries[0].isIntersecting; }, { threshold: 0.12 }).observe(request);
    window.addEventListener("scroll", function () {
      if (window.scrollY < 600) floating.hidden = true;
    }, { passive: true });
  }
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (!target || reduced) { el.textContent = target.toLocaleString("ru-RU"); return; }
    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      obs.unobserve(el);
      var start = 0, dur = 900, t0 = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.floor(start + (target - start) * p).toLocaleString("ru-RU");
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.3 }).observe(el);
  });
})();
""".replace("__MENU_OPEN__", js_str(I["men"])).replace("__MENU_CLOSE__", js_str(I["x"]))

QUIZ_JS = """
(function () {
  var routes = {
    nds: { title: "НДС-аудит и подготовка к НДС-2026", href: "/nds-2026" },
    diag: { title: "Финансовая диагностика", href: "/financial-diagnostics" },
    uchet: { title: "Управленческий учёт", href: "/upravlenchesky-uchet" },
    model: { title: "Финансовая модель", href: "/finansovaya-model" },
    tax: { title: "Налоговая оптимизация", href: "/nalogovaya-optimizatsiya" },
    cfo: { title: "CFO-light", href: "/cfo-light" },
    adv: { title: "Advisory для собственника", href: "/advisory-dlya-sobstvennika" },
    contact: { title: "Бесплатный разбор", href: "/#contact" }
  };
  var scores = {};
  var steps = document.querySelectorAll(".quiz-step");
  var result = document.getElementById("quizResult");
  var progressBar = document.getElementById("quizProgressBar");
  var progressLabel = document.getElementById("quizProgressLabel");
  function showStep(n) {
    steps.forEach(function (s) { s.classList.toggle("is-active", s.dataset.step === String(n)); });
    if (progressBar) {
      progressBar.style.width = n >= 4 ? "100%" : String(Math.round((n / 3) * 100)) + "%";
    }
    if (progressLabel) {
      progressLabel.textContent = n >= 4 ? "Рекомендация готова" : "Шаг " + n + " из 3 — выберите вариант";
    }
  }
  showStep(1);
  document.querySelectorAll("[data-quiz]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-quiz");
      var step = parseInt(btn.getAttribute("data-step"), 10);
      scores[key] = (scores[key] || 0) + 1;
      if (step < 3) { showStep(step + 1); return; }
      var best = "contact", max = 0;
      Object.keys(scores).forEach(function (k) {
        if (scores[k] > max) { max = scores[k]; best = k; }
      });
      var pick = routes[best] || routes.contact;
      result.innerHTML = "<p><strong>Вам подойдёт:</strong> " + pick.title + "</p><p>Можно уточнить детали на странице услуги или записаться на бесплатный разбор.</p><p><a class=\"button button--lime\" href=\"" + pick.href + "\">Перейти к услуге</a> <button type=\"button\" class=\"text-link\" data-scroll=\"request\" style=\"margin-left:12px\">Записаться на разбор</button></p>";
      showStep(4);
    });
  });
})();
"""


def faq_html(faqs: list[tuple[str, str]]) -> str:
    parts = []
    for i, (q, a) in enumerate(faqs):
        open_cls = " faq-item--open" if i == 0 else ""
        parts.append(
            f'<div class="faq-item{open_cls}" data-faq><button type="button" aria-expanded="{"true" if i == 0 else "false"}"><span><small>0{i + 1}</small>{q}</span>{I["chd"]}</button><div class="faq-answer"><p>{a}</p></div></div>'
        )
    return "\n".join(parts)


def pain_html(pains: list[str]) -> str:
    return "\n".join(
        f'<article class="pain-card reveal reveal--delay-{(i % 3) + 1}"><span class="pain-number">0{i + 1}</span><p>{p}</p></article>'
        for i, p in enumerate(pains)
    )


def steps_html(steps: list[tuple[str, str]]) -> str:
    return "\n".join(
        f'<article class="process-row reveal"><div class="process-row__day"><span>шаг</span><strong>{i + 1:02d}</strong></div><div class="process-row__body"><h3>{title}</h3><p>{desc}</p></div></article>'
        for i, (title, desc) in enumerate(steps)
    )


def pricing_html(cards: list[dict]) -> str:
    parts = []
    for c in cards:
        feat = "".join(f"<li>{x}</li>" for x in c["features"])
        cls = " pricing-card--featured" if c.get("featured") else ""
        parts.append(
            f'<article class="pricing-card{cls}"><h3>{c["title"]}</h3><div class="price">{c["price"]}</div><p style="font-size:13px;color:#9aa19a">{c["term"]}</p><ul>{feat}</ul></article>'
        )
    return '<div class="pricing-grid">' + "".join(parts) + "</div>"


def next_step_html(links: list[tuple[str, str]]) -> str:
    inner = "".join(f'<a href="{href}">{label}</a>' for href, label in links)
    return f'<aside class="next-step reveal"><h3>Логичный следующий шаг</h3><p>Если задача шире одной услуги — посмотрите смежные форматы или вернитесь к карте услуг.</p><div class="next-step-links">{inner}<a href="/uslugi">Все услуги</a></div></aside>'


def header_block(is_hub: bool = False) -> str:
    if is_hub:
        services_desktop = '<a href="#services-map" data-scroll="services-map">Услуги</a>'
        services_mobile = f'<a href="#services-map" data-scroll="services-map">Услуги {I["chr"]}</a>'
        pricing_desktop = ""
        pricing_mobile = ""
    else:
        services_desktop = '<a href="/uslugi#services-map">Услуги</a>'
        services_mobile = f'<a href="/uslugi#services-map">Услуги {I["chr"]}</a>'
        pricing_desktop = '<a href="#pricing" data-scroll="pricing">Цены</a>'
        pricing_mobile = f'<a href="#pricing" data-scroll="pricing">Цены {I["chr"]}</a>'
    return f"""
    <header class="site-header" id="siteHeader">
      <div class="container header-inner">
        <a class="brand" href="{SITE_HOME}">{BRAND_INNER}</a>
        <nav class="desktop-nav" aria-label="Основная навигация">
          {services_desktop}{pricing_desktop}<a href="#faq" data-scroll="faq">FAQ</a><a href="/blog/">Статьи</a>
        </nav>
        <div class="header-actions">
          <a class="header-phone" href="tel:+79808488480">+7 980 848-84-80</a>
          <button class="button button--small button--outline" type="button" data-scroll="request">Разобрать ситуацию {I["aur"]}</button>
          <button class="menu-toggle" id="menuToggle" type="button" aria-label="Открыть меню" aria-expanded="false">{I["men"]}</button>
        </div>
      </div>
      <nav class="mobile-nav" aria-label="Мобильная навигация">
        {services_mobile}{pricing_mobile}<a href="#faq" data-scroll="faq">FAQ {I["chr"]}</a>
        <a href="/blog/">Статьи {I["chr"]}</a>
        <button class="button button--lime" type="button" data-scroll="request">Разобрать ситуацию {I["aur"]}</button>
      </nav>
    </header>
"""


def render_product(page: dict) -> str:
    url = f"{SITE_HOME}{page['slug']}"
    schema = [
        service_ld(page["service_name"], page["meta_description"], url, page["price_from"]),
        breadcrumb_ld(page["breadcrumb"], url),
        faq_ld(page["faqs"]),
    ]
    fit = ""
    if page.get("fit_yes"):
        fit = f"""
      <section class="section section--ink" id="fit">
        <div class="container reveal">
          <span class="section-index">fit</span><h2>Кому подходит <em>и кому нет</em></h2>
          <div class="fit-grid">
            <div class="fit-col"><h3>Подходит</h3><ul>{"".join(f"<li>{x}</li>" for x in page["fit_yes"])}</ul></div>
            <div class="fit-col"><h3>Не подходит</h3><ul>{"".join(f"<li>{x}</li>" for x in page["fit_no"])}</ul></div>
          </div>
        </div>
      </section>
"""
    case = ""
    if page.get("case_html"):
        case = f'<section class="section case-section"><div class="container reveal">{page["case_html"]}</div></section>'

    hero_visual_html, page_hero_css = product_hero_for(page.get("hero_visual"), I)

    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/favicon.ico" sizes="48x48" />
  <link rel="canonical" href="{url}" />
  <title>{page["title"]}</title>
  <meta name="description" content="{page["meta_description"]}" />
  <meta property="og:title" content="{page["title"]}" />
  <meta property="og:description" content="{page["meta_description"]}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>.container {{ width: 100%; max-width: 1280px; margin-inline: auto; padding-inline: 40px; }}
{CSS}
{page_hero_css}
.floating-cta {{ position: fixed; right: 20px; bottom: 20px; z-index: 30; display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: 999px; background: #d7f36b; color: #11140f; font-weight: 800; border: 0; cursor: pointer; box-shadow: 0 12px 40px rgba(0,0,0,.35); }}
.floating-cta[hidden] {{ display: none !important; }}
  </style>
{json_ld_script(schema)}
{YANDEX_METRIKA}
</head>
<body>
  <div class="site-shell">
    <div class="noise" aria-hidden="true"></div>
{header_block()}
    <main id="top">
      <section class="hero section-grid">
        <div class="container hero-grid">
          <div class="hero-copy reveal">
            {breadcrumbs_html(page["breadcrumb"])}
            <div class="eyebrow"><span class="eyebrow-dot"></span> {page["eyebrow"]}</div>
            <h1>{page["h1"]}</h1>
            <p class="hero-lead">{page["direct_answer"]}</p>
            <div class="hero-actions">
              <button class="button button--lime button--large" type="button" data-scroll="request">Разобрать ситуацию {I["aur"]}</button>
              <button class="text-link" type="button" data-scroll="pricing">Смотреть цены</button>
            </div>
            <div class="hero-footnote">{I["shd"]} NDA до передачи данных · Первый разбор — бесплатно</div>
          </div>
{hero_visual_html}
        </div>
      </section>
      <section class="section section--ink" id="pain">
        <div class="container">
          <div class="section-intro reveal"><span class="section-index">pain</span><h2>Знакомые <em>симптомы</em></h2></div>
          <div class="pain-grid">{pain_html(page["pains"])}</div>
        </div>
      </section>
      <section class="section process-section" id="method">
        <div class="container">
          <div class="section-intro reveal"><span class="section-index">method</span><h2>Что <em>входит</em></h2></div>
          <div class="process-list">{steps_html(page["steps"])}</div>
        </div>
      </section>
      <section class="section" id="pricing">
        <div class="container reveal">
          <span class="section-index">pricing</span><h2>Цена и <em>формат</em></h2>
          {pricing_html(page["pricing"])}
        </div>
      </section>
      {case}
      {fit}
      <section class="section faq-section" id="faq">
        <div class="container faq-layout">
          <div class="faq-heading reveal"><span class="section-index">faq</span><h2>Частые <em>вопросы</em></h2></div>
          <div class="faq-list reveal reveal--delay-1">{faq_html(page["faqs"])}</div>
        </div>
      </section>
      <section class="section request-section" id="request">
        <div class="container request-layout">
          <div class="request-copy reveal">
            {next_step_html(page["next_links"])}
            <span class="section-index">cta</span><h2>Обсудим <em>на ваших цифрах</em></h2>
            <p>Ответим в течение рабочего дня. Результат — документ и план, не «разговор ради разговора».</p>
          </div>
          <div class="form-card reveal reveal--delay-1">
            {lead_form_html(page["tg_start"], page["submit_label"], I["aur"])}
          </div>
        </div>
      </section>
    </main>
{footer_html(page["tg_start"])}
  </div>
  <button class="floating-cta" id="floatingCta" type="button" data-scroll="request" hidden>
    <span>Разобрать ситуацию</span>
    <span class="floating-cta-price">от {page["price_from"]}</span>
  </button>
  <script>{BASE_JS}</script>
  {LEAD_FORM_SCRIPT}
</body>
</html>
"""


def render_hub() -> str:
    url = f"{SITE_HOME}uslugi"
    services = [
        ("Базовый", "НДС-аудит", "Порог, ставка 22%/5%/7%, риски", "3–5 дней", "от 15 000 ₽", "/nds-2026"),
        ("Базовый", "Финансовая диагностика", "Где теряются деньги в рублях", "7 дней", "от 20 000 ₽", "/financial-diagnostics"),
        ("Проект", "Управленческий учёт", "P&L, ДДС, KPI-дашборд", "4–8 недель", "от 60 000 ₽", "/upravlenchesky-uchet"),
        ("Проект", "Финансовая модель", "3 сценария, NPV/IRR, точка безубыточности", "2–4 недели", "от 40 000 ₽", "/finansovaya-model"),
        ("Проект", "Налоговая оптимизация", "Законные методы, без серых схем", "3–5 недель", "от 60 000 ₽", "/nalogovaya-optimizatsiya"),
        ("Подписка", "CFO-light", "Дашборд и интерпретация цифр", "ежемесячно", "от 20 000 ₽/мес", "/cfo-light"),
        ("Подписка", "Advisory", "Финансовый спарринг собственника", "ежемесячно", "от 40 000 ₽/мес", "/advisory-dlya-sobstvennika"),
    ]
    cards = "".join(
        hub_card_html(tier, title, desc, term, price, href, center=(href == "/advisory-dlya-sobstvennika"))
        for tier, title, desc, term, price, href in services
    )
    faqs = [
        ("Чем услуги отличаются друг от друга?", "Базовые — точка входа с документом за дни. Проекты — внедрение системы или модели. Подписки — регулярная интерпретация цифр и решений."),
        ("Можно ли начать с малого?", "Да. Чаще всего начинают с диагностики или НДС-аудита, затем переходят к учёту или CFO-light."),
        ("Что если не знаю, что нужно?", "Пройдите квиз в начале страницы или оставьте заявку на бесплатный разбор — подскажем формат без обязательств."),
    ]
    schema = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Услуги финансового консалтинга",
            "url": url,
        },
        breadcrumb_ld("Услуги", url),
        faq_ld(faqs),
    ]
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="canonical" href="{url}" />
  <title>Услуги финансового консалтинга для бизнеса — maxima consulting</title>
  <meta name="description" content="НДС-аудит, финансовая диагностика, управленческий учёт, финмодель, налоговая оптимизация и CFO-light для МСБ 5–990 млн ₽. Разбор ситуации бесплатно." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>.container {{ width: 100%; max-width: 1280px; margin-inline: auto; padding-inline: 40px; }}
{CSS}
{HUB_PRO_THEME_CSS}
{HUB_MAP_VISUAL_CSS}
  </style>
{json_ld_script(schema)}
{YANDEX_METRIKA}
</head>
<body>
  <div class="site-shell">
{header_block(is_hub=True)}
    <main>
      <section class="hero section-grid hub-hero"><div class="container hub-hero-grid">
        <div class="hero-copy reveal">
        <nav class="breadcrumbs"><a href="{SITE_HOME}">Главная</a> → <span>Услуги</span></nav>
        <h1>Услуги финансового консалтинга для МСБ</h1>
        <p class="hero-lead">Между бухгалтерским аутсорсом и корпоративным CFO: проекты с документом на выходе и подписки для регулярных решений.</p>
        <button class="button button--lime" type="button" data-scroll="request">Бесплатный разбор {I["aur"]}</button>
        </div>
{hub_services_visual_html()}
      </div></section>
      <section class="hub-quiz-section" id="quiz" aria-labelledby="quiz-title">
        <div class="container">
          <div class="quiz-box quiz-box--hub reveal">
            <span class="quiz-box__eyebrow">Подбор услуги · 3 вопроса · ~1 минута</span>
            <h2 id="quiz-title">Не знаете, с чего начать?</h2>
            <p class="quiz-box__lead">Ответьте на три коротких вопроса — подскажем подходящий формат. На каждом шаге <strong>нажмите один вариант</strong> кнопкой ниже.</p>
            <div class="quiz-progress" aria-hidden="true"><div class="quiz-progress__bar" id="quizProgressBar"></div></div>
            <p class="quiz-progress__label" id="quizProgressLabel">Шаг 1 из 3 — выберите вариант</p>
            <div class="quiz-step is-active" data-step="1">
              <p>Вопрос 1</p>
              <h3>Что сейчас важнее всего?</h3>
              <div class="quiz-options">
                <button type="button" data-quiz="nds" data-step="1">НДС и налоги</button>
                <button type="button" data-quiz="diag" data-step="1">Деньги, маржа, где теряем</button>
                <button type="button" data-quiz="cfo" data-step="1">Регулярные решения каждый месяц</button>
              </div>
            </div>
            <div class="quiz-step" data-step="2">
              <p>Вопрос 2</p>
              <h3>Какой у вас горизонт?</h3>
              <div class="quiz-options">
                <button type="button" data-quiz="model" data-step="2">Инвестиция или рост</button>
                <button type="button" data-quiz="uchet" data-step="2">Построить систему учёта</button>
                <button type="button" data-quiz="tax" data-step="2">Снизить налоговую нагрузку</button>
              </div>
            </div>
            <div class="quiz-step" data-step="3">
              <p>Вопрос 3</p>
              <h3>Какой формат ближе?</h3>
              <div class="quiz-options">
                <button type="button" data-quiz="adv" data-step="3">Спарринг собственника (Advisory)</button>
                <button type="button" data-quiz="cfo" data-step="3">Отчётность CFO-light</button>
                <button type="button" data-quiz="diag" data-step="3">Разовый проект с документом</button>
              </div>
            </div>
            <div class="quiz-step" data-step="4"><div id="quizResult" class="quiz-result" role="status" aria-live="polite"></div></div>
          </div>
        </div>
      </section>
      <section class="section" id="services-map"><div class="container"><h2>Карта услуг</h2><div class="hub-grid">{cards}</div>
        <div class="chain-row">Цепочка: <a href="/financial-diagnostics">Диагностика</a> → <a href="/nds-2026">НДС/налоги</a> → <a href="/upravlenchesky-uchet">Упр. учёт</a> → <a href="/finansovaya-model">Финмодель</a> → <a href="/cfo-light">CFO-light</a></div>
      </div></section>
      <section class="section faq-section" id="faq"><div class="container faq-list">{faq_html(faqs)}</div></section>
      <section class="section request-section" id="request"><div class="container form-card">{lead_form_html("uslugi_s1", "Записаться на разбор", I["aur"])}</div></section>
    </main>
{footer_html("uslugi_s1")}
  </div>
  <script>{BASE_JS}</script><script>{QUIZ_JS}</script>
  {LEAD_FORM_SCRIPT}
</body>
</html>
"""


PAGES = [
    {
        "file": "upravlenchesky-uchet.html",
        "slug": "upravlenchesky-uchet",
        "hero_visual": "uchet",
        "breadcrumb": "Управленческий учёт",
        "service_name": "Постановка управленческого учёта",
        "title": "Управленческий учёт для бизнеса под ключ — maxima consulting",
        "meta_description": "P&L, cash flow, управленческий баланс и KPI-дашборд за 8 недель. Собственник получает достоверный отчёт за 24 часа. От 60 000 ₽.",
        "eyebrow": "Управленческий учёт · 8 недель",
        "h1": "Постановка управленческого учёта: <em>цифры за 24 часа</em>",
        "direct_answer": "Система строится для решений собственника, а не для отчётности в налоговую. Через 8 недель — регулярный отчёт без ручного героизма.",
        "price_from": "60 000 ₽",
        "tg_start": "uchet_s1",
        "submit_label": "Обсудить учёт",
        "pains": [
            "Бухгалтерия сдаёт отчётность, но не даёт управленческой картины",
            "Не понятно, сколько денег будет через месяц",
            "Нет единых KPI — каждый месяц смотрят на разные цифры",
            "Учёт держится на одном человеке",
        ],
        "steps": [
            ("Аудит текущего состояния", "Фиксируем разрывы между бухгалтерией и управлением"),
            ("Учётная политика и ЦФО", "Правила и центры ответственности"),
            ("P&L по направлениям", "Видимость маржи по продуктам и каналам"),
            ("ДДС и прогноз 13 недель", "Кассовые разрывы заранее"),
            ("KPI-дашборд собственника", "5–7 метрик, обновление за 24 часа"),
        ],
        "pricing": [
            {"title": "Постановка с нуля", "price": "60 000 – 150 000 ₽", "term": "4–8 недель", "featured": True, "features": ["P&L, ДДС, баланс", "KPI-дашборд", "Регламент закрытия месяца", "Не включает ведение бухучёта"]},
        ],
        "case_html": '<p class="case-box__main"><strong>Кейс:</strong> за первую неделю — P&L и cash flow вместо «ощущений».</p>',
        "fit_yes": ["Выручка 5–990 млн ₽", "Есть бухгалтер, нет управленческой картины"],
        "fit_no": ["Нужен только бухгалтер для сдачи отчётности"],
        "faqs": [
            ("Чем отличается от бухгалтерии?", "Бухгалтерия — для государства, управленческий учёт — для решений собственника."),
            ("Всё в Excel — можно?", "Да, начнём с того, что есть, и доведём до регламента."),
            ("Что после внедрения?", "Можно перейти на CFO-light для регулярной интерпретации цифр."),
        ],
        "next_links": [("/finansovaya-model", "Финансовая модель"), ("/cfo-light", "CFO-light")],
    },
    {
        "file": "finansovaya-model.html",
        "slug": "finansovaya-model",
        "hero_visual": "model",
        "breadcrumb": "Финансовая модель",
        "service_name": "Финансовая модель для бизнеса",
        "title": "Финансовая модель для бизнеса на 24–36 месяцев",
        "meta_description": "Помесячная модель, три сценария, юнит-экономика, NPV/IRR и точка безубыточности. Вердикт: идти / не идти. От 40 000 ₽.",
        "eyebrow": "Финмодель · 24–36 мес",
        "h1": "Финансовая модель с <em>тремя сценариями</em>",
        "direct_answer": "Модель нужна перед инвестицией, кредитом или сменой цены — показывает драйверы и порог, при котором проект не окупается.",
        "price_from": "40 000 ₽",
        "tg_start": "model_s1",
        "submit_label": "Заказать модель",
        "pains": [
            "Нет ответа, окупится ли новое направление",
            "Не ясно, сколько денег нужно до выхода в плюс",
            "Банк или инвестор просят модель, а «на коленке» не принимают",
            "Непонятно, какой параметр убивает проект первым",
        ],
        "steps": [
            ("Выручка по 3 сценариям", "Пессимистичный, базовый, оптимистичный"),
            ("Себестоимость и маржа", "С учётом НДС 22%/5%/7% и налога на прибыль 25%"),
            ("Cash flow и DCF", "NPV, IRR, payback"),
            ("Чувствительность ±10–20%", "Ключевые драйверы и точка безубыточности"),
        ],
        "pricing": [
            {"title": "Финансовая модель", "price": "40 000 – 100 000 ₽", "term": "2–4 недели", "featured": True, "features": ["Excel/Google Sheets", "Три сценария", "Вердикт go/no-go", "Презентация для банка/инвестора"]},
        ],
        "faqs": [
            ("Подходит для банка?", "Да, структура ориентирована на требования кредитных комитетов."),
            ("Новый бизнес без истории?", "Соберём допущения из рынка и юнит-экономики."),
            ("Если модель показывает «не идти»?", "Это тоже результат — сэкономленные инвестиции."),
        ],
        "next_links": [("/upravlenchesky-uchet", "Управленческий учёт"), ("/cfo-light", "CFO-light")],
    },
    {
        "file": "nalogovaya-optimizatsiya.html",
        "slug": "nalogovaya-optimizatsiya",
        "hero_visual": "tax",
        "breadcrumb": "Налоговая оптимизация",
        "service_name": "Законная налоговая оптимизация",
        "title": "Налоговая оптимизация бизнеса — законные методы",
        "meta_description": "Считаем экономию в рублях по каждому легальному методу: режимы, вычеты, ФИВ. Без дробления и серых схем. От 60 000 ₽.",
        "eyebrow": "Налоги · белое поле",
        "h1": "Легальная <em>налоговая оптимизация</em>",
        "direct_answer": "Работаем только в правовом поле: сравниваем режимы и льготы на ваших цифрах. Дробление и серые схемы не предлагаем.",
        "price_from": "60 000 ₽",
        "tg_start": "taxopt_s1",
        "submit_label": "Оценить экономию",
        "pains": [
            "Нагрузка высокая, но непонятно за счёт чего снизить",
            "Не уверены, что режим ОСНО/УСН оптимален",
            "Не используются льготы и ФИВ",
            "Страх, что оптимизация = риск проверки",
        ],
        "steps": [
            ("Аудит текущей нагрузки", "Факт в рублях по видам налогов"),
            ("Сравнение режимов", "На ваших данных, не в теории"),
            ("Вычеты и льготы", "В т.ч. ФИВ до 50% CapEx"),
            ("План внедрения", "С приоритетами и рисками"),
        ],
        "pricing": [
            {"title": "Налогово-финансовая оптимизация", "price": "60 000 – 130 000 ₽", "term": "3–5 недель", "featured": True, "features": ["Расчёт экономии по методам", "Блок «чего не делаем»", "Дорожная карта", "Сопровождение внедрения по согласованию"]},
        ],
        "case_html": '<p><strong>Чего не делаем:</strong> дробление, фиктивные посредники, серые зарплатные схемы.</p>',
        "faqs": [
            ("Это законно?", "Да, в рамках ст. 54.1 НК РФ и деловой цели сделок."),
            ("Гарантия от проверки?", "Гарантируем прозрачность метода и документов, не отсутствие контактов с ФНС."),
            ("Можно сменить режим в середине года?", "Разберём варианты на вашем кейсе."),
        ],
        "next_links": [("/nds-2026", "НДС-аудит 2026"), ("/cfo-light", "CFO-light")],
    },
    {
        "file": "cfo-light.html",
        "slug": "cfo-light",
        "hero_visual": "cfo",
        "breadcrumb": "CFO-light",
        "service_name": "CFO-light",
        "title": "CFO-light — финансовый директор на аутсорсе от 20 000 ₽/мес",
        "meta_description": "Еженедельный дашборд, ежемесячный отчёт с комментариями и квартальный обзор — без штатной должности. От 20 000 ₽/мес.",
        "eyebrow": "CFO-light · подписка",
        "h1": "CFO-light: <em>внешний финдиректор</em> по подписке",
        "direct_answer": "Не отчёт ради отчёта — интерпретация цифр и предупреждение о дорогих решениях до того, как они приняты.",
        "price_from": "20 000 ₽/мес",
        "tg_start": "cfo_s1",
        "submit_label": "Обсудить CFO-light",
        "pains": [
            "Цифры есть, но никто не объясняет, что они значат",
            "Проблемы узнаёте постфактум",
            "Штатный CFO дорог и избыточен",
            "Кредиты и инвестиции без проверки на метриках",
        ],
        "steps": [
            ("Еженедельный дашборд", "5–7 метрик: норма / отклонение / действие"),
            ("Ежемесячный отчёт", "Факт vs план, cash flow 30/60/90, 3 вывода"),
            ("Квартальный обзор", "Стратегия и приоритеты"),
            ("Эскалация по триггерам", "Например, касса &lt; 60 дней покрытия"),
        ],
        "pricing": [
            {"title": "CFO-light", "price": "20 000 – 55 000 ₽/мес", "term": "подписка", "featured": True, "features": ["Дашборд и комментарии", "Созвоны по регламенту", "Якорь: штатный CFO 150–300 тыс. ₽/мес + налоги", "Без ведения бухучёта"]},
        ],
        "faqs": [
            ("Чем отличается от Advisory?", "CFO-light — регулярная отчётность и метрики; Advisory — разбор решений собственника."),
            ("Сколько времени с моей стороны?", "Обычно 2–4 часа в месяц на созвоны и уточнения."),
            ("Без управленческого учёта можно?", "Лучше начать с диагностики или постановки учёта — иначе цифры будут ненадёжны."),
        ],
        "next_links": [("/upravlenchesky-uchet", "Управленческий учёт"), ("/advisory-dlya-sobstvennika", "Advisory")],
    },
    {
        "file": "advisory-dlya-sobstvennika.html",
        "slug": "advisory-dlya-sobstvennika",
        "hero_visual": "adv",
        "breadcrumb": "Advisory для собственника",
        "service_name": "Advisory для собственника",
        "title": "Advisory для собственника бизнеса — maxima consulting",
        "meta_description": "Сопровождение решений собственника: инвестиции, найм, цены, кредиты — с проверкой на цифрах. От 40 000 ₽/мес.",
        "eyebrow": "Advisory · собственник",
        "h1": "Advisory: <em>финансовый партнёр</em> на связи",
        "direct_answer": "Фокус на решениях собственника — найм, кредит, инвестиция, цена — с проверкой на цифрах и вторым мнением между встречами.",
        "price_from": "40 000 ₽/мес",
        "tg_start": "adv_s1",
        "submit_label": "Обсудить Advisory",
        "pains": [
            "Крупные решения принимаете один, без финансового спарринга",
            "Советуетесь с бухгалтером/юристом, но не с финансистом",
            "Нет второго мнения перед дорогими шагами",
        ],
        "steps": [
            ("Регулярные встречи", "Фиксированный ритм разбора"),
            ("Связь между встречами", "Короткие вопросы по ситуации"),
            ("Разбор решений по запросу", "Найм, сделка, кредит, цена"),
        ],
        "pricing": [
            {"title": "Advisory", "price": "40 000 – 80 000 ₽/мес", "term": "подписка", "featured": True, "features": ["Встречи + связь", "Разбор конкретных решений", "Для собственников после диагностики/учёта"]},
        ],
        "fit_yes": ["Собственник с выручкой от 5 млн ₽", "Уже есть базовая финансовая картина"],
        "fit_no": ["Нужен только отчёт без стратегического диалога"],
        "faqs": [
            ("Это коучинг?", "Нет, это финансовый разбор с цифрами и последствиями решений."),
            ("Сколько встреч?", "Ритм согласуем при старте — обычно 2–4 в месяц."),
            ("Можно разово?", "Формат подписки; разовые проекты — диагностика или модель."),
        ],
        "next_links": [("/cfo-light", "CFO-light"), ("/", "На главную")],
    },
]


def main() -> None:
    (ROOT / "uslugi.html").write_text(render_hub(), encoding="utf-8")
    print("OK uslugi.html")
    for page in PAGES:
        path = ROOT / page["file"]
        path.write_text(render_product(page), encoding="utf-8")
        print("OK", path.name)


if __name__ == "__main__":
    main()
