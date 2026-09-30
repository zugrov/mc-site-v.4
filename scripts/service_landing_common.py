"""Общие фрагменты для продуктовых лендингов услуг."""
import json
from typing import Any

SITE_HOME = "https://maxima-consulting.ru/"

BRAND_INNER = (
    '<img class="brand-logo" src="assets/logo-maxima.png" alt="" width="28" height="28" />'
    '<span class="brand-wordmark">maxima<span>consulting</span></span>'
)

SERVICE_LINKS = [
    ("/uslugi", "Все услуги"),
    ("/financial-diagnostics", "Финансовая диагностика"),
    ("/nds-2026", "НДС-аудит 2026"),
    ("/upravlenchesky-uchet", "Управленческий учёт"),
    ("/finansovaya-model", "Финансовая модель"),
    ("/nalogovaya-optimizatsiya", "Налоговая оптимизация"),
    ("/cfo-light", "CFO-light"),
    ("/advisory-dlya-sobstvennika", "Advisory"),
]

EXTRA_CSS = """
.brand-logo { width: 28px; height: 28px; object-fit: contain; flex-shrink: 0; }
.icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
.site-header--open .mobile-nav { display: grid !important; }
.site-header:not(.site-header--open) .mobile-nav { display: none !important; }
.honeypot { position: absolute; left: -10000px; opacity: 0; height: 0; overflow: hidden; }
.faq-item:not(.faq-item--open) .faq-answer p { padding: 0; opacity: 0; max-height: 0; overflow: hidden; }
.breadcrumbs { font: 500 11px/1.4 "DM Mono", monospace; color: #89918b; margin-bottom: 18px; }
.breadcrumbs a { color: #b8c0b8; }
.breadcrumbs a:hover { color: #d7f36b; }
.content-updated { margin-top: 48px; font-size: 12px; color: #6f776f; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 28px; }
.pricing-card { border: 1px solid rgba(226,236,214,.14); padding: 22px 20px; background: rgba(255,255,255,.02); border-radius: 12px; }
.pricing-card--featured { border-color: rgba(215,243,107,.45); background: rgba(215,243,107,.06); }
.pricing-card h3 { margin: 0 0 8px; font-size: 20px; }
.pricing-card .price { font-size: 26px; font-weight: 800; letter-spacing: -.04em; margin: 12px 0; }
.pricing-card ul { margin: 0; padding-left: 18px; color: #a8afa6; font-size: 13px; line-height: 1.55; }
.next-step { margin: 0 0 48px; padding: 22px 24px; border: 1px solid rgba(215,243,107,.25); border-radius: 12px; background: rgba(215,243,107,.04); }
.next-step h3 { margin: 0 0 10px; font-size: 18px; }
.next-step-links { display: flex; flex-wrap: wrap; gap: 12px 20px; margin-top: 12px; }
.next-step-links a { color: #d7f36b; font-weight: 700; font-size: 14px; }
.fit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 24px; }
.fit-col { border: 1px solid rgba(226,236,214,.12); padding: 18px; border-radius: 10px; }
.fit-col h3 { margin: 0 0 10px; font-size: 16px; }
.fit-col ul { margin: 0; padding-left: 18px; font-size: 13px; color: #a8afa6; line-height: 1.5; }
.hub-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 28px; }
.hub-card { border: 1px solid rgba(226,236,214,.12); padding: 18px; border-radius: 10px; min-height: 200px; display: flex; flex-direction: column; }
.hub-card h3 { margin: 8px 0; font-size: 18px; }
.hub-card p { flex: 1; font-size: 13px; color: #9aa19a; line-height: 1.45; }
.hub-card .hub-meta { font-size: 12px; color: #d7f36b; margin: 10px 0; }
.quiz-box { margin-top: 32px; padding: 24px; border: 1px solid rgba(226,236,214,.14); border-radius: 12px; }
.quiz-step { display: none; }
.quiz-step.is-active { display: block; }
.quiz-options { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
.quiz-options button { border: 1px solid rgba(226,236,214,.2); background: transparent; color: #ecf0e4; padding: 10px 14px; border-radius: 999px; cursor: pointer; font-size: 13px; }
.quiz-options button:hover { border-color: #d7f36b; color: #d7f36b; }
.quiz-result { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(226,236,214,.12); }
.chain-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 20px; font-size: 13px; color: #b0b7ae; }
.chain-row a { color: #d7f36b; font-weight: 600; }
.floating-cta-price { display: block; font-size: 10px; opacity: .85; font-weight: 600; }
@media (max-width: 900px) { .hub-grid, .fit-grid { grid-template-columns: 1fr; } }
"""

