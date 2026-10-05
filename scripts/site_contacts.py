"""Публичные контакты для сайта и генераторов лендингов."""

# Личный контакт для сообщений
TELEGRAM_CONTACT_USERNAME = "maxima_com"
TELEGRAM_CONTACT_URL = f"https://t.me/{TELEGRAM_CONTACT_USERNAME}"
TELEGRAM_CONTACT_HANDLE = f"@{TELEGRAM_CONTACT_USERNAME}"

# Публичный канал Telegram
TELEGRAM_CHANNEL_USERNAME = "maxima_cfo"
TELEGRAM_CHANNEL_URL = f"https://t.me/{TELEGRAM_CHANNEL_USERNAME}"
TELEGRAM_CHANNEL_HANDLE = "@maxima-cfo"

# Канал в мессенджере MAX
MAX_CHANNEL_URL = "https://max.ru/se14042176_biz"

# Обратная совместимость имён в генераторах
TELEGRAM_PUBLIC_USERNAME = TELEGRAM_CONTACT_USERNAME
TELEGRAM_PUBLIC_URL = TELEGRAM_CONTACT_URL
TELEGRAM_PUBLIC_HANDLE = TELEGRAM_CONTACT_HANDLE

PHONE_E164 = "+79808488480"
PHONE_TEL = f"tel:{PHONE_E164}"
PHONE_DISPLAY = "+7 980 848-84-80"

VK_URL = "https://vk.com/maxima_consulting"
TENCHAT_URL = "https://m.tenchat.ru/u/eei8UmQE"


def svg_telegram(size: int = 18) -> str:
    return (
        f'<svg class="icon" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
        f'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
        f'aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>'
    )


def svg_max(size: int = 18) -> str:
    return (
        f'<svg class="icon" width="{size}" height="{size}" viewBox="0 0 24 24" '
        f'aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" '
        f'fill="none" stroke="currentColor" stroke-width="1.6"/><text x="12" y="15.2" '
        f'text-anchor="middle" font-size="7.5" font-weight="700" fill="currentColor" '
        f'font-family="system-ui,sans-serif">MAX</text></svg>'
    )


SOCIAL_ICONS_CSS = """
.social-icons { display: flex; gap: 10px; margin: 6px 0 10px; flex-wrap: wrap; }
.social-icons a.social-icon {
  display: grid; place-items: center; width: 34px; height: 34px;
  border: 1px solid rgba(226,236,214,.16); border-radius: 50%; color: #aeb6ad;
  transition: color .2s, border-color .2s;
}
.social-icons a.social-icon:hover { color: #d7f36b; border-color: rgba(215,243,107,.4); }
.contact-channels { display: flex; gap: 10px; margin-top: 6px; }
.contact-channels a.social-icon {
  display: grid; place-items: center; width: 36px; height: 36px;
  border: 1px solid rgba(226,236,214,.18); border-radius: 50%; color: #e8ece4;
}
.contact-channels a.social-icon:hover { color: #d7f36b; border-color: rgba(215,243,107,.45); }
"""


def channel_icon_links_html(tg_start: str, size: int = 18) -> str:
    tg_attr = f' data-tg-source="{tg_start}"' if tg_start else ""
    return (
        f'<div class="social-icons">'
        f'<a class="social-icon" href="{TELEGRAM_CHANNEL_URL}"{tg_attr} target="_blank" '
        f'rel="noopener noreferrer" aria-label="Telegram-канал {TELEGRAM_CHANNEL_HANDLE}">'
        f"{svg_telegram(size)}</a>"
        f'<a class="social-icon" href="{MAX_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" '
        f'aria-label="Канал maxima consulting в MAX">{svg_max(size)}</a>'
        f"</div>"
    )
