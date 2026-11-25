"""Общая шапка, подвал и подключение шрифтов для всех страниц."""
import re

ARROW = (
    '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" '
    'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
    'stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/>'
    '<path d="M7 7h10v10"/></svg>'
)

MENU_ICON = (
    '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" '
    'stroke="currentColor" stroke-width="1.5" aria-hidden="true">'
    '<path d="M4 7h16M4 12h16M4 17h16"/></svg>'
)

HEAD_ASSETS = """
  <link rel="preload" href="/assets/fonts/manrope-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/fonts.css">
  <link rel="stylesheet" href="/assets/tokens.css">
  <link rel="stylesheet" href="/assets/base.css">
  <link rel="stylesheet" href="/assets/skin.css">
"""

MOTION_SCRIPT = '<script src="/assets/motion.js" defer></script>'

NAV_ITEMS = (
    ("/uslugi", "Услуги", "uslugi"),
    ("/#services", "Цены", "services"),
    ("/#case", "Кейсы", "case"),
    ("/gajdy", "Гайды", "gajdy"),
    ("/blog/", "Статьи", "blog"),
    ("/#process", "Как работаем", "process"),
    ("/#contact", "Контакты", "contact"),
)


def recolor(css: str) -> str:
    """Салатовый акцент старых лендингов заменяется на бирюзу из токенов."""
    return (
        css.replace("#d7f36b", "#0D9488")
        .replace("#D7F36B", "#0D9488")
        .replace("#e7fa95", "#5EEAD4")
        .replace("#E7FA95", "#5EEAD4")
        .replace("rgba(215,243,107", "rgba(13,148,136")
        .replace("rgba(215, 243, 107", "rgba(13, 148, 136")
    )


def header_html(current: str = "", cta_href: str = "/#contact") -> str:
    links = []
    for href, label, key in NAV_ITEMS:
        current_attr = ' aria-current="page"' if key == current else ""
        links.append(f'<a href="{href}"{current_attr}>{label}</a>')
    nav = "".join(links)
    nav += (
        f'<a class="button nav-cta" href="{cta_href}">Записаться на разбор {ARROW}</a>'
    )
    return f"""
    <a class="skip-link" href="#content">Перейти к содержимому</a>
    <div class="read-progress" data-reading-progress hidden></div>
    <header class="site-header" data-header data-mc-chrome>
      <div class="header-inner">
        <a class="logo" href="/" aria-label="maxima consulting — на главную">
          <img src="/assets/logo-maxima.png" alt="" width="28" height="28">
          <span>maxima <b>consulting</b></span>
        </a>
        <nav class="main-nav" id="mainNav" aria-label="Основная навигация">{nav}</nav>
        <a class="button header-cta" href="{cta_href}">Записаться на разбор {ARROW}</a>
        <button class="menu-toggle" id="menuToggle" type="button" aria-label="Открыть меню" aria-expanded="false">{MENU_ICON}</button>
      </div>
    </header>
"""


def footer_html() -> str:
    return """
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-col">
          <a class="logo" href="/" aria-label="maxima consulting — на главную">
            <img src="/assets/logo-maxima.png" alt="" width="28" height="28">
            <span>maxima <b>consulting</b></span>
          </a>
          <p class="muted">Финансовый партнёр для МСБ</p>
        </div>
        <div class="footer-col">
          <span class="footer-label">Навигация</span>
          <a href="/uslugi">Услуги</a>
          <a href="/#services">Цены</a>
          <a href="/#case">Кейсы</a>
          <a href="/gajdy">Гайды</a>
          <a href="/blog/">Статьи</a>
          <a href="/#process">Как работаем</a>
          <a href="/#contact">Контакты</a>
        </div>
        <div class="footer-col">
          <span class="footer-label">Контакты</span>
          <a href="tel:+79808488480">+7 980 848-84-80</a>
          <a href="https://t.me/maxima_com" data-tg-source="site_organic">@maxima_com</a>
          <a href="https://vk.com/maxima_consulting">VK</a>
          <a href="https://m.tenchat.ru/u/eei8UmQE">TenChat</a>
        </div>
        <div class="footer-col">
          <span class="footer-label">Каналы</span>
          <!-- TODO(owner): ссылку на канал @maxima_cfo в разделе «Каналы» оставляем? ТЗ 4.13. -->
          <div class="social-icons">
            <a href="https://t.me/maxima_cfo" data-tg-source="site_organic" target="_blank" rel="noopener noreferrer" aria-label="Telegram-канал @maxima-cfo"><svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></a>
            <a href="https://max.ru/se14042176_biz" target="_blank" rel="noopener noreferrer" aria-label="Канал maxima consulting в MAX"><svg class="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></a>
            <a href="https://vk.com/maxima_consulting" aria-label="VK"><svg class="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></a>
          </div>
          <!-- TODO(owner): добавить ИНН и реквизиты, когда будут утверждены. ТЗ 4.13. -->
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© maxima consulting, 2026</span>
        <span><a href="/nda.html">NDA</a> · <a href="/privacy">Политика ПД</a></span>
        <span>made by maxima lab ✳</span>
      </div>
      <p class="container price-note">Указанные цены не являются офертой и носят ознакомительный характер.</p>
    </footer>
    <div class="toast" data-toast role="status" hidden></div>
"""


