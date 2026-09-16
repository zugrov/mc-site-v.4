#!/usr/bin/env python3
"""Генерация variant-financial-diagnostics-pro.html (лайм из pro, без tealize)."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from pro_css import load_diag_css
from publish_common import (
    LEAD_FORM_HIDDEN_FIELDS,
    LEAD_FORM_SCRIPT,
    LEAD_THANKYOU_CSS,
    YANDEX_METRIKA,
)

SITE_HOME = "https://maxima-consulting.ru/"

BRAND_INNER = (
    '<img class="brand-logo" src="assets/logo-maxima.png" alt="" width="28" height="28" />'
    '<span class="brand-wordmark">maxima<span>consulting</span></span>'
)

EXTRA_CSS = """
.brand-logo { width: 28px; height: 28px; object-fit: contain; flex-shrink: 0; }
.icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
.site-header--open .mobile-nav { display: grid !important; }
.site-header:not(.site-header--open) .mobile-nav { display: none !important; }
@media (max-width: 720px) {
  .site-header:not(.site-header--open) .mobile-nav { display: none !important; }
  .site-header--open .mobile-nav { display: grid !important; }
}
.honeypot { position: absolute; left: -10000px; opacity: 0; height: 0; overflow: hidden; }
.faq-item:not(.faq-item--open) .faq-answer p { padding: 0; opacity: 0; max-height: 0; overflow: hidden; }
""" + LEAD_THANKYOU_CSS + LEAD_THANKYOU_CSS


def load_css() -> str:
    return load_diag_css(ROOT / "maxima-financial-diagnostics-pro/client/src/index.css", EXTRA_CSS)


I = {
    "aur": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "aur19": '<svg class="icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
    "adn": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>',
    "chk": '<svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
    "chd": '<svg class="icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
    "chr": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
    "men": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>',
    "x": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    "shd": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    "trd": '<svg class="icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>',
    "clk": '<svg class="icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    "dol": '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
    "lck": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    "wlt": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>',
    "spk": '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    "phn": '<svg class="icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    "msg": '<svg class="icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    "db": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>',
    "bch": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
    "tgt": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    "fck": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>',
    "mcc": '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
}

pain = [
    "Выручка растёт, а свободных денег на счёте не прибавляется",
    "Отчёты есть, но непонятно, на какие решения они опираются",
    "Прибыль по документам не совпадает с ощущением от кассы",
    "Непонятно, какое направление приносит доход, а какое съедает маржу",
    "Решения о ценах, найме или закупках принимаются на глаз",
]
steps = [
    ("01—02", "Сбор данных", "Вы передаёте доступные выгрузки: отчётность, банковские выписки, учётные данные. Список того, что понадобится, высылаем сразу после заявки.", "db"),
    ("03—04", "Сборка картины", "Строим управленческую картину прибыли и движения денег. Там, где данных не хватает, фиксируем это отдельно — без домыслов.", "bch"),
    ("05", "Поиск причин", "Сопоставляем прибыль и деньги, находим разрывы между бумажным результатом и фактическим движением средств.", "tgt"),
    ("06", "Memo и roadmap", "Готовим короткий документ: картина по прибыли и деньгам, 3–5 приоритетных вопросов и предлагаемые следующие шаги.", "fck"),
    ("07", "Встреча с разбором", "Разбираем memo вместе, отвечаем на вопросы и обсуждаем, что имеет смысл делать дальше — с диагностикой или без неё.", "mcc"),
]
faqs = [
    ("Это проверка по стандартам аудита?", "Нет. Диагностика — управленческий инструмент: она показывает картину прибыли и денег для принятия решений, а не формирует заключение по стандартам аудиторской деятельности."),
    ("Какие данные нужны от меня?", "Список зависит от вашей учётной системы; типично — управленческая или бухгалтерская отчётность за последние периоды и доступ к банковским выпискам. Точный список пришлём после заявки."),
    ("Что если данных не хватает?", "Мы отметим такие зоны в memo как ограничения анализа, а не будем додумывать цифры. Вы увидите не только выводы, но и степень их надёжности."),
    ("Сколько это стоит?", "Диагностика — от 20 000 ₽ в зависимости от объёма бизнеса и состояния данных. Точную стоимость подтверждаем после короткого звонка."),
    ("Что будет после диагностики?", "Вы получаете memo и roadmap. Дальше — на ваш выбор: внедрять решения самостоятельно, заказать постановку управленческого учёта или перейти к формату CFO-light."),
    ("Подходит ли это моему бизнесу?", "Формат ориентирован на собственников торговых, e-commerce, производственных компаний и компаний услуг с действующей выручкой. Если у вас стартап без выручки или крупный холдинг — напишите нам, подберём подходящий формат отдельно."),
]


def js_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def pain_html() -> str:
    return "\n".join(
        f'<article class="pain-card reveal reveal--delay-{(i % 3) + 1}"><span class="pain-number">0{i}</span><p>{p}</p><span class="pain-corner">{I["aur"]}</span></article>'
        for i, p in enumerate(pain, 1)
    )


def process_html() -> str:
    return "\n".join(
        f'<article class="process-row reveal" style="--row-delay:{idx * 70}ms"><div class="process-row__day"><span>дни</span><strong>{day}</strong></div><div class="process-row__icon">{I[icon]}</div><div class="process-row__body"><h3>{title}</h3><p>{desc}</p></div><span class="process-row__arrow">{I["aur19"]}</span></article>'
        for idx, (day, title, desc, icon) in enumerate(steps)
    )


def faq_html() -> str:
    parts = []
    for i, (q, a) in enumerate(faqs):
        open_cls = " faq-item--open" if i == 0 else ""
        parts.append(
            f'<div class="faq-item{open_cls}" data-faq><button type="button" aria-expanded="{"true" if i == 0 else "false"}"><span><small>0{i + 1}</small>{q}</span>{I["chd"]}</button><div class="faq-answer"><p>{a}</p></div></div>'
        )
    return "\n".join(parts)


FOOTER = f"""
      <footer class="site-footer">
        <div class="container footer-top">
          <a class="brand" href="{SITE_HOME}">{BRAND_INNER}</a>
          <p>Финансовый партнёр<br />для МСБ</p>
          <div class="footer-social"><span>Соцсети</span><a href="https://t.me/maxima_consulting_leed_bot?start=diag_s1" data-tg-source="diag_s1" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://vk.com/maxima_consulting" target="_blank" rel="noopener noreferrer">VK</a><a href="https://m.tenchat.ru/u/eei8UmQE" target="_blank" rel="noopener noreferrer">TenChat</a></div>
          <div class="footer-services"><span>Услуги</span><a href="/financial-diagnostics">Финансовая диагностика</a><a href="/nds-2026">НДС-2026</a><a href="/#services">Управленческий учёт</a><a href="/#services">CFO-light</a></div>
        </div>
        <div class="container footer-bottom"><span>© 2026 maxima consulting</span><div><a href="nda.html">NDA</a><a href="privacy.html">Политика ПД</a></div><span>made by maxima lab <span class="footer-star">✦</span></span></div>
      </footer>
