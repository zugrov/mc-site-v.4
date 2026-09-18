#!/usr/bin/env python3
"""Генерация variant-nds-2026-pro.html (лайм из pro, без tealize)."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from pro_css import load_nds_css
from publish_common import (
    LEAD_FORM_HIDDEN_FIELDS,
    LEAD_FORM_SCRIPT,
    LEAD_THANKYOU_CSS,
    YANDEX_METRIKA,
)

SITE_HOME = "https://maxima-consulting.ru/"

BRAND_INNER = (
    '<img class="brand-logo" src="assets/logo-maxima.png" alt="" width="28" height="28" />'
    '<span class="brand-name">maxima<span>consulting</span></span>'
)

EXTRA_CSS = """
.brand-logo { width: 28px; height: 28px; object-fit: contain; flex-shrink: 0; }
.icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
#floatingCta[hidden] { display: none !important; }
.faq-item:not(.is-open) .faq-answer { display: none; }
""" + LEAD_THANKYOU_CSS


def load_css() -> str:
    return load_nds_css(ROOT / "maxima-nds-2026-pro/client/src/index.css", EXTRA_CSS)


I = {
    "aur": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "aur15": '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "aur15ft": '<svg class="icon float-trend" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "aur17": '<svg class="icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "aur18": '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "mup": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 5H19V11"/><path d="M19 5 9 15"/><path d="M5 19V13"/><path d="M5 19 15 9"/></svg>',
    "scl23": '<svg class="icon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
    "wlt23": '<svg class="icon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>',
    "aur23": '<svg class="icon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "chk": '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
    "chd": '<svg class="icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
    "men": '<svg class="icon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>',
    "x": '<svg class="icon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    "shd": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    "act": '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>',
    "bar": '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
    "scl": '<svg class="icon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
    "wlt": '<svg class="icon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>',
    "hlp": '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    "lck": '<svg class="icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    "fil": '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
    "phn": '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    "snd": '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    "spk": '<svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
}

scenarios = [
    ("01", "PRICE ENGINE", "Сценарий цены", "Как разные варианты ценообразования при новом режиме НДС отразятся на конечной цене для клиента и на позиции относительно конкурентов.", "+8–12%", "диапазон пересмотра", "lime", "aur23"),
    ("02", "MARGIN CONTROL", "Сценарий маржи", "Как изменится маржинальность по направлениям, товарам или услугам при сохранении текущей цены и при её пересмотре.", "4–6 п.п.", "возможное снижение", "blue", "scl23"),
    ("03", "CASH FLOW", "Сценарий движения денежных средств", "Как выбранный вариант повлияет на движение денег: сроки платежей, отсрочки, кассовые разрывы.", "Q2", "точка внимания", "orange", "wlt23"),
]
faqs = [
    ("Вы поможете снизить НДС?", "Нет. Мы не занимаемся налоговой оптимизацией и не даём таких обещаний. Мы считаем, как разные решения по цене и режиму отражаются на марже и деньгах, чтобы вы могли принять взвешенное решение."),
    ("Это консультация по налогам?", "Это финансовая, а не налоговая консультация. Вопросы, требующие юридической налоговой оценки, мы рекомендуем решать с бухгалтером или налоговым консультантом; при необходимости подскажем, на что обратить внимание."),
    ("У меня оборот меньше 20 млн ₽, мне это нужно?", "Порог влияет на обязанность платить НДС, но не отменяет необходимость планировать: при приближении к порогу или при росте бизнеса сценарии стоит просчитать заранее."),
    ("Что я получу по итогу?", "Memo со сравнением сценариев по цене, марже и движению денежных средств, и рекомендации по приоритетным следующим шагам."),
    ("Сколько это стоит и как долго длится?", "Стоимость и сроки уточняем после короткого звонка — они зависят от сложности бизнеса и объёма данных."),
]
rows = [
    ("А — цена без изменений", "Без изменений", "Снижение на 4–6 п.п.", "Кассовый разрыв возможен в Q2"),
    ("Б — пересмотр цены", "+8–12%", "Сохранение текущей маржи", "Риск оттока клиентов"),
    ("В — смешанный подход", "+3–5% на часть SKU", "Частичное восстановление", "Более плавный переход"),
]


def js_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def scenario_cards() -> str:
    return "\n".join(
        f'''<article class="scenario-card accent-{accent} reveal reveal-delay-{i + 1}">
          <div class="scenario-top"><span class="scenario-number">{num}</span><span class="scenario-tag">{tag}</span>{I[icon]}</div>
          <div class="scenario-content"><h3>{title}</h3><p>{desc}</p></div>
          <div class="scenario-metric"><strong>{metric}</strong><span>{mlabel}</span></div>
          <div class="card-arrow">{I["aur17"]}</div>
        </article>'''
        for i, (num, tag, title, desc, metric, mlabel, accent, icon) in enumerate(scenarios)
    )


def faq_list() -> str:
    return "\n".join(
        f'<div class="faq-item{" is-open" if i == 0 else ""}" data-faq><button class="faq-trigger" type="button" aria-expanded="{"true" if i == 0 else "false"}"><span><i>0{i + 1}</i>{q}</span>{I["chd"]}</button><div class="faq-answer"><p>{a}</p></div></div>'
        for i, (q, a) in enumerate(faqs)
    )


def table_rows() -> str:
    parts = []
    for i, row in enumerate(rows):
        pos = ' class="positive"' if i == 1 else ""
        parts.append(
            f'<tr><td><span class="table-index index-{i}">0{i + 1}</span>{row[0]}</td><td{pos}>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>'
        )
    return "\n".join(parts)


FOOTER = f"""
    <footer class="site-footer">
      <div class="footer-top">
        <a class="brand" href="{SITE_HOME}">{BRAND_INNER}</a>
        <p>Финансовый партнёр<br />для МСБ</p>
        <div class="footer-social"><span>Соцсети</span><a href="https://t.me/maxima_consulting_leed_bot?start=nds_s1" data-tg-source="nds_s1" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://vk.com/maxima_consulting" target="_blank" rel="noopener noreferrer">VK</a><a href="https://m.tenchat.ru/u/eei8UmQE" target="_blank" rel="noopener noreferrer">TenChat</a></div>
        <div class="footer-services"><span>Услуги</span><a href="/financial-diagnostics">Финансовая диагностика</a><a href="/nds-2026">НДС-2026</a><a href="/#services">Управленческий учёт</a><a href="/#services">CFO-light</a></div>
      </div>
      <div class="footer-bottom"><span>© maxima consulting, 2026</span><div><a href="nda.html">NDA</a><a href="privacy.html">Политика ПД</a></div><span class="footer-signature">made by maxima lab {I["spk"]}</span></div>
    </footer>
