"""Общие фрагменты навигации для статических страниц."""

GAJDY_HREF = "/gajdy"
BLOG_HREF = "/blog/"


def nav_guides_and_blog_desktop() -> str:
    return (
        f'<a href="{GAJDY_HREF}">Гайды</a>'
        f'<a href="{BLOG_HREF}">Статьи</a>'
    )


def nav_guides_and_blog_mobile(chr_icon: str) -> str:
    return (
        f'<a href="{GAJDY_HREF}">Гайды {chr_icon}</a>'
        f'<a href="{BLOG_HREF}">Статьи {chr_icon}</a>'
    )


def nav_guides_hub_desktop() -> str:
    return (
        '<a href="/uslugi">Услуги</a>'
        f'<a href="{BLOG_HREF}">Статьи</a>'
        f'<a href="{GAJDY_HREF}" aria-current="page">Гайды</a>'
    )


def nav_guides_hub_mobile(chr_icon: str) -> str:
    return (
        f'<a href="/uslugi">Услуги {chr_icon}</a>'
        f'<a href="{BLOG_HREF}">Статьи {chr_icon}</a>'
        f'<a href="{GAJDY_HREF}" aria-current="page">Гайды {chr_icon}</a>'
    )