"""

JS = """
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
      menuBtn.innerHTML = open ? __MENU_CLOSE_HTML__ : __MENU_OPEN_HTML__;
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
  var chartData = {
    profit: { label: "Операционная прибыль", value: "+18,6%", subtitle: "рост к прошлому периоду", color: "#d7f36b", points: "0,126 68,118 136,129 204,94 272,105 340,62 408,72 476,38 520,28", bars: [48,56,51,63,72,82,91], dotY: 28, result: "+18,6%" },
    cash: { label: "Свободные деньги", value: "₽ 4,82M", subtitle: "остаток на конец периода", color: "#a7d66a", points: "0,114 68,101 136,115 204,78 272,91 340,54 408,61 476,46 520,34", bars: [40,45,42,58,61,70,78], dotY: 34, result: "+12,2%" },
    margin: { label: "Средняя маржа", value: "32,4%", subtitle: "после разбивки направлений", color: "#eef9b6", points: "0,138 68,127 136,108 204,112 272,84 340,92 408,64 476,57 520,42", bars: [36,48,60,54,68,74,86], dotY: 42, result: "+7,4 п.п." }
  };
  var tabs = document.querySelectorAll(".chart-tabs button");
  var metricLabel = document.getElementById("chartMetricLabel");
  var metricValue = document.getElementById("chartMetricValue");
  var metricSub = document.getElementById("chartMetricSub");
  var chartLine = document.getElementById("chartLinePoly");
  var chartFill = document.getElementById("chartLineFill");
  var chartDot = document.getElementById("chartDot");
  var barStrip = document.getElementById("barStrip");
  var barResult = document.getElementById("barResult");
  function setChart(key) {
    var d = chartData[key];
    if (!d) return;
    tabs.forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.chart === key);
      b.setAttribute("aria-selected", b.dataset.chart === key ? "true" : "false");
    });
    metricLabel.textContent = d.label;
    metricValue.textContent = d.value;
    metricSub.textContent = d.subtitle;
    chartLine.setAttribute("points", d.points);
    chartLine.setAttribute("stroke", d.color);
    chartFill.setAttribute("points", d.points + " 520,176 0,176");
    chartDot.setAttribute("cy", d.dotY);
    chartDot.setAttribute("fill", d.color);
    barResult.textContent = d.result;
    barStrip.querySelectorAll("span").forEach(function (bar, i) {
      bar.style.height = d.bars[i] + "%";
      bar.style.background = i === d.bars.length - 1 ? d.color : "rgba(215,243,107,.28)";
    });
  }
  tabs.forEach(function (btn) { btn.addEventListener("click", function () { setChart(btn.dataset.chart); }); });
  setChart("profit");
})();
"""
JS = JS.replace("__MENU_OPEN_HTML__", js_str(I["men"])).replace("__MENU_CLOSE_HTML__", js_str(I["x"]))

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
  <title>Финансовая диагностика за 7 дней — maxima consulting</title>
  <meta name="description" content="Управленческая финансовая диагностика за 7 дней: прибыль, деньги, риски и приоритеты в одном понятном отчёте для собственника. От 20 000 ₽." />
  <meta property="og:title" content="Финансовая диагностика за 7 дней — maxima consulting" />
  <meta property="og:description" content="Прибыль, деньги, риски и приоритеты — в одном понятном отчёте для собственника." />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
.container {{ width: 100%; max-width: 1280px; margin-inline: auto; padding-inline: 40px; }}
{CSS}
  </style>
{YANDEX_METRIKA}
</head>
<body>
  <div class="site-shell">
    <div class="noise" aria-hidden="true"></div>
    <header class="site-header" id="siteHeader">
      <div class="container header-inner">
        <a class="brand" href="{SITE_HOME}" aria-label="Maxima Consulting — на главную">{BRAND_INNER}</a>
        <nav class="desktop-nav" aria-label="Основная навигация">
          <a href="#process">Как работаем</a><a href="#charts">В цифрах</a><a href="#trust">Почему мы</a><a href="#faq">FAQ</a>
        </nav>
        <div class="header-actions">
          <a class="header-phone" href="tel:+79808488480">+7 980 848-84-80</a>
          <button class="button button--small button--outline" type="button" data-scroll="request">Разобрать цифры {I["aur"]}</button>
          <button class="menu-toggle" id="menuToggle" type="button" aria-label="Открыть меню" aria-expanded="false">{I["men"]}</button>
        </div>
      </div>
      <nav class="mobile-nav" aria-label="Мобильная навигация">
        <a href="#process" data-scroll="process">Как работаем {I["chr"]}</a>
        <a href="#charts" data-scroll="charts">В цифрах {I["chr"]}</a>
        <a href="#trust" data-scroll="trust">Почему мы {I["chr"]}</a>
        <a href="#faq" data-scroll="faq">FAQ {I["chr"]}</a>
        <button class="button button--lime" type="button" data-scroll="request">Разобрать цифры {I["aur"]}</button>
      </nav>
    </header>
    <main id="top">
      <section class="hero section-grid">
        <div class="container hero-grid">
          <div class="hero-copy reveal">
            <div class="eyebrow"><span class="eyebrow-dot"></span> Управленческая диагностика <span class="eyebrow-divider"></span> 7 дней</div>
            <h1>Финансовая диагностика <em>за 7 дней</em></h1>
            <p class="hero-lead">Прибыль, деньги, риски и приоритеты — в одном понятном отчёте для собственника.</p>
            <div class="hero-actions">
              <button class="button button--lime button--large" type="button" data-scroll="request">Разобрать цифры {I["aur"]}</button>
              <button class="text-link" type="button" data-scroll="process">Как проходит диагностика {I["adn"]}</button>
            </div>
            <div class="hero-footnote">{I["shd"]} NDA до начала работы <span></span> Без лишнего запроса данных</div>
          </div>
          <div class="hero-visual reveal reveal--delay-2">
            <div class="visual-orbit visual-orbit--one"></div>
            <div class="visual-orbit visual-orbit--two"></div>
            <div class="dashboard-card">
              <div class="dashboard-card__header"><span class="card-kicker">DIAGNOSTIC / 07</span><span class="live-pill"><i></i> live</span></div>
              <div class="dashboard-title">Финансовый<br /><strong>контур бизнеса</strong></div>
              <div class="dashboard-metrics">
                <div><span>Опер. прибыль</span><strong>+18,6%</strong><small>{I["trd"]} к прошлому периоду</small></div>
                <div><span>Свободные деньги</span><strong>₽ 4,82M</strong><small class="muted">{I["clk"]} на 14 окт.</small></div>
              </div>
              <div class="mini-chart">
                <div class="mini-chart__topline"><span>Движение денег</span><span class="mini-chart__range">последние 6 мес.</span></div>
                <svg viewBox="0 0 520 176" aria-hidden="true"><defs><linearGradient id="miniFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d7f36b" stop-opacity=".24"/><stop offset="100%" stop-color="#d7f36b" stop-opacity="0"/></linearGradient></defs>
                <path d="M0 133 C40 126 58 141 94 119 S144 86 176 102 S229 113 260 72 S310 84 342 54 S401 38 428 61 S478 35 520 24 L520 176 L0 176 Z" fill="url(#miniFill)"/>
                <path d="M0 133 C40 126 58 141 94 119 S144 86 176 102 S229 113 260 72 S310 84 342 54 S401 38 428 61 S478 35 520 24" fill="none" stroke="#d7f36b" stroke-width="3" stroke-linecap="round"/>
                <circle cx="520" cy="24" r="5" fill="#e9ff86"/></svg>
                <div class="mini-chart__labels"><span>май</span><span>июнь</span><span>июль</span><span>авг.</span><span>сент.</span><span>окт.</span></div>
              </div>
              <div class="dashboard-card__footer"><span><span class="legend-dot legend-dot--lime"></span> прибыль</span><span><span class="legend-dot legend-dot--white"></span> движение денег</span><span class="footer-arrow">{I["aur"]}</span></div>
            </div>
            <div class="floating-note floating-note--top">{I["dol"]}<span><b>₽ 87,4 млн</b><small>выручка в кейсе</small></span></div>
            <div class="floating-note floating-note--bottom"><span class="mini-check">{I["chk"]}</span><span><b>3 приоритета</b><small>для решения</small></span></div>
            <div class="hero-vertical-label">MAXIMA / FINANCE CLARITY</div>
          </div>
        </div>
        <div class="hero-scroll"><span>scroll to explore</span><i></i></div>
      </section>
      <section class="section section--ink" id="pain">
        <div class="container">
          <div class="section-intro section-intro--split reveal">
            <div><span class="section-index">01 / signal</span><h2>Знакомая<br /><em>ситуация?</em></h2></div>
            <div class="section-intro__aside"><p>Это не значит, что в бизнесе что-то сломано. Чаще всего просто не хватает единой финансовой картины для управленческих решений.</p><span class="accent-line"></span></div>
          </div>
          <div class="pain-grid">{pain_html()}</div>
        </div>
      </section>
      <section class="section process-section" id="process">
        <div class="container">
          <div class="section-intro section-intro--split reveal">
            <div><span class="section-index">02 / process</span><h2>От данных<br />до <em>решений</em></h2></div>
            <div class="section-intro__aside"><p>Отчёт, memo и встреча с разбором — за 7 рабочих дней. Вы понимаете не только «что», но и «почему».</p><div class="time-stamp"><span>7</span><small>рабочих<br />дней</small></div></div>
          </div>
          <div class="process-list">{process_html()}</div>
          <p class="section-note"><span>*</span> Срок 7 дней — при своевременном предоставлении данных с вашей стороны.</p>
        </div>
      </section>
      <section class="section charts-section" id="charts">
        <div class="container">
          <div class="section-intro section-intro--split reveal">
            <div><span class="section-index">03 / visual model</span><h2>Смотрим<br />не на цифры, а на <em>связи</em></h2></div>
            <div class="section-intro__aside"><p>Интерактивная модель показывает, как мы собираем разрозненные данные в одну картину для собственника.</p><span class="accent-line"></span></div>
          </div>
          <div class="charts-dashboard reveal reveal--delay-1">
            <div class="charts-dashboard__top">
              <div><span class="section-index">LIVE MODEL / 07 DAYS</span><h3>Финансовый контур</h3></div>
              <div class="chart-tabs" role="tablist">
                <button type="button" class="is-active" data-chart="profit" role="tab" aria-selected="true">Прибыль</button>
                <button type="button" data-chart="cash" role="tab" aria-selected="false">Деньги</button>
                <button type="button" data-chart="margin" role="tab" aria-selected="false">Маржа</button>
              </div>
            </div>
            <div class="charts-dashboard__grid">
              <div class="line-chart-card">
                <div class="line-chart-card__metric"><div><span id="chartMetricLabel">Операционная прибыль</span><strong id="chartMetricValue">+18,6%</strong></div><small id="chartMetricSub">{I["trd"]} рост к прошлому периоду</small></div>
                <svg class="diagnostic-line-chart" viewBox="0 0 520 176"><defs><linearGradient id="diagFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d7f36b" stop-opacity=".25"/><stop offset="100%" stop-color="#d7f36b" stop-opacity="0"/></linearGradient></defs>
                <line x1="0" x2="520" y1="28" y2="28" stroke="rgba(236,240,224,0.1)"/><line x1="0" x2="520" y1="70" y2="70" stroke="rgba(236,240,224,0.1)"/><line x1="0" x2="520" y1="112" y2="112" stroke="rgba(236,240,224,0.1)"/><line x1="0" x2="520" y1="154" y2="154" stroke="rgba(236,240,224,0.1)"/>
                <polyline id="chartLineFill" points="0,126 68,118 136,129 204,94 272,105 340,62 408,72 476,38 520,28 520,176 0,176" fill="url(#diagFill)" stroke="none"/>
                <polyline id="chartLinePoly" points="0,126 68,118 136,129 204,94 272,105 340,62 408,72 476,38 520,28" fill="none" stroke="#d7f36b" stroke-width="3" stroke-linecap="round"/>
                <circle id="chartDot" cx="520" cy="28" r="5" fill="#d7f36b"/></svg>
                <div class="chart-axis"><span>май</span><span>июнь</span><span>июль</span><span>авг.</span><span>сент.</span><span>окт.</span></div>
              </div>
              <div class="composition-card">
                <div class="composition-card__header"><span>Состав результата</span><span class="composition-card__period">октябрь</span></div>
                <div class="composition-visual"><div class="composition-donut"><div><strong>100%</strong><span>картина</span></div></div><div class="composition-legend"><span><i class="composition-dot composition-dot--lime"></i> Основное направление <b>54%</b></span><span><i class="composition-dot composition-dot--olive"></i> Доп. направление <b>28%</b></span><span><i class="composition-dot composition-dot--pale"></i> Прочее <b>18%</b></span></div></div>
                <div class="composition-foot"><span>После диагностики</span><strong>3 зоны внимания</strong>{I["aur"]}</div>
              </div>
            </div>
            <div class="bar-strip"><div><span class="bar-strip__label">Динамика по периодам</span><small>рост / снижение</small></div><div class="bar-strip__bars" id="barStrip"><span style="height:48%"></span><span style="height:56%"></span><span style="height:51%"></span><span style="height:63%"></span><span style="height:72%"></span><span style="height:82%"></span><span style="height:91%"></span></div><div class="bar-strip__result"><strong id="barResult">+18,6%</strong><small>за 6 месяцев</small></div></div>
          </div>
        </div>
      </section>
      <section class="section trust-section" id="trust">
        <div class="container">
          <div class="section-intro section-intro--split reveal">
            <div><span class="section-index">04 / confidence</span><h2>Результат,<br />которому <em>можно</em><br />доверять</h2></div>
            <div class="section-intro__aside"><p>Не обещаем магию. Делаем понятный управленческий инструмент, на который можно опереться в следующий понедельник.</p></div>
          </div>
          <div class="trust-grid">
            <article class="trust-card trust-card--lime reveal"><div class="trust-card__icon">{I["lck"]}</div><span class="trust-card__index">01</span><h3>Формат работы<br /><strong>по NDA</strong></h3><p>Данные бизнеса не передаются третьим лицам. Соглашение о конфиденциальности подписывается до начала работы.</p><a href="#request" data-scroll="request">Обсудить условия {I["aur"]}</a></article>
            <article class="trust-card trust-card--dark reveal reveal--delay-1"><div class="trust-card__icon">{I["wlt"]}</div><span class="trust-card__index">02</span><h3>Управленческий<br /><strong>инструмент</strong></h3><p>Диагностика — не замена бухгалтерии. Мы работаем с управленческой, а не с налоговой отчётностью.</p><div class="trust-card__seal"><span>MSB</span><small>FOCUS<br />2026</small></div></article>
            <article class="memo-card reveal reveal--delay-2"><div class="memo-card__top"><span class="section-index">MEMO / SAMPLE</span><span class="memo-card__dots">•••</span></div><div class="memo-card__title">Что будет<br /><em>внутри</em></div><ul><li>{I["chk"]} Картина прибыли и денег</li><li>{I["chk"]} 3–5 приоритетных вопросов</li><li>{I["chk"]} Разрывы и причины</li><li>{I["chk"]} Ограничения анализа</li><li>{I["chk"]} Следующие шаги</li></ul><div class="memo-card__line"></div><div class="memo-card__caption">Обезличенный пример структуры документа</div></article>
          </div>
        </div>
      </section>
      <section class="section case-section">
        <div class="container">
          <div class="case-box reveal">
            <div class="case-box__side"><span class="section-index">05 / case study</span><div class="case-tag">{I["spk"]} обезличенные данные</div><p>Торговая компания</p></div>
            <div class="case-box__main"><div class="case-number">87,4<span>млн ₽</span></div><h2>Когда цифры перестают быть шумом — появляется <em>решение.</em></h2><p>Собственник не понимал, какое направление приносит маржу. По итогам диагностики получил memo с разбивкой по направлениям и три приоритетных шага — решение о пересмотре ассортимента принято за один день.</p><div class="case-outcome"><span><strong>3</strong> приоритетных шага</span><span><strong>1</strong> день до решения</span><span><strong>0</strong> лишних таблиц</span></div></div>
          </div>
          <p class="legal-note">Диагностика не является проверкой в значении федерального закона об аудиторской деятельности и не заменяет бухгалтерский учёт.</p>
        </div>
      </section>
      <section class="section faq-section" id="faq">
        <div class="container faq-layout">
          <div class="faq-heading reveal"><span class="section-index">06 / answers</span><h2>Частые<br /><em>вопросы</em></h2><p>Если не нашли ответ — напишите нам. Ответим в течение рабочего дня.</p><a class="text-link" href="https://t.me/maxima_consulting_leed_bot?start=diag_s1" data-tg-source="diag_s1" target="_blank" rel="noopener noreferrer">Задать вопрос в Telegram {I["aur"]}</a></div>
          <div class="faq-list reveal reveal--delay-1">{faq_html()}</div>
        </div>
      </section>
      <section class="section request-section" id="request">
        <div class="container request-layout">
          <div class="request-copy reveal"><span class="section-index">07 / next step</span><h2>Разберём<br />цифры <em>вместе</em></h2><p>Оставьте заявку — ответим в течение рабочего дня, без обязательств на этом шаге.</p>
            <div class="request-contact"><a href="tel:+79808488480"><span class="contact-icon">{I["phn"]}</span><span><small>Позвонить</small>+7 980 848-84-80</span></a><a href="https://t.me/maxima_consulting_leed_bot?start=diag_s1" data-tg-source="diag_s1" target="_blank" rel="noopener noreferrer"><span class="contact-icon">{I["msg"]}</span><span><small>Написать в Telegram</small>@maxima_consulting_leed_bot</span></a></div>
          </div>
          <div class="form-card reveal reveal--delay-1">
            <form id="lead-form" data-lead-form novalidate>
{LEAD_FORM_HIDDEN_FIELDS}
              <div class="form-card__top"><span>APPLICATION / 01</span><span><i class="form-status"></i> secure</span></div>
              <div class="form-grid">
                <label><span>Ваше имя <b>*</b></span><input id="name" name="name" placeholder="Как к вам обращаться" required /></label>
                <label><span>Телефон или Telegram <b>*</b></span><input id="contact" name="contact" placeholder="+7 ... / @username" required /></label>
                <label><span>Ваша роль <b>*</b></span><select id="role" name="role" required><option value="">Выберите роль</option><option value="owner">Собственник</option><option value="ceo">Генеральный директор</option><option value="cfo">Финансовый директор</option><option value="coo">Операционный директор</option><option value="other">Другое</option></select></label>
                <label><span>Отрасль <b>*</b></span><select id="industry" name="industry" required><option value="">Выберите отрасль</option><option value="trade">Торговля / опт-розница</option><option value="ecommerce">E-commerce / маркетплейсы</option><option value="production">Производство</option><option value="services">Услуги</option><option value="local_services">Локальные сервисы</option><option value="construction">Строительство</option><option value="other">Другое</option></select></label>
                <label><span>Диапазон годовой выручки <b>*</b></span><select id="revenue" name="revenue" required><option value="">Выберите диапазон</option><option value="under_20">до 20 млн ₽</option><option value="20_60">20–60 млн ₽</option><option value="60_150">60–150 млн ₽</option><option value="150_500">150–500 млн ₽</option><option value="over_500">свыше 500 млн ₽</option><option value="unknown">затрудняюсь ответить</option></select></label>
                <label><span>Срочность <b>*</b></span><select id="urgency" name="urgency" required><option value="">Выберите вариант</option><option value="urgent">Срочно — решение на этой неделе</option><option value="month">В течение месяца</option><option value="not_urgent">Не срочно</option><option value="researching">Изучаю рынок</option></select></label>
                <label class="form-full"><span>Главный вопрос <b>*</b></span><textarea id="question" name="question" placeholder="Что сейчас больше всего мешает принимать решения?" required></textarea></label>
              </div>
              <label class="consent"><input type="checkbox" name="consent_pdn" required /><span class="checkbox-ui">{I["chk"]}</span><span>Согласен(на) на обработку персональных данных в соответствии с <a href="privacy.html" target="_blank" rel="noopener">Политикой обработки персональных данных</a> <b>*</b></span></label>
              <button class="button button--lime button--submit" type="submit" disabled>Разобрать цифры {I["aur"]}</button>
              <p class="form-note" style="margin-top:12px;font-size:12px;color:#8a9189;">Или напишите: <a href="tel:+79808488480">+7 980 848-84-80</a> · <a href="https://t.me/maxima_consulting_leed_bot?start=diag_s1" data-tg-source="diag_s1" target="_blank" rel="noopener">@maxima_consulting_leed_bot</a></p>
            </form>
          </div>          </div>
        </div>
      </section>
    </main>
{FOOTER}
  </div>
  <script>{JS}</script>
  {LEAD_FORM_SCRIPT}
</body>
</html>
"""

for _out in (ROOT / "variant-financial-diagnostics-pro.html", ROOT / "financial-diagnostics.html"):
    _out.write_text(html, encoding="utf-8")
    print("OK", _out)
