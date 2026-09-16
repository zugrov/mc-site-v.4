import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleArrowOutUpRight,
  FileText,
  Instagram,
  Linkedin,
  LockKeyhole,
  Menu,
  MessageCircle,
  Minus,
  MoveRight,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";

const telegramUrl = "https://t.me/maxima_consulting_leed_bot?start=site_organic";

const painPoints = [
  {
    number: "01",
    title: "Прибыль на бумаге, а денег нет",
    text: "P&L показывает прибыль, но кассовые разрывы всё равно возникают из-за отсрочек платежей, неучтённых обязательств или скрыто убыточных клиентов.",
    result: "Выявление убыточных клиентов подняло маржу на 9 п.п.",
    tone: "lime",
  },
  {
    number: "02",
    title: "Не понимаю реальную маржу",
    text: "Без разбивки маржинальности по SKU или клиентам собственник управляет бизнесом вслепую — высокая выручка может маскировать убыточные направления.",
    result: "12 SKU разобраны за 5 дней — стало видно, что приносит деньги.",
    tone: "violet",
  },
  {
    number: "03",
    title: "НДС-2026 приближается",
    text: "Порог освобождения от НДС при УСН зафиксирован на уровне 20 млн ₽ до 2029 года. Лучше подготовиться до момента перехода.",
    result: "12 компаний подготовлены к переходу до дедлайна.",
    tone: "orange",
  },
  {
    number: "04",
    title: "Решения принимаются на ощущениях",
    text: "Без управленческой картины — P&L, cash flow, маржинальности — решения о ценах, найме и инвестициях основаны на интуиции.",
    result: "Управленческая картина собирается за 7 дней.",
    tone: "blue",
  },
];

const services = [
  {
    label: "БАЗОВЫЙ",
    name: "Точка входа",
    description: "Быстрые проекты с понятным результатом. Идеально для знакомства.",
    items: [
      ["НДС-аудит", "15 000 — 30 000 ₽", "3–5 дней"],
      ["Финансовая диагностика", "20 000 — 45 000 ₽", "7 дней"],
      ["Где бизнес теряет деньги", "от 15 000 ₽", "1–2 дня"],
    ],
  },
  {
    label: "ПРОЕКТЫ",
    name: "Собрать систему",
    description: "Полноценные проекты с документацией, моделями и дорожной картой.",
    items: [
      ["НДС-2026: полная подготовка", "50 000 — 120 000 ₽", "3–6 недель"],
      ["Управленческий учёт с нуля", "60 000 — 150 000 ₽", "4–8 недель"],
      ["Финансовая модель", "40 000 — 100 000 ₽", "2–4 недели"],
      ["Налогово-финансовая оптимизация", "60 000 — 130 000 ₽", "3–5 недель"],
    ],
  },
  {
    label: "ПОДПИСКА",
    name: "Постоянная поддержка",
    description: "Ежемесячное сопровождение — когда нужен постоянный финансовый взгляд.",
    items: [
      ["CFO-light", "20 000 — 55 000 ₽/мес", "Ежемесячно"],
      ["Advisory для собственника", "40 000 — 80 000 ₽/мес", "Ежемесячно"],
    ],
  },
];

const faqs = [
  ["Работаете онлайн по всей России?", "Да, все проекты — от НДС-аудита до управленческого учёта — проводятся удалённо через Zoom, Яндекс Телемост или Telegram, независимо от региона клиента."],
  ["У меня есть бухгалтер. Зачем мне финансовый директор на аутсорсе?", "Бухгалтер отвечает за корректную отчётность перед налоговой, а финансовый директор — за управленческие решения: маржинальность, cash flow, налоговую оптимизацию и финмодели. Это разные задачи."],
  ["Как быстро будет результат?", "Базовые продукты дают результат за 3–7 дней. Полноценные проекты занимают от 2 до 8 недель в зависимости от объёма."],
  ["Что такое «бесплатный разбор»?", "Это 30-минутный звонок, на котором разбирается ситуация клиента и даются первые рекомендации без оплаты и обязательств. NDA подписывается до передачи любых финансовых данных."],
  ["Мои финансовые данные в безопасности?", "Да, NDA подписывается до начала работы и передачи любых данных, а сами данные не передаются третьим лицам."],
  ["Как оплата?", "Оплата фиксируется в договоре по итогам бесплатного разбора. Если через 7 дней клиент не получает конкретных цифр — деньги возвращаются."],
];

function useScrollReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -9% 0px", threshold: 0.12 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function useHeroParallax() {
  useEffect(() => {
    const visual = document.querySelector<HTMLElement>(".hero-parallax");
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = window.scrollY;
    let hasTouchPosition = false;
    const render = () => {
      frame = 0;
      const rect = visual.getBoundingClientRect();
      const x = (pointerX - (rect.left + rect.width / 2)) / Math.max(rect.width, 1);
      const y = (pointerY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1);
      const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
      const viewportWidth = window.innerWidth;
      const touchIntensity = viewportWidth <= 420 ? 0.34 : viewportWidth <= 767 ? 0.5 : viewportWidth <= 1024 ? 0.72 : 1;
      const intensity = isTouch ? touchIntensity : 1;
      const scrollIntensity = isTouch ? (viewportWidth <= 420 ? 0.018 : viewportWidth <= 767 ? 0.026 : 0.032) : 0.035;
      visual.style.setProperty("--parallax-x", `${(x * 10 * intensity).toFixed(2)}px`);
      visual.style.setProperty("--parallax-y", `${(y * 8 * intensity + Math.max(-18, Math.min(18, scrollY * -scrollIntensity))).toFixed(2)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onPointerMove = (event: PointerEvent) => { pointerX = event.clientX; pointerY = event.clientY; schedule(); };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      hasTouchPosition = true;
      pointerX = touch.clientX;
      pointerY = touch.clientY;
      schedule();
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      hasTouchPosition = true;
      pointerX = touch.clientX;
      pointerY = touch.clientY;
      schedule();
    };
    const onTouchEnd = () => {
      if (!hasTouchPosition) return;
      hasTouchPosition = false;
      const rect = visual.getBoundingClientRect();
      pointerX = rect.left + rect.width / 2;
      pointerY = rect.top + rect.height / 2;
      schedule();
    };
    const onScroll = () => { scrollY = window.scrollY; schedule(); };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    visual.addEventListener("touchstart", onTouchStart, { passive: true });
    visual.addEventListener("touchmove", onTouchMove, { passive: true });
    visual.addEventListener("touchend", onTouchEnd, { passive: true });
    visual.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      visual.removeEventListener("touchstart", onTouchStart);
      visual.removeEventListener("touchmove", onTouchMove);
      visual.removeEventListener("touchend", onTouchEnd);
      visual.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

function useCountUp(target: number, duration = 1250) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>(".case-section");
    if (!trigger) return;
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(trigger);
    return () => { observer.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, [target, duration]);
  return new Intl.NumberFormat("ru-RU").format(value);
}

function useServiceTilt() {
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".service-card"));
    const cleanups = cards.map((card) => {
      const move = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${(y * -5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
        card.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
      };
      const reset = () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      };
      card.addEventListener("pointermove", move, { passive: true });
      card.addEventListener("pointerleave", reset, { passive: true });
      return () => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", reset);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
}

function SectionHeading({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? "section-heading--light" : ""}`}>
      <div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Logo() {
  return <a className="logo" href="#top" aria-label="maxima consulting — наверх"><span className="logo-mark">m</span><span>maxima <b>consulting</b></span></a>;
}

function MagneticButton({ children, href = "#contact", secondary = false }: { children: React.ReactNode; href?: string; secondary?: boolean }) {
  return <a className={`button ${secondary ? "button--secondary" : ""}`} href={href}>{children}<ArrowUpRight size={16} /></a>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  useScrollReveal();
  useHeroParallax();
  useServiceTilt();
  const animatedSavings = useCountUp(3429410);
  const [selectedService, setSelectedService] = useState(1);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site-shell" id="top">
      <div className="ambient ambient--one" /><div className="ambient ambient--two" />
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`}>
            {["Проблемы", "Услуги", "Кейсы", "Как работаем"].map((item, i) => <button key={item} onClick={() => scrollTo(["#problems", "#services", "#case", "#process"][i])}>{item}</button>)}
            <MagneticButton href="#contact">Записаться на разбор</MagneticButton>
          </nav>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy reveal">
            <div className="status-pill"><span /> НДС-2026 уже считает вас плательщиком</div>
            <h1>Выручка растёт — <em>а ясности</em> в деньгах не прибавляется</h1>
            <p className="hero-lead">Внешний финансовый директор для МСБ <strong>5–990 млн ₽</strong>: от НДС-аудита и управленческого учёта до финмодели и cash flow — без штатной должности.</p>
            <div className="hero-actions"><MagneticButton>Записаться на разбор</MagneticButton><a className="text-link" href="#services">Посмотреть услуги <MoveRight size={17} /></a></div>
            <div className="hero-footnote"><LockKeyhole size={14} /> NDA до передачи финансовых данных</div>
          </div>
          <div className="hero-visual hero-parallax reveal reveal--delay">
            <div className="visual-grid" />
            <div className="visual-ring visual-ring--one" /><div className="visual-ring visual-ring--two" />
            <div className="metric-card metric-card--top"><span>последний результат</span><strong>3 429 410 ₽</strong><small>экономия в год для торговой компании</small></div>
            <div className="metric-card metric-card--bottom"><div className="metric-icon"><ArrowUpRight size={18} /></div><span>за 5 рабочих дней</span><strong>− 22% налоговой нагрузки</strong></div>
            <div className="orbit-label">cash flow <span>↗</span></div>
            <div className="hero-graph"><div className="graph-bars"><i /><i /><i /><i /><i /><i /><i /></div><svg viewBox="0 0 390 150" preserveAspectRatio="none"><path d="M0,124 C28,119 37,97 63,101 S103,125 129,91 S165,54 188,73 S227,98 252,62 S285,47 310,37 S348,55 390,9" fill="none" stroke="currentColor" strokeWidth="3" /></svg><div className="graph-axis"><span>янв</span><span>мар</span><span>май</span><span>июль</span><span>сен</span></div></div>
          </div>
        </section>

        <section className="ticker"><div className="ticker-track">НДС-АУДИТ <span>✳</span> ФИНМОДЕЛЬ <span>✳</span> CASH FLOW <span>✳</span> УПРАВЛЕНЧЕСКИЙ УЧЁТ <span>✳</span> НДС-АУДИТ <span>✳</span> ФИНМОДЕЛЬ <span>✳</span></div></section>

        <section className="section container problems scroll-reveal" id="problems">
          <SectionHeading eyebrow="Знакомо?" title="Деньги в бизнесе есть. Но управлять ими — сложно." text="Проблемы, которые выглядят как «так бывает», но на самом деле решаются цифрами." />
          <div className="problem-grid">{painPoints.map((item) => <article className={`problem-card problem-card--${item.tone} scroll-reveal scroll-reveal--card`} key={item.number}><div className="card-top"><span>{item.number}</span><ArrowDownRight size={20} /></div><h3>{item.title}</h3><p>{item.text}</p><div className="result"><Check size={14} /> <span>{item.result}</span></div></article>)}</div>
          <div className="section-cta"><span>Узнали себя хотя бы в одном блоке?</span><a href="#contact">Давайте разберёмся <ArrowUpRight size={16} /></a></div>
        </section>

        <section className="signal-section scroll-reveal"><div className="container signal-inner"><div><div className="eyebrow"><span className="eyebrow-dot" />Важный сигнал</div><h2>Порог НДС заморожен на уровне <em>20 млн</em> до 2029 года</h2></div><div className="signal-note"><div className="signal-number">20<span>млн ₽</span></div><p>Если выручка растёт и вы приближаетесь к порогу — лучше подготовиться заранее, чем терять маржу в момент перехода.</p><a href="#contact">Разобрать вашу ситуацию <ArrowUpRight size={16} /></a></div></div></section>

        <section className="section container difference scroll-reveal"><SectionHeading eyebrow="maxima consulting" title="Между бухгалтерским аутсорсом и корпоративным CFO" text="Не просто отчётность. Не «совет на словах». Партнёр, который помогает собственнику видеть бизнес целиком." /><div className="difference-grid"><div className="difference-intro"><div className="big-number">01—<br /><span>04</span></div><p>Каждый проект заканчивается конкретным документом: модель + план действий + карта рисков.</p></div><div className="difference-list">{[[FileText, "Документ, не разговор", "Модель и план действий вместо пересказа теории."], [Zap, "НДС-аудит за 3–5 дней", "Современные инструменты ускоряют анализ без потери глубины."], [MessageCircle, "Партнёр, не подрядчик", "Объясняю логику каждого решения — вы понимаете свои финансы."], [Target, "Фокус на МСБ 5–990 млн ₽", "Не работаю с крупными корпорациями и госструктурами."]].map(([Icon, title, text], i) => { const I = Icon as typeof FileText; return <div className="difference-item" key={title as string}><span className="difference-index">0{i + 1}</span><I size={20} /><div><h3>{title as string}</h3><p>{text as string}</p></div></div>; })}</div></div></section>

        <section className="section container services scroll-reveal" id="services"><SectionHeading eyebrow="Услуги и цены" title="Три уровня вовлечённости" text="От разовой диагностики до постоянной поддержки — выберите глубину, с которой готовы зайти в цифры." /><div className="services-grid">{services.map((service, i) => <article className={`service-card ${i === 1 ? "service-card--featured" : ""} scroll-reveal scroll-reveal--card`} key={service.label}><div className="service-label">{service.label} <span>{i === 1 ? "самый популярный" : ""}</span></div><h3>{service.name}</h3><p>{service.description}</p><div className="service-items">{service.items.map(([name, price, time]) => <div className="service-item" key={name}><span>{name}</span><strong>{price}</strong><small>{time}</small></div>)}</div><a href="#contact" className="service-link">Обсудить задачу <ArrowUpRight size={15} /></a></article>)}</div><div className="services-footer"><span>Не знаете, с чего начать?</span><a href={telegramUrl} target="_blank" rel="noreferrer">Первичный разбор — бесплатно <CircleArrowOutUpRight size={16} /></a></div></section>

        <section className="process-section scroll-reveal" id="process"><div className="container"><SectionHeading light eyebrow="Как мы работаем" title="Четыре шага — от первого звонка до результата в руках" /><div className="process-grid">{[["01", "Бесплатный разбор", "30 мин", "Zoom, Яндекс Телемост или Telegram. Разбираем ситуацию, понимаем задачу. Никакого давления."], ["02", "Предложение и договор", "NDA", "Фиксируем объём, сроки, цену. Подписываем соглашение о конфиденциальности до передачи данных."], ["03", "Работа", "онлайн", "Сбор данных, анализ, подготовка документов. Онлайн-чат для вопросов."], ["04", "Результат и разбор", "PDF", "Презентую выводы и объясняю логику. Вы уходите с документом и планом действий."]].map(([num, title, tag, text]) => <div className="process-step scroll-reveal scroll-reveal--card" key={num}><div className="process-num">{num}</div><div className="process-tag">{tag}</div><h3>{title}</h3><p>{text}</p>{num !== "04" && <div className="process-line" />}</div>)}</div></div></section>

        <section className="section container case-section scroll-reveal" id="case"><div className="case-header"><SectionHeading eyebrow="Кейс / НДС-аудит" title="Как мы сэкономили 3,4 млн ₽ на НДС" text="Реальный проект, реальные цифры — без красивых обещаний." /><div className="case-result"><span>итог проекта</span><strong>{animatedSavings} ₽</strong><small>экономия в год</small></div></div><div className="case-grid"><div className="case-visual"><div className="case-chart-label">налоговая нагрузка</div><div className="case-chart"><div className="case-bar"><span>было</span><i className="chart-fill chart-fill--high" style={{ height: "86%" }} /><b>22%</b></div><div className="case-bar case-bar--accent"><span>стало</span><i className="chart-fill chart-fill--low" style={{ height: "46%" }} /><b>12%</b></div></div><div className="case-chart-foot"><span>до оптимизации</span><span>после сценарного анализа</span></div></div><div className="case-copy"><div className="case-block"><span>Ситуация</span><p>Торговая компания, выручка 87,4 млн ₽. В начале 2025 года обязана перейти на НДС. Непонятно, какую ставку выбрать и как это скажется на марже.</p></div><div className="case-block"><span>Что сделали</span><p>Рассчитали три сценария: ставка 22% с вычетами, 5% и 7% без вычетов. Проанализировали клиентскую базу: 40% — неплательщики НДС.</p></div><div className="case-block"><span>Итог</span><p>Выбрана оптимальная ставка. Составлена дорожная карта перехода с минимальными потерями для бизнеса.</p></div></div></div><div className="case-foot"><span><Check size={15} /> 5 рабочих дней</span><span><Check size={15} /> Карта рисков</span><span><Check size={15} /> Расчёт сценариев</span><span><Check size={15} /> Дорожная карта</span></div></section>

        <section className="testimonial-section scroll-reveal"><div className="container"><SectionHeading light eyebrow="Что говорят клиенты" title="Реальные результаты собственников МСБ" /><div className="quote-grid"><blockquote><span className="quote-mark">“</span><p>При выручке 87 млн не понимал, какую ставку НДС выбрать. Получил три сценария с цифрами — принял решение за один день.</p><footer><strong>А. К.</strong><span>собственник, оптовая торговля</span></footer><b className="quote-result">3 429 410 ₽ <small>экономии в год</small></b></blockquote><blockquote><span className="quote-mark">“</span><p>Думал, что маржа 18%, оказалось 9% на двух ключевых клиентах. Пересмотрел условия — объём не потеряли.</p><footer><strong>Е. Р.</strong><span>собственник, логистика, 35 млн</span></footer><b className="quote-result">+9 п.п. <small>маржа</small></b></blockquote><blockquote><span className="quote-mark">“</span><p>Бухгалтер сдаёт отчётность, но управленческой картины не было. За неделю получил P&L и cash flow.</p><footer><strong>И. П.</strong><span>собственник, производство, 45 млн</span></footer><b className="quote-result">7 дней <small>до результата</small></b></blockquote></div></div></section>

        <section className="section container fit-section"><div className="fit-grid"><div><SectionHeading eyebrow="Подходим ли мы друг другу?" title="Работаю не со всеми — и это осознанный выбор" /></div><div className="fit-columns"><div className="fit-column fit-column--yes"><h3><Check size={18} /> Подходит вам, если:</h3>{["Выручка 5–990 млн, ИП или ООО", "Есть бухгалтер, но нет управленческой картины", "Надоело принимать решения на ощущениях", "Приближаетесь к порогу НДС или уже перешли", "Нужен документ с цифрами, а не консультация «на словах»"].map(item => <p key={item}><span />{item}</p>)}</div><div className="fit-column fit-column--no"><h3><Minus size={18} /> Не подхожу, если:</h3>{["Нужен штатный бухгалтер или сдача отчётности", "Выручка свыше 990 млн ₽", "Крупная корпорация или госструктура", "Ищете «волшебную схему» без цифр и документов"].map(item => <p key={item}><span />{item}</p>)}</div></div></div></section>

        <section className="founder-section scroll-reveal"><div className="container founder-grid"><div className="founder-portrait"><div className="portrait-glow" /><div className="portrait-initials">МЗ</div><div className="portrait-caption">25 лет<br /><span>в бизнесе</span></div></div><div className="founder-copy"><div className="eyebrow"><span className="eyebrow-dot" />Основатель maxima consulting</div><h2>Привет, я <em>Максим Зугров</em></h2><p>Финансовый директор с 25-летним опытом в бизнесе. Специализация: управленческий учёт, НДС-2026, cash flow, финансовые модели. Работаю с МСБ 5–990 млн ₽.</p><blockquote>Каждый проект заканчивается конкретным документом — не разговором.</blockquote><div className="founder-meta"><span><ShieldCheck size={16} /> Работаю онлайн по всей России</span><span><Sparkles size={16} /> Первый разбор бесплатно</span></div></div></div></section>

        <section className="section container faq-section scroll-reveal"><SectionHeading eyebrow="FAQ" title="Отвечаю на то, что спрашивают чаще всего" /><div className="faq-list">{faqs.map(([question, answer], i) => <div className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`} key={question}><button aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{question}</span>{openFaq === i ? <Minus size={18} /> : <Plus size={18} />}</button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></section>

        <section className="contact-section scroll-reveal" id="contact"><div className="container contact-grid"><div className="contact-copy"><div className="eyebrow"><span className="eyebrow-dot" />Следующий шаг</div><h2>Начните с <em>бесплатного</em> разбора</h2><p>30 минут. Разберём вашу ситуацию. Без обязательств.</p><ul><li><Check size={16} /> Zoom, Яндекс Телемост или Telegram — на ваш выбор</li><li><Check size={16} /> Первые рекомендации уже на звонке</li><li><Check size={16} /> Никакого давления и навязчивых продаж</li><li><Check size={16} /> NDA подписываем до передачи данных</li></ul><div className="contact-direct"><span>Или напишите напрямую</span><a href="tel:+79808488480">+7 980 848-84-80</a><a href={telegramUrl} target="_blank" rel="noreferrer">@maxima_consulting_leed_bot <CircleArrowOutUpRight size={14} /></a></div></div><form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}><div className="form-top"><span>бесплатный разбор · 30 мин</span><span>обычно отвечаю в течение нескольких часов</span></div>{submitted ? <div className="form-success"><div><Check size={24} /></div><h3>Заявка принята</h3><p>Спасибо. Я свяжусь с вами в течение рабочего дня.</p><button type="button" onClick={() => setSubmitted(false)}>Отправить ещё одну</button></div> : <><label>Ваше имя <input required placeholder="Как к вам обращаться?" /></label><label>Телефон или Telegram <input required placeholder="+7 или @username" /></label><div className="form-row"><label>Роль в компании <select defaultValue=""><option value="" disabled>Выберите</option><option>Собственник</option><option>Генеральный директор</option><option>Финансовый директор</option><option>Операционный директор</option><option>Другое</option></select></label><label>Диапазон выручки <select defaultValue=""><option value="" disabled>Выберите</option><option>до 20 млн ₽</option><option>20–60 млн ₽</option><option>60–150 млн ₽</option><option>150–500 млн ₽</option><option>свыше 500 млн ₽</option></select></label></div><label>Главный вопрос <textarea placeholder="Что сейчас беспокоит в финансах бизнеса?" rows={3} /></label><label className="checkbox-label"><input type="checkbox" required /><span>Согласен(на) на обработку персональных данных в соответствии с политикой обработки</span></label><button className="button button--form" type="submit">Записаться на разбор <ArrowUpRight size={17} /></button><small className="form-note">Не продаём данные. Не спамим. Ответим в течение рабочего дня.</small></>}</form></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p>Финансовый партнёр для МСБ</p></div><div><span className="footer-label">Навигация</span><a href="#problems">Проблемы</a><a href="#services">Услуги и цены</a><a href="#case">Кейсы</a><a href="#contact">Контакты</a></div><div><span className="footer-label">Контакты</span><a href="tel:+79808488480">+7 980 848-84-80</a><a href={telegramUrl}>Telegram</a><a href="https://vk.com/maxima_consulting">VK</a><a href="https://m.tenchat.ru/u/eei8UmQE">TenChat</a></div><div className="footer-social"><span className="footer-label">maxima consulting</span><div><a href="https://vk.com/maxima_consulting" aria-label="VK"><Linkedin size={18} /></a><a href={telegramUrl} aria-label="Telegram"><MessageCircle size={18} /></a><a href="#top" aria-label="Наверх"><ArrowUpRight size={18} /></a></div></div></div><div className="container footer-bottom"><span>© maxima consulting, 2026</span><span>NDA · Политика ПД</span><span>made with numbers <span className="footer-heart">✳</span></span></div></footer>
    </div>
  );
}