_GOOGLE_FONTS = re.compile(
    r"\s*<link rel=\"preconnect\" href=\"https://fonts\.googleapis\.com\"[^>]*>\s*"
    r"(?:<link rel=\"preconnect\" href=\"https://fonts\.gstatic\.com\"[^>]*>\s*)?"
    r"<link[^>]*fonts\.googleapis\.com[^>]*>",
    re.I,
)
_HEADER = re.compile(r"<header\b[^>]*>.*?</header>", re.S | re.I)
_FOOTER = re.compile(r"<footer\b[^>]*>.*?</footer>", re.S | re.I)
_FONT_IMPORT = re.compile(
    r"@import\s+url\(['\"]https://fonts\.googleapis\.com[^)]+\);?",
    re.I,
)

PAGE_CURRENT = {
    "uslugi.html": "uslugi",
    "gajdy.html": "gajdy",
    "financial-diagnostics.html": "uslugi",
    "nds-2026.html": "uslugi",
    "upravlenchesky-uchet.html": "uslugi",
    "finansovaya-model.html": "uslugi",
    "nalogovaya-optimizatsiya.html": "uslugi",
    "cfo-light.html": "uslugi",
    "advisory-dlya-sobstvennika.html": "uslugi",
}


def apply_page(
    html: str,
    current: str = "",
    cta_href: str = "/#contact",
    theme: bool = True,
) -> str:
    """Подключает общие стили и заменяет шапку с подвалом, не трогая тексты страницы."""
    if "data-mc-chrome" in html:
        return html
    html = recolor(html)
    html = _FONT_IMPORT.sub("", html)
    html = _GOOGLE_FONTS.sub("\n" + HEAD_ASSETS, html)
    if "assets/fonts.css" not in html:
        html = html.replace("</head>", HEAD_ASSETS + "\n</head>", 1)
    if theme and "legacy-page" not in html:
        if "<body>" in html:
            html = html.replace("<body>", '<body class="legacy-page">', 1)
        elif "<body " in html:
            html = html.replace("<body ", '<body class="legacy-page" ', 1)
    html, n = _HEADER.subn(header_html(current, cta_href), html, count=1)
    if n:
        html, replaced_footer = _FOOTER.subn(footer_html().strip(), html, count=1)
        if replaced_footer == 0:
            html = html.replace("</body>", footer_html() + "\n</body>", 1)
    if "/assets/motion.js" not in html:
        html = html.replace("</body>", MOTION_SCRIPT + "\n</body>", 1)
    html = html.replace(
        '<script src="/assets/cookie-consent.js?v=20261020"></script>',
        '<script src="/assets/cookie-consent.js?v=20261125" defer></script>',
    )
    html = html.replace(
        "<script src=\"/assets/cookie-consent.js?v=20261020\"></script>",
        '<script src="/assets/cookie-consent.js?v=20261125" defer></script>',
    )
    return html