"""

JS = r"""
(function () {
  function scrollToForm() { document.getElementById("request")?.scrollIntoView({ behavior: "smooth" }); }
  document.querySelectorAll("[data-scroll-form]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); scrollToForm(); });
  });
  var nav = document.querySelector(".main-nav");
  var menuBtn = document.getElementById("menuButton");
  if (nav && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.innerHTML = open ? __MENU_CLOSE__ : __MENU_OPEN__;
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); });
    });
  }
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".reveal").forEach(function (node) {
    if (reduced) { node.classList.add("is-visible"); return; }
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }).observe(node);
  });
  document.querySelectorAll("[data-faq]").forEach(function (item) {
    item.querySelector(".faq-trigger").addEventListener("click", function () {
      var open = item.classList.contains("is-open");
      document.querySelectorAll("[data-faq]").forEach(function (o) {
        o.classList.remove("is-open");
        o.querySelector(".faq-trigger").setAttribute("aria-expanded", "false");
      });
      if (!open) { item.classList.add("is-open"); item.querySelector(".faq-trigger").setAttribute("aria-expanded", "true"); }
    });
  });
  var floating = document.getElementById("floatingCta");
  var request = document.getElementById("request");
  if (floating && request) {
    new IntersectionObserver(function (entries) { floating.hidden = entries[0].isIntersecting; }, { threshold: 0.15 }).observe(request);
  }
})();
"""
JS = JS.replace("__MENU_OPEN__", js_str(I["men"])).replace("__MENU_CLOSE__", js_str(I["x"]))

CSS = load_css()
html = f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/favicon.ico" sizes="48x48" />
  <link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/assets/favicon-16.png" type="image/png" sizes="16x16" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <title>НДС-2026: сценарии для вашего бизнеса — maxima consulting</title>
  <meta name="description" content="Финансовые сценарии по цене, марже и движению денежных средств при переходе на НДС-2026. Без обещаний по экономии — только расчёт на ваших данных." />
  <meta property="og:title" content="НДС-2026: сценарии для вашего бизнеса — maxima consulting" />
  <meta property="og:description" content="Цена, маржа и движение денежных средств — без решений наугад." />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
{CSS}
  </style>
{YANDEX_METRIKA}
</head>
<body>
  <div class="site-shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>
    <header class="site-header">
      <a class="brand" href="{SITE_HOME}" aria-label="Maxima Consulting — на главную">{BRAND_INNER}</a>
      <nav class="main-nav" aria-label="Основная навигация">
        <a href="#scenarios">Сценарии</a><a href="#reference">Справочно</a><a href="#trust">Подход</a><a href="#faq">FAQ</a><a href="/blog/">Блог</a>
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="tel:+79808488480">+7 980 848-84-80</a>
        <button class="button button-small button-dark" type="button" data-scroll-form>Обсудить задачу {I["aur"]}</button>
      </div>
      <button class="menu-button" id="menuButton" type="button" aria-label="Открыть меню" aria-expanded="false">{I["men"]}</button>
    </header>
    <main id="top">
      <section class="hero section-pad">
        <div class="hero-grid"></div>
        <div class="hero-copy reveal">
          <div class="eyebrow"><span class="eyebrow-dot"></span> ФИНАНСОВЫЕ СЦЕНАРИИ <span class="eyebrow-line"></span> НДС—2026</div>
          <h1>НДС-2026:<br /><em>сценарии</em> для<br />вашего бизнеса<span class="title-dot">.</span></h1>
          <p class="hero-lead">Цена, маржа и движение денежных средств — без решений наугад.</p>
          <div class="hero-ctas">
            <button class="button button-primary" type="button" data-scroll-form>Проверить сценарий {I["aur18"]}</button>
            <a class="text-link" href="#scenarios">Что мы посчитаем {I["mup"]}</a>
          </div>
          <div class="hero-proof">{I["shd"]}<span>Считаем на ваших данных</span><span class="proof-separator">·</span><span>NDA до начала работы</span></div>
        </div>
        <div class="hero-visual reveal reveal-delay-2">
          <div class="visual-orbit orbit-large"></div>
          <div class="visual-orbit orbit-small"></div>
          <div class="visual-core">
            <span class="core-label">УСН / 2026</span>
            <strong>20<span>млн ₽</span></strong>
            <span class="core-caption">порог освобождения<br />от НДС</span>
          </div>
          <div class="float-card float-card-top"><span class="float-icon lime-icon">{I["act"]}</span><span><b>3 сценария</b><small>на одной модели</small></span></div>
          <div class="float-card float-card-bottom"><span class="float-icon blue-icon">{I["bar"]}</span><span><b>+12.4%</b><small>вариант роста цены</small></span>{I["aur15ft"]}</div>
          <div class="chart-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div class="visual-note">01 / 03<br /><span>сценарии</span></div>
        </div>
        <div class="hero-scroll"><span>SCROLL TO EXPLORE</span><span class="scroll-line"></span></div>
      </section>
      <section class="marquee-section" aria-label="Ключевые направления расчёта">
        <div class="marquee-track"><span>PRICE</span><span class="marquee-star">✳</span><span>MARGIN</span><span class="marquee-star">✳</span><span>CASH FLOW</span><span class="marquee-star">✳</span><span>PRICE</span><span class="marquee-star">✳</span><span>MARGIN</span></div>
      </section>
      <section id="scenarios" class="section-pad scenarios-section">
        <div class="section-intro reveal"><div class="section-kicker">01 / СЦЕНАРИИ</div><div><h2>Что мы <em>посчитаем</em></h2><p>Три сценария на одной модели — сравниваете варианты и принимаете решение сами.</p></div></div>
        <div class="scenario-grid">{scenario_cards()}</div>
        <div class="scenario-note reveal"><span class="note-mark">↳</span><p>Мы не даём одного «правильного» ответа — показываем, как выглядит бизнес в каждом сценарии, и передаём выбор вам.</p></div>
      </section>
      <section id="reference" class="section-pad reference-section">
        <div class="reference-layout">
          <div class="section-intro intro-stacked reveal">
            <div class="section-kicker">02 / СПРАВОЧНО</div>
            <h2>Что изменилось<br />для УСН <em>в 2026</em></h2>
            <p>Порог освобождения от НДС для бизнеса на УСН сохранён на уровне 20 млн ₽ годовой выручки — это правило действует до 2029 года включительно согласно Федеральному закону № 228-ФЗ.</p>
            <a class="source-link" href="https://www.nalog.gov.ru/rn77/taxation/reference_work/usn/" target="_blank" rel="noopener noreferrer">Первоисточник: справочная информация ФНС {I["aur"]}</a>
          </div>
          <div class="threshold-panel reveal reveal-delay-2">
            <div class="panel-top"><span>THRESHOLD MONITOR</span><span class="live-dot">LIVE</span></div>
            <div class="threshold-number">20 <small>млн ₽</small></div>
            <p>годовая выручка / порог освобождения от НДС</p>
            <div class="threshold-scale"><span>0</span><div class="scale-line"><span class="scale-fill"></span><i></i></div><span>20M</span></div>
            <div class="threshold-foot"><span><i class="legend-dot lime-dot"></i> актуальный порог</span><span>до 2029 года</span></div>
          </div>
        </div>
        <div class="legal-note reveal">{I["hlp"]}<p>Ранее обсуждавшийся график с порогами 15 и 10 млн ₽ не применяется как действующий. Мы поможем разобраться, что конкретно это означает для вашего бизнеса и какие сценарии стоит просчитать в вашем случае.</p></div>
        <div class="disclaimer">Информация носит справочный характер и не является налоговой консультацией в юридическом смысле; финальные решения по налоговому режиму принимайте вместе с бухгалтером или налоговым консультантом.</div>
        <div class="table-wrap reveal">
          <table><thead><tr><th>Сценарий</th><th>Цена для клиента</th><th>Маржа</th><th>Движение денежных средств</th></tr></thead><tbody>{table_rows()}</tbody></table>
          <span class="table-caption">Пример обезличенной сценарной таблицы — не расчёт на данных конкретного клиента.</span>
        </div>
      </section>
      <section id="trust" class="section-pad trust-section">
        <div class="section-intro reveal"><div class="section-kicker">03 / ДОВЕРИЕ</div><div><h2>Почему можно<br /><em>доверять</em> результату</h2></div></div>
        <div class="trust-grid">
          <div class="trust-list reveal">
            <div class="trust-item"><span class="trust-icon">{I["bar"]}</span><div><h3>Финансовые сценарии, а не налоговые схемы</h3><p>Мы работаем с финансовыми сценариями, а не с налоговыми схемами и не занимаемся налоговой оптимизацией.</p></div></div>
            <div class="trust-item"><span class="trust-icon">{I["lck"]}</span><div><h3>Формат работы по NDA</h3><p>Данные бизнеса не передаются третьим лицам. Соглашение о конфиденциальности подписывается до начала работы.</p></div></div>
          </div>
          <div class="memo-card reveal reveal-delay-2">
            <div class="memo-header"><span class="memo-file">{I["fil"]}</span><span>MEMO / STRUCTURE</span><span class="memo-status">ANONYMIZED</span></div>
            <div class="memo-title">Пример структуры memo</div>
            <div class="memo-lines">
              <div>{I["chk"]} Сравнение сценариев по цене, марже и движению денежных средств</div>
              <div>{I["chk"]} Ключевые допущения и ограничения расчёта</div>
              <div>{I["chk"]} Риски каждого варианта</div>
              <div>{I["chk"]} Рекомендации по приоритетным следующим шагам</div>
            </div>
            <div class="memo-footer">Пример структуры документа — не расчёт на данных конкретного клиента.</div>
          </div>
        </div>
      </section>
      <section id="faq" class="section-pad faq-section">
        <div class="faq-layout">
          <div class="section-intro intro-stacked reveal"><div class="section-kicker">04 / FAQ</div><h2>Частые<br /><em>вопросы</em></h2><p>Коротко о подходе, границах работы и результате, который вы получите.</p></div>
          <div class="faq-list reveal reveal-delay-2">{faq_list()}</div>
        </div>
      </section>
      <section id="request" class="request-section section-pad">
        <div class="request-glow"></div>
        <div class="request-layout">
          <div class="request-copy reveal">
            <div class="eyebrow"><span class="eyebrow-dot"></span> СЛЕДУЮЩИЙ ШАГ</div>
            <h2>Проверим<br /><em>сценарии</em><br />на ваших данных<span class="title-dot">.</span></h2>
            <p>Без обещаний по экономии — только расчёт на ваших данных.</p>
            <div class="direct-contact">
              <span>Или напишите напрямую</span>
              <a href="tel:+79808488480">{I["phn"]} +7 980 848-84-80</a>
              <a href="https://t.me/maxima_consulting_leed_bot?start=nds_s1" data-tg-source="nds_s1" target="_blank" rel="noopener noreferrer">{I["snd"]} @maxima_consulting_leed_bot</a>
            </div>
          </div>
          <div class="form-card reveal reveal-delay-2">
            <form id="lead-form" data-lead-form novalidate>
{LEAD_FORM_HIDDEN_FIELDS}
              <div class="form-heading"><span>01</span><strong>Запросить расчёт сценариев</strong><small>Без обязательств на этом шаге.</small></div>
              <div class="form-grid">
                <label>Ваше имя *<input id="name" required name="name" placeholder="Как к вам обращаться" /></label>
                <label>Телефон или Telegram *<input id="contact" required name="contact" placeholder="+7 / @username" /></label>
                <label>Роль в компании *<select id="role" required name="role"><option value="">Выберите</option><option value="owner">Собственник</option><option value="ceo">Генеральный директор</option><option value="cfo">Финансовый директор</option><option value="coo">Операционный директор</option><option value="other">Другое</option></select></label>
                <label>Отрасль *<select id="industry" required name="industry"><option value="">Выберите</option><option value="trade">Торговля / опт-розница</option><option value="ecommerce">E-commerce / маркетплейсы</option><option value="production">Производство</option><option value="services">Услуги</option><option value="local_services">Локальные сервисы</option><option value="construction">Строительство</option><option value="other">Другое</option></select></label>
                <label>Диапазон годовой выручки *<select id="revenue" required name="revenue"><option value="">Выберите</option><option value="under_20">до 20 млн ₽</option><option value="20_60">20–60 млн ₽</option><option value="60_150">60–150 млн ₽</option><option value="150_500">150–500 млн ₽</option><option value="over_500">свыше 500 млн ₽</option><option value="unknown">затрудняюсь ответить</option></select></label>
                <label>Срочность *<select id="urgency" required name="urgency"><option value="">Выберите</option><option value="urgent">Срочно (нужно решение на этой неделе)</option><option value="month">В течение месяца</option><option value="not_urgent">Не срочно</option><option value="researching">Изучаю рынок</option></select></label>
                <label class="full-width">Главный вопрос *<textarea id="question" required name="question" placeholder="Что хотите просчитать в первую очередь?" rows="3"></textarea></label>
              </div>
              <label class="consent"><input type="checkbox" name="consent_pdn" required /> <span>Согласен(на) на обработку персональных данных в соответствии с <a href="privacy.html" target="_blank" rel="noopener">Политикой обработки персональных данных</a> *</span></label>
              <button class="button button-primary submit-button" type="submit" disabled>Проверить сценарий {I["aur18"]}</button>
              <p class="form-note" style="margin-top:12px;font-size:12px;opacity:.75;">Или напишите: <a href="tel:+79808488480">+7 980 848-84-80</a> · <a href="https://t.me/maxima_consulting_leed_bot?start=nds_s1" data-tg-source="nds_s1" target="_blank" rel="noopener">@maxima_consulting_leed_bot</a></p>
            </form>
          </div>          </div>
        </div>
      </section>
    </main>
{FOOTER}
    <button class="floating-cta" id="floatingCta" type="button" data-scroll-form aria-label="Оставить заявку">
      <span class="floating-cta-pulse"></span>
      {I["snd"]}
      <span>Оставить заявку</span>
      {I["aur"]}
    </button>
  </div>
  <script>{JS}</script>
  {LEAD_FORM_SCRIPT}
</body>
</html>
"""

for _out in (ROOT / "variant-nds-2026-pro.html", ROOT / "nds-2026.html"):
    _out.write_text(html, encoding="utf-8")
    print("OK", _out)