# Тема главной (teal) только для хаба /uslugi
HUB_PRO_THEME_CSS = """
:root {
  --accent: #0d9488;
  --accent-light: #ccfbf1;
  --accent-hover: #0f766e;
  --paper: #eeeae1;
  --line: rgba(238, 234, 225, .14);
  --ease: cubic-bezier(.23, 1, .32, 1);
  --primary: #0d9488;
  --ring: #0d9488;
}
body, .site-shell { background: #0a0b0b !important; color: var(--paper) !important; }
.button--lime, .button-primary { background: var(--accent) !important; color: #fff !important; border-color: var(--accent) !important; }
.button--lime:hover:not(:disabled) { background: var(--accent-hover) !important; }
.section-index, .text-link, .hub-card .hub-meta, .chain-row a, .breadcrumbs a:hover { color: var(--accent-light) !important; }
.text-link:hover { color: #fff !important; }
.quiz-options button:hover { border-color: rgba(13, 148, 136, .52) !important; color: var(--accent-light) !important; }
.form-card__top span:first-child, .floating-cta { background: var(--accent) !important; }
.hub-card {
  position: relative;
  overflow: hidden;
  background: #111313;
  border: 1px solid var(--line);
  border-radius: 12px;
  transition: transform .34s var(--ease), border-color .34s var(--ease), box-shadow .34s var(--ease), background .34s var(--ease);
}
.hub-card::after {
  content: "";
  position: absolute;
  width: 190px;
  height: 190px;
  right: -78px;
  top: -92px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  filter: blur(46px);
  pointer-events: none;
  transition: opacity .38s var(--ease), transform .38s var(--ease);
}
.hub-card:hover {
  transform: translateY(-8px);
  border-color: rgba(13, 148, 136, .52);
  box-shadow: 0 22px 52px rgba(0, 0, 0, .28), 0 0 30px rgba(13, 148, 136, .12);
}
.hub-card:hover::after { opacity: .16; transform: translate(-18px, 18px); }
.hub-card > * { position: relative; z-index: 1; }
a.hub-card { text-decoration: none; color: inherit; cursor: pointer; }
.hub-card--center { grid-column: 2; }
.hub-card-cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  width: 100%;
  color: var(--accent-light);
  font-size: 12px;
  font-weight: 700;
  transition: color .2s, gap .2s var(--ease);
}
a.hub-card:hover .hub-card-cta { color: #fff; gap: 13px; }
.hub-card-cta .icon { transition: transform .25s var(--ease); }
a.hub-card:hover .hub-card-cta .icon { transform: translate(3px, -3px); }
@media (max-width: 900px) { .hub-card--center { grid-column: auto; } }
.hub-quiz-section {
  padding: 0 0 56px;
  margin-top: -12px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, transparent, rgba(13, 148, 136, .06) 40%, transparent);
}
.quiz-box--hub {
  margin-top: 0;
  padding: 32px 36px 36px;
  border: 1px solid rgba(13, 148, 136, .35);
  border-radius: 16px;
  background: rgba(17, 19, 19, .92);
  box-shadow: 0 24px 60px rgba(0, 0, 0, .28);
}
.quiz-box__eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--accent-light);
}
.quiz-box--hub h2 {
  margin: 0 0 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(26px, 3.2vw, 36px);
  font-weight: 500;
  letter-spacing: -.04em;
  line-height: 1.1;
}
.quiz-box__lead {
  margin: 0 0 22px;
  max-width: 640px;
  font-size: 15px;
  line-height: 1.55;
  color: #a8aea6;
}
.quiz-box__lead strong { color: var(--paper); font-weight: 600; }
.quiz-progress {
  height: 4px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(238, 234, 225, .1);
  overflow: hidden;
}
.quiz-progress__bar {
  height: 100%;
  width: 33%;
  border-radius: inherit;
  background: var(--accent);
  transition: width .35s var(--ease);
}
.quiz-progress__label {
  margin: 0 0 24px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #8a928a;
}
.quiz-box--hub .quiz-step > p {
  margin: 0 0 6px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--accent-light);
}
.quiz-box--hub .quiz-step h3 {
  margin: 0 0 18px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -.03em;
}
.quiz-box--hub .quiz-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 0;
}
.quiz-box--hub .quiz-options button {
  min-height: 56px;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  line-height: 1.35;
  border-color: rgba(238, 234, 225, .18);
  transition: border-color .2s, background .2s, transform .2s var(--ease);
}
.quiz-box--hub .quiz-options button:hover {
  background: rgba(13, 148, 136, .12);
  transform: translateY(-2px);
}
.quiz-box--hub .quiz-result {
  margin-top: 0;
  padding-top: 8px;
  border-top: 0;
  font-size: 16px;
  line-height: 1.5;
}
.quiz-box--hub .quiz-result .button { margin-top: 18px; }
@media (max-width: 700px) {
  .hub-quiz-section { padding: 0 0 36px; margin-top: 0; }
  .quiz-box--hub { padding: 22px 18px 24px; }
  .quiz-box--hub .quiz-options { grid-template-columns: 1fr; }
}
.hub-hero { min-height: auto !important; padding: 128px 0 56px !important; }
.hub-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(280px, .98fr);
  gap: 36px;
  align-items: center;
  position: relative;
  z-index: 1;
}
@media (max-width: 900px) { .hub-hero-grid { grid-template-columns: 1fr; } }
@media (hover: none), (pointer: coarse) {
  .hub-card:hover { transform: none; box-shadow: none; }
  .hub-card:hover::after { opacity: 0; }
}
"""