def lead_form_html(source: str) -> str:
    """Три поля на первом шаге. Остальные обязательные поля — на втором шаге того же POST.

    Сервер по-прежнему ждёт роль, отрасль, срочность и вопрос в первом запросе,
    поэтому второй шаг отправляется вместе с ними, а не через /enrich.
    """
    return f"""
            <form class="contact-form" data-lead-form data-wizard novalidate>
              <div class="form-top"><span class="label">бесплатный разбор · 30 мин</span></div>
              <div class="honeypot" aria-hidden="true">
                <label for="middle_name">Middle name</label>
                <input type="text" name="middle_name" id="middle_name" tabindex="-1" autocomplete="off">
              </div>
              <input type="hidden" name="utm_source">
              <input type="hidden" name="utm_medium">
              <input type="hidden" name="utm_campaign">
              <input type="hidden" name="utm_content">
              <input type="hidden" name="utm_term">
              <input type="hidden" name="utm_campaign_name">
              <input type="hidden" name="yclid">
              <input type="hidden" name="client_id">
              <input type="hidden" name="landing_url">
              <input type="hidden" name="referrer">
              <input type="hidden" name="client_id_missing">
              <div data-wizard-step="1">
                <label class="field">Ваше имя
                  <input type="text" id="name" name="name" autocomplete="name" placeholder="Как к вам обращаться?" required>
                </label>
                <label class="field">Телефон или Telegram
                  <input type="text" id="contact" name="contact" autocomplete="tel" placeholder="+7 или @username" required>
                </label>
                <label class="field">Диапазон выручки
                  <select id="revenue" name="revenue" required>
                    <option value="">Выберите</option>
                    <option value="under_20">до 20 млн ₽</option>
                    <option value="20_60">20–60 млн ₽</option>
                    <option value="60_150">60–150 млн ₽</option>
                    <option value="150_500">150–500 млн ₽</option>
                    <option value="over_500">свыше 500 млн ₽</option>
                    <option value="unknown">затрудняюсь ответить</option>
                  </select>
                </label>
                <button class="button" type="button" data-wizard-next>Дальше {ARROW}</button>
              </div>
              <div data-wizard-step="2" hidden>
                <label class="field">Роль в компании
                  <select id="role" name="role" required>
                    <option value="">Выберите</option>
                    <option value="owner">Собственник</option>
                    <option value="ceo">Генеральный директор</option>
                    <option value="cfo">Финансовый директор</option>
                    <option value="coo">Операционный директор</option>
                    <option value="other">Другое</option>
                  </select>
                </label>
                <label class="field">Отрасль
                  <select id="industry" name="industry" required>
                    <option value="">Выберите</option>
                    <option value="trade">Торговля/опт-розница</option>
                    <option value="ecommerce">E-commerce/маркетплейсы</option>
                    <option value="production">Производство</option>
                    <option value="services">Услуги</option>
                    <option value="local_services">Локальные сервисы</option>
                    <option value="construction">Строительство</option>
                    <option value="other">Другое</option>
                  </select>
                </label>
                <label class="field">Срочность
                  <select id="urgency" name="urgency" required>
                    <option value="">Выберите</option>
                    <option value="urgent">Срочно (нужно решение на этой неделе)</option>
                    <option value="month">В течение месяца</option>
                    <option value="not_urgent">Не срочно</option>
                    <option value="researching">Изучаю рынок</option>
                  </select>
                </label>
                <label class="field">Главный вопрос
                  <textarea id="question" name="question" placeholder="Что сейчас беспокоит в финансах бизнеса?" rows="3" required></textarea>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="consent_pdn" required>
                  <span>Согласен(на) на обработку персональных данных в соответствии с <a href="/privacy">Политикой обработки персональных данных</a> *</span>
                </label>
                <button class="button" type="submit">Записаться на разбор {ARROW}</button>
                <small class="price-note">Не продаём данные. Не спамим. Ответим в течение рабочего дня.</small>
                <p class="price-note">Или напишите: <a href="tel:+79808488480">+7&nbsp;980&nbsp;848-84-80</a> · <a href="https://t.me/maxima_com" data-tg-source="{source}">@maxima_com</a></p>
              </div>
            </form>
"""
