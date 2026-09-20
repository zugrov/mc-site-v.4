import { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0b0b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="https://maxima-consulting.ru/" className="flex items-center gap-2 text-sm">
            <img
              src="https://maxima-consulting.ru/assets/logo-maxima.png"
              alt=""
              width={28}
              height={28}
            />
            <span>
              maxima <b>consulting</b>
            </span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm text-[#bfc2ba]">
            <a href="https://maxima-consulting.ru/#services" className="hover:text-white">
              Услуги
            </a>
            <a href="/blog/" className="text-white font-medium">Статьи</a>
            <a href="https://maxima-consulting.ru/#contact" className="hover:text-white">
              Контакты
            </a>
          </nav>
          <a
            href="https://maxima-consulting.ru/#contact"
            className="text-xs md:text-sm rounded-md bg-[#0d9488] px-3 py-2 text-white hover:bg-[#0f766e]"
          >
            Записаться
          </a>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-5 py-10">{children}</main>
      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#6b7280]">
        <p>
          © maxima consulting ·{" "}
          <a href="https://maxima-consulting.ru/nda.html" className="hover:text-teal-300">
            NDA
          </a>
          {" · "}
          <a href="https://maxima-consulting.ru/privacy.html" className="hover:text-teal-300">
            Политика ПД
          </a>
        </p>
      </footer>
    </div>
  );
}