def footer_html(tg_start: str) -> str:
    links = "".join(f'<a href="{href}">{label}</a>' for href, label in SERVICE_LINKS)
    return f"""
      <footer class="site-footer">
        <div class="container footer-top">
          <a class="brand" href="{SITE_HOME}">{BRAND_INNER}</a>
          <p>Финансовый партнёр<br />для МСБ</p>
          <div class="footer-social"><span>Соцсети</span><a href="https://t.me/maxima_consulting_leed_bot?start={tg_start}" data-tg-source="{tg_start}" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://vk.com/maxima_consulting" target="_blank" rel="noopener noreferrer">VK</a><a href="https://m.tenchat.ru/u/eei8UmQE" target="_blank" rel="noopener noreferrer">TenChat</a></div>
          <div class="footer-services"><span>Услуги</span>{links}</div>
        </div>
        <div class="container footer-bottom"><span>© 2026 maxima consulting</span><div><a href="nda.html">NDA</a><a href="privacy.html">Политика ПД</a></div><span>Обновлено: сентябрь 2026</span></div>
      </footer>
"""


def lead_form_html(tg_start: str, submit_label: str, aur: str) -> str:
    from publish_common import LEAD_FORM_HIDDEN_FIELDS

    return f"""
            <form id="lead-form" data-lead-form novalidate>
{LEAD_FORM_HIDDEN_FIELDS}
              <div class="form-card__top"><span>Заявка</span><span><i class="form-status"></i> NDA до передачи данных</span></div>
              <div class="form-grid">
                <label><span>Ваше имя <b>*</b></span><input id="name" name="name" placeholder="Как к вам обращаться" required /></label>
                <label><span>Телефон или Telegram <b>*</b></span><input id="contact" name="contact" placeholder="+7 ... / @username" required /></label>
                <label><span>Ваша роль <b>*</b></span><select id="role" name="role" required><option value="">Выберите роль</option><option value="owner">Собственник</option><option value="ceo">Генеральный директор</option><option value="cfo">Финансовый директор</option><option value="coo">Операционный директор</option><option value="other">Другое</option></select></label>
                <label><span>Отрасль <b>*</b></span><select id="industry" name="industry" required><option value="">Выберите отрасль</option><option value="trade">Торговля / опт-розница</option><option value="ecommerce">E-commerce / маркетплейсы</option><option value="production">Производство</option><option value="services">Услуги</option><option value="local_services">Локальные сервисы</option><option value="construction">Строительство</option><option value="other">Другое</option></select></label>
                <label><span>Диапазон годовой выручки <b>*</b></span><select id="revenue" name="revenue" required><option value="">Выберите диапазон</option><option value="under_20">до 20 млн ₽</option><option value="20_60">20–60 млн ₽</option><option value="60_150">60–150 млн ₽</option><option value="150_500">150–500 млн ₽</option><option value="over_500">свыше 500 млн ₽</option><option value="unknown">затрудняюсь ответить</option></select></label>
                <label><span>Срочность <b>*</b></span><select id="urgency" name="urgency" required><option value="">Выберите вариант</option><option value="urgent">Срочно — решение на этой неделе</option><option value="month">В течение месяца</option><option value="not_urgent">Не срочно</option><option value="researching">Изучаю рынок</option></select></label>
                <label class="form-full"><span>Главный вопрос <b>*</b></span><textarea id="question" name="question" placeholder="Что сейчас больше всего мешает принимать решения?" required></textarea></label>
              </div>
              <label class="consent"><input type="checkbox" name="consent_pdn" required /><span class="checkbox-ui">✓</span><span>Согласен(на) на обработку персональных данных в соответствии с <a href="privacy.html" target="_blank" rel="noopener">Политикой обработки персональных данных</a> <b>*</b></span></label>
              <button class="button button--lime button--submit" type="submit" disabled>{submit_label} {aur}</button>
              <p class="form-note" style="margin-top:12px;font-size:12px;color:#8a9189;">Или напишите: <a href="tel:+79808488480">+7 980 848-84-80</a> · <a href="https://t.me/maxima_consulting_leed_bot?start={tg_start}" data-tg-source="{tg_start}" target="_blank" rel="noopener">@maxima_consulting_leed_bot</a></p>
            </form>
"""


