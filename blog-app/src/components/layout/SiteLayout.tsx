import { ReactNode } from "react";

const NAV = [
  { href: "https://maxima-consulting.ru/uslugi", label: "Услуги" },
  { href: "https://maxima-consulting.ru/#services", label: "Цены" },
  { href: "https://maxima-consulting.ru/#case", label: "Кейсы" },
  { href: "https://maxima-consulting.ru/gajdy", label: "Гайды" },
  { href: "/blog/", label: "Статьи", current: true },
  { href: "https://maxima-consulting.ru/#process", label: "Как работаем" },
  { href: "https://maxima-consulting.ru/#contact", label: "Контакты" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a className="skip-link" href="#content">
        Перейти к содержимому
      </a>
      <div className="read-progress" data-reading-progress hidden />
      <header className="site-header" data-header>
        <div className="header-inner">
          <a className="logo" href="https://maxima-consulting.ru/" aria-label="maxima consulting — на главную">
            <img src="/assets/logo-mark-64.png" alt="" width={28} height={28} />
            <span>
              maxima <b>consulting</b>
            </span>
          </a>
          <nav className="main-nav" id="mainNav" aria-label="Основная навигация">
            {NAV.map((item) => (
              <a key={item.label} href={item.href} aria-current={item.current ? "page" : undefined}>
                {item.label}
              </a>
            ))}
            <a className="button nav-cta" href="https://maxima-consulting.ru/#contact">
              Записаться на разбор
            </a>
          </nav>
          <a className="button header-cta" href="https://maxima-consulting.ru/#contact">
            Записаться на разбор
          </a>
          <button className="menu-toggle" id="menuToggle" type="button" aria-label="Открыть меню" aria-expanded="false">
            Меню
          </button>
        </div>
      </header>
      <main id="content" className="flex-1 mx-auto w-full max-w-[1320px] px-5 py-10">
        {children}
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <a className="logo" href="https://maxima-consulting.ru/">
              maxima consulting
            </a>
            <p className="muted">Финансовый партнёр для МСБ</p>
          </div>
          <div className="footer-col">
            <span className="footer-label">Навигация</span>
            <a href="https://maxima-consulting.ru/uslugi">Услуги</a>
            <a href="/blog/">Статьи</a>
            <a href="https://maxima-consulting.ru/gajdy">Гайды</a>
            <a href="https://maxima-consulting.ru/#contact">Контакты</a>
          </div>
          <div className="footer-col">
            <span className="footer-label">Контакты</span>
            <a href="tel:+79808488480">+7 980 848-84-80</a>
            <a href="https://t.me/maxima_com">@maxima_com</a>
            <a href="https://vk.com/maxima_consulting">VK</a>
            <a href="https://m.tenchat.ru/u/eei8UmQE">TenChat</a>
          </div>
          <div className="footer-col">
            <span className="footer-label">Каналы</span>
            <div className="social-icons">
              <a href="https://t.me/maxima_com" aria-label="Telegram @maxima_com">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
              </a>
              <a href="https://max.ru/se14042176_biz" aria-label="Канал maxima consulting в MAX">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              </a>
            </div>
            {/* TODO(owner): добавить ИНН и реквизиты, когда будут утверждены. ТЗ 4.13. */}
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© maxima consulting, 2026</span>
          <span>
            <a href="https://maxima-consulting.ru/nda.html">NDA</a>
            {" · "}
            <a href="https://maxima-consulting.ru/privacy">Политика ПД</a>
          </span>
        </div>
        <p className="container price-note">
          Указанные цены не являются офертой и носят ознакомительный характер.
        </p>
      </footer>
      <div className="toast" data-toast role="status" hidden />
    </div>
  );
}