def json_ld_script(blocks: list[dict[str, Any]]) -> str:
    payload = blocks if len(blocks) > 1 else blocks[0]
    return (
        f'<script type="application/ld+json">{json.dumps(payload, ensure_ascii=False)}</script>'
    )


def breadcrumb_ld(name: str, url: str) -> dict[str, Any]:
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Главная", "item": SITE_HOME},
            {"@type": "ListItem", "position": 2, "name": "Услуги", "item": f"{SITE_HOME}uslugi"},
            {"@type": "ListItem", "position": 3, "name": name, "item": url},
        ],
    }


def service_ld(name: str, description: str, url: str, price_from: str) -> dict[str, Any]:
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": name,
        "description": description,
        "provider": {"@type": "Organization", "name": "maxima consulting", "url": SITE_HOME},
        "areaServed": "RU",
        "url": url,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "RUB",
            "description": f"от {price_from}",
        },
    }


def faq_ld(faqs: list[tuple[str, str]]) -> dict[str, Any]:
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in faqs
        ],
    }


def breadcrumbs_html(current: str) -> str:
    return (
        f'<nav class="breadcrumbs" aria-label="Хлебные крошки">'
        f'<a href="{SITE_HOME}">Главная</a> → <a href="/uslugi">Услуги</a> → <span>{current}</span>'
        f"</nav>"
    )
