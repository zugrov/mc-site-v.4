import { CSSProperties, FormEvent, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  FileCheck2,
  Layers3,
  LockKeyhole,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

const painPoints = [
  "Выручка растёт, а свободных денег на счёте не прибавляется",
  "Отчёты есть, но непонятно, на какие решения они опираются",
  "Прибыль по документам не совпадает с ощущением от кассы",
  "Непонятно, какое направление приносит доход, а какое съедает маржу",
  "Решения о ценах, найме или закупках принимаются на глаз",
];

const processSteps = [
  {
    day: "01—02",
    title: "Сбор данных",
    description:
      "Вы передаёте доступные выгрузки: отчётность, банковские выписки, учётные данные. Список того, что понадобится, высылаем сразу после заявки.",
    icon: Database,
  },
  {
    day: "03—04",
    title: "Сборка картины",
    description:
      "Строим управленческую картину прибыли и движения денег. Там, где данных не хватает, фиксируем это отдельно — без домыслов.",
    icon: BarChart3,
  },
  {
    day: "05",
    title: "Поиск причин",
    description:
      "Сопоставляем прибыль и деньги, находим разрывы между бумажным результатом и фактическим движением средств.",
    icon: Target,
  },
  {
    day: "06",
    title: "Memo и roadmap",
    description:
      "Готовим короткий документ: картина по прибыли и деньгам, 3–5 приоритетных вопросов и предлагаемые следующие шаги.",
    icon: FileCheck2,
  },
  {
    day: "07",
    title: "Встреча с разбором",
    description:
      "Разбираем memo вместе, отвечаем на вопросы и обсуждаем, что имеет смысл делать дальше — с диагностикой или без неё.",
    icon: MessageCircle,
  },
];

const faqItems = [
  {
    question: "Это проверка по стандартам аудита?",
    answer:
      "Нет. Диагностика — управленческий инструмент: она показывает картину прибыли и денег для принятия решений, а не формирует заключение по стандартам аудиторской деятельности.",
  },
  {
    question: "Какие данные нужны от меня?",
    answer:
      "Список зависит от вашей учётной системы; типично — управленческая или бухгалтерская отчётность за последние периоды и доступ к банковским выпискам. Точный список пришлём после заявки.",
  },
  {
    question: "Что если данных не хватает?",
    answer:
      "Мы отметим такие зоны в memo как ограничения анализа, а не будем додумывать цифры. Вы увидите не только выводы, но и степень их надёжности.",
  },
  {
    question: "Сколько это стоит?",
    answer:
      "Диагностика — от 20 000 ₽ в зависимости от объёма бизнеса и состояния данных. Точную стоимость подтверждаем после короткого звонка.",
  },
  {
    question: "Что будет после диагностики?",
    answer:
      "Вы получаете memo и roadmap. Дальше — на ваш выбор: внедрять решения самостоятельно, заказать постановку управленческого учёта или перейти к формату CFO-light.",
  },
  {
    question: "Подходит ли это моему бизнесу?",
    answer:
      "Формат ориентирован на собственников торговых, e-commerce, производственных компаний и компаний услуг с действующей выручкой. Если у вас стартап без выручки или крупный холдинг — напишите нам, подберём подходящий формат отдельно.",
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function MiniChart() {
  return (
    <div className="mini-chart" aria-label="Пример динамики денежных потоков">
      <div className="mini-chart__topline">
        <span>Движение денег</span>
        <span className="mini-chart__range">последние 6 мес.</span>
      </div>
      <svg viewBox="0 0 520 176" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7f36b" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#d7f36b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a6d93d" />
            <stop offset="100%" stopColor="#f0ff9a" />
          </linearGradient>
        </defs>
        {[28, 70, 112, 154].map((y) => (
          <line key={y} x1="0" x2="520" y1={y} y2={y} stroke="rgba(236,240,224,0.1)" />
        ))}
        <path
          d="M0 133 C40 126 58 141 94 119 S144 86 176 102 S229 113 260 72 S310 84 342 54 S401 38 428 61 S478 35 520 24 L520 176 L0 176 Z"
          fill="url(#chartFill)"
        />
        <path
          d="M0 133 C40 126 58 141 94 119 S144 86 176 102 S229 113 260 72 S310 84 342 54 S401 38 428 61 S478 35 520 24"
          fill="none"
          stroke="url(#chartLine)"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <circle cx="520" cy="24" r="5" fill="#e9ff86" />
        <circle cx="520" cy="24" r="11" fill="none" stroke="#e9ff86" strokeOpacity="0.22" />
      </svg>
      <div className="mini-chart__labels"><span>май</span><span>июнь</span><span>июль</span><span>авг.</span><span>сент.</span><span>окт.</span></div>
    </div>
  );
}

const diagnosticChartData = {
  profit: {
    label: "Операционная прибыль",
    value: "+18,6%",
    subtitle: "рост к прошлому периоду",
    color: "#d7f36b",
    points: "0,126 68,118 136,129 204,94 272,105 340,62 408,72 476,38 520,28",
    bars: [48, 56, 51, 63, 72, 82, 91],
  },
  cash: {
    label: "Свободные деньги",
    value: "₽ 4,82M",
    subtitle: "остаток на конец периода",
    color: "#a7d66a",
    points: "0,114 68,101 136,115 204,78 272,91 340,54 408,61 476,46 520,34",
    bars: [40, 45, 42, 58, 61, 70, 78],
  },
  margin: {
    label: "Средняя маржа",
    value: "32,4%",
    subtitle: "после разбивки направлений",
    color: "#eef9b6",
    points: "0,138 68,127 136,108 204,112 272,84 340,92 408,64 476,57 520,42",
    bars: [36, 48, 60, 54, 68, 74, 86],
  },
} as const;

function DiagnosticCharts() {
  const [activeMetric, setActiveMetric] = useState<keyof typeof diagnosticChartData>("profit");
  const active = diagnosticChartData[activeMetric];

  return (
    <section className="section charts-section" id="charts">
      <div className="container">
        <div className="section-intro section-intro--split reveal">
          <div><span className="section-index">03 / visual model</span><h2>Смотрим<br />не на цифры, а на <em>связи</em></h2></div>
          <div className="section-intro__aside"><p>Интерактивная модель показывает, как мы собираем разрозненные данные в одну картину для собственника.</p><span className="accent-line" /></div>
        </div>
        <div className="charts-dashboard reveal reveal--delay-1">
          <div className="charts-dashboard__top">
            <div><span className="section-index">LIVE MODEL / 07 DAYS</span><h3>Финансовый контур</h3></div>
            <div className="chart-tabs" role="tablist" aria-label="Показатель графика">
              {(Object.keys(diagnosticChartData) as Array<keyof typeof diagnosticChartData>).map((key) => (
                <button key={key} className={activeMetric === key ? "is-active" : ""} type="button" role="tab" aria-selected={activeMetric === key} onClick={() => setActiveMetric(key)}>{key === "profit" ? "Прибыль" : key === "cash" ? "Деньги" : "Маржа"}</button>
              ))}
            </div>
          </div>
          <div className="charts-dashboard__grid">
            <div className="line-chart-card">
              <div className="line-chart-card__metric"><div><span>{active.label}</span><strong>{active.value}</strong></div><small><TrendingUp size={13} /> {active.subtitle}</small></div>
              <svg className="diagnostic-line-chart" viewBox="0 0 520 176" role="img" aria-label={`${active.label}: ${active.value}`}>
                <defs><linearGradient id="diagnosticFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={active.color} stopOpacity=".25" /><stop offset="100%" stopColor={active.color} stopOpacity="0" /></linearGradient></defs>
                {[28, 70, 112, 154].map((y) => <line key={y} x1="0" x2="520" y1={y} y2={y} stroke="rgba(236,240,224,0.1)" />)}
                <polyline points={`${active.points} 520,176 0,176`} fill="url(#diagnosticFill)" stroke="none" />
                <polyline points={active.points} fill="none" stroke={active.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                <circle cx="520" cy={activeMetric === "profit" ? "28" : activeMetric === "cash" ? "34" : "42"} r="5" fill={active.color} />
              </svg>
              <div className="chart-axis"><span>май</span><span>июнь</span><span>июль</span><span>авг.</span><span>сент.</span><span>окт.</span></div>
            </div>
            <div className="composition-card">
              <div className="composition-card__header"><span>Состав результата</span><span className="composition-card__period">октябрь</span></div>
              <div className="composition-visual"><div className="composition-donut"><div><strong>100%</strong><span>картина</span></div></div><div className="composition-legend"><span><i className="composition-dot composition-dot--lime" /> Основное направление <b>54%</b></span><span><i className="composition-dot composition-dot--olive" /> Доп. направление <b>28%</b></span><span><i className="composition-dot composition-dot--pale" /> Прочее <b>18%</b></span></div></div>
              <div className="composition-foot"><span>После диагностики</span><strong>3 зоны внимания</strong><ArrowUpRight size={16} /></div>
            </div>
          </div>
          <div className="bar-strip"><div><span className="bar-strip__label">Динамика по периодам</span><small>рост / снижение</small></div><div className="bar-strip__bars">{active.bars.map((height, index) => <span key={`${activeMetric}-${index}`} style={{ height: `${height}%`, background: index === active.bars.length - 1 ? active.color : "rgba(215,243,107,.28)" }} />)}</div><div className="bar-strip__result"><strong>{activeMetric === "profit" ? "+18,6%" : activeMetric === "cash" ? "+12,2%" : "+7,4 п.п."}</strong><small>за 6 месяцев</small></div></div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const closeMenuAndScroll = (id: string) => {
    setIsMenuOpen(false);
    window.setTimeout(() => scrollToId(id), 80);
  };

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className={`site-header ${isMenuOpen ? "site-header--open" : ""}`}>
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Maxima Consulting — на главную">
            <span className="brand-mark"><span /></span>
            <span className="brand-wordmark">maxima<span>consulting</span></span>
          </a>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#process">Как работаем</a>
            <a href="#charts">В цифрах</a>
            <a href="#trust">Почему мы</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="header-actions">
            <a className="header-phone" href="tel:+79808488480">+7 980 848-84-80</a>
            <button className="button button--small button--outline" type="button" onClick={() => scrollToId("request")}>
              Разобрать цифры <ArrowUpRight size={16} />
            </button>
            <button className="menu-toggle" type="button" aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setIsMenuOpen((open) => !open)}>
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mobile-nav" aria-label="Мобильная навигация">
            <a href="#process" onClick={() => closeMenuAndScroll("process")}>Как работаем <ChevronRight size={16} /></a>
            <a href="#charts" onClick={() => closeMenuAndScroll("charts")}>В цифрах <ChevronRight size={16} /></a>
            <a href="#trust" onClick={() => closeMenuAndScroll("trust")}>Почему мы <ChevronRight size={16} /></a>
            <a href="#faq" onClick={() => closeMenuAndScroll("faq")}>FAQ <ChevronRight size={16} /></a>
            <button className="button button--lime" type="button" onClick={() => closeMenuAndScroll("request")}>Разобрать цифры <ArrowUpRight size={16} /></button>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero section-grid">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-dot" /> Управленческая диагностика <span className="eyebrow-divider" /> 7 дней</div>
              <h1>Финансовая диагностика <em>за 7 дней</em></h1>
              <p className="hero-lead">Прибыль, деньги, риски и приоритеты — в одном понятном отчёте для собственника.</p>
              <div className="hero-actions">
                <button className="button button--lime button--large" type="button" onClick={() => scrollToId("request")}>Разобрать цифры <ArrowUpRight size={18} /></button>
                <button className="text-link" type="button" onClick={() => scrollToId("process")}>Как проходит диагностика <ArrowDown size={16} /></button>
              </div>
              <div className="hero-footnote"><ShieldCheck size={16} /> NDA до начала работы <span /> Без лишнего запроса данных</div>
            </div>
            <div className="hero-visual reveal reveal--delay-2" aria-label="Визуализация финансовой диагностики">
              <div className="visual-orbit visual-orbit--one" />
              <div className="visual-orbit visual-orbit--two" />
              <div className="dashboard-card">
                <div className="dashboard-card__header"><span className="card-kicker">DIAGNOSTIC / 07</span><span className="live-pill"><i /> live</span></div>
                <div className="dashboard-title">Финансовый<br /><strong>контур бизнеса</strong></div>
                <div className="dashboard-metrics">
                  <div><span>Опер. прибыль</span><strong>+18,6%</strong><small><TrendingUp size={12} /> к прошлому периоду</small></div>
                  <div><span>Свободные деньги</span><strong>₽ 4,82M</strong><small className="muted"><Clock3 size={12} /> на 14 окт.</small></div>
                </div>
                <MiniChart />
                <div className="dashboard-card__footer"><span><span className="legend-dot legend-dot--lime" /> прибыль</span><span><span className="legend-dot legend-dot--white" /> движение денег</span><span className="footer-arrow"><ArrowUpRight size={16} /></span></div>
              </div>
              <div className="floating-note floating-note--top"><CircleDollarSign size={16} /><span><b>₽ 87,4 млн</b><small>выручка в кейсе</small></span></div>
              <div className="floating-note floating-note--bottom"><span className="mini-check"><Check size={13} /></span><span><b>3 приоритета</b><small>для решения</small></span></div>
              <div className="hero-vertical-label">MAXIMA / FINANCE CLARITY</div>
            </div>
          </div>
          <div className="hero-scroll"><span>scroll to explore</span><i /></div>
        </section>

        <section className="section section--ink" id="pain">
          <div className="container">
            <div className="section-intro section-intro--split reveal">
              <div><span className="section-index">01 / signal</span><h2>Знакомая<br /><em>ситуация?</em></h2></div>
              <div className="section-intro__aside"><p>Это не значит, что в бизнесе что-то сломано. Чаще всего просто не хватает единой финансовой картины для управленческих решений.</p><span className="accent-line" /></div>
            </div>
            <div className="pain-grid">
              {painPoints.map((point, index) => (
                <article className={`pain-card reveal reveal--delay-${(index % 3) + 1}`} key={point}>
                  <span className="pain-number">0{index + 1}</span>
                  <p>{point}</p>
                  <span className="pain-corner"><ArrowUpRight size={16} /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="container">
            <div className="section-intro section-intro--split reveal">
              <div><span className="section-index">02 / process</span><h2>От данных<br />до <em>решений</em></h2></div>
              <div className="section-intro__aside"><p>Отчёт, memo и встреча с разбором — за 7 рабочих дней. Вы понимаете не только «что», но и «почему».</p><div className="time-stamp"><span>7</span><small>рабочих<br />дней</small></div></div>
            </div>
            <div className="process-list">
              {processSteps.map(({ day, title, description, icon: Icon }, index) => (
                <article className="process-row reveal" key={title} style={{ "--row-delay": `${index * 70}ms` } as CSSProperties}>
                  <div className="process-row__day"><span>дни</span><strong>{day}</strong></div>
                  <div className="process-row__icon"><Icon size={22} strokeWidth={1.5} /></div>
                  <div className="process-row__body"><h3>{title}</h3><p>{description}</p></div>
                  <span className="process-row__arrow"><ArrowUpRight size={19} /></span>
                </article>
              ))}
            </div>
            <p className="section-note"><span>*</span> Срок 7 дней — при своевременном предоставлении данных с вашей стороны.</p>
          </div>
        </section>

        <DiagnosticCharts />

        <section className="section trust-section" id="trust">
          <div className="container">
            <div className="section-intro section-intro--split reveal">
              <div><span className="section-index">04 / confidence</span><h2>Результат,<br />которому <em>можно</em><br />доверять</h2></div>
              <div className="section-intro__aside"><p>Не обещаем магию. Делаем понятный управленческий инструмент, на который можно опереться в следующий понедельник.</p></div>
            </div>
            <div className="trust-grid">
              <article className="trust-card trust-card--lime reveal"><div className="trust-card__icon"><LockKeyhole size={22} /></div><span className="trust-card__index">01</span><h3>Формат работы<br /><strong>по NDA</strong></h3><p>Данные бизнеса не передаются третьим лицам. Соглашение о конфиденциальности подписывается до начала работы.</p><a href="#request" onClick={(event) => { event.preventDefault(); scrollToId("request"); }}>Обсудить условия <ArrowUpRight size={15} /></a></article>
              <article className="trust-card trust-card--dark reveal reveal--delay-1"><div className="trust-card__icon"><WalletCards size={22} /></div><span className="trust-card__index">02</span><h3>Управленческий<br /><strong>инструмент</strong></h3><p>Диагностика — не замена бухгалтерии. Мы работаем с управленческой, а не с налоговой отчётностью.</p><div className="trust-card__seal"><span>MSB</span><small>FOCUS<br />2026</small></div></article>
              <article className="memo-card reveal reveal--delay-2"><div className="memo-card__top"><span className="section-index">MEMO / SAMPLE</span><span className="memo-card__dots">•••</span></div><div className="memo-card__title">Что будет<br /><em>внутри</em></div><ul><li><Check size={15} /> Картина прибыли и денег</li><li><Check size={15} /> 3–5 приоритетных вопросов</li><li><Check size={15} /> Разрывы и причины</li><li><Check size={15} /> Ограничения анализа</li><li><Check size={15} /> Следующие шаги</li></ul><div className="memo-card__line" /><div className="memo-card__caption">Обезличенный пример структуры документа</div></article>
            </div>
          </div>
        </section>

        <section className="section case-section">
          <div className="container">
            <div className="case-box reveal">
              <div className="case-box__side"><span className="section-index">05 / case study</span><div className="case-tag"><Sparkles size={15} /> обезличенные данные</div><p>Торговая компания</p></div>
              <div className="case-box__main"><div className="case-number">87,4<span>млн ₽</span></div><h2>Когда цифры перестают быть шумом — появляется <em>решение.</em></h2><p>Собственник не понимал, какое направление приносит маржу. По итогам диагностики получил memo с разбивкой по направлениям и три приоритетных шага — решение о пересмотре ассортимента принято за один день.</p><div className="case-outcome"><span><strong>3</strong> приоритетных шага</span><span><strong>1</strong> день до решения</span><span><strong>0</strong> лишних таблиц</span></div></div>
            </div>
            <p className="legal-note">Диагностика не является проверкой в значении федерального закона об аудиторской деятельности и не заменяет бухгалтерский учёт.</p>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="container faq-layout">
            <div className="faq-heading reveal"><span className="section-index">06 / answers</span><h2>Частые<br /><em>вопросы</em></h2><p>Если не нашли ответ — напишите нам. Ответим в течение рабочего дня.</p><a className="text-link" href="https://t.me/maxima_consulting_leed_bot?start=diag_s1" target="_blank" rel="noreferrer">Задать вопрос в Telegram <ArrowUpRight size={16} /></a></div>
            <div className="faq-list reveal reveal--delay-1">{faqItems.map((item, index) => { const isOpen = activeFaq === index; return <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`} key={item.question}><button type="button" onClick={() => setActiveFaq(isOpen ? null : index)} aria-expanded={isOpen}><span><small>0{index + 1}</small>{item.question}</span><ChevronDown size={19} /></button><div className="faq-answer"><p>{item.answer}</p></div></div>; })}</div>
          </div>
        </section>

        <section className="section request-section" id="request">
          <div className="container request-layout">
            <div className="request-copy reveal"><span className="section-index">07 / next step</span><h2>Разберём<br />цифры <em>вместе</em></h2><p>Оставьте заявку — ответим в течение рабочего дня, без обязательств на этом шаге.</p><div className="request-contact"><a href="tel:+79808488480"><span className="contact-icon"><Phone size={17} /></span><span><small>Позвонить</small>+7 980 848-84-80</span></a><a href="https://t.me/maxima_consulting_leed_bot?start=diag_s1" target="_blank" rel="noreferrer"><span className="contact-icon"><MessageCircle size={17} /></span><span><small>Написать в Telegram</small>@maxima_consulting_leed_bot</span></a></div></div>
            <div className="form-card reveal reveal--delay-1">{submitted ? <div className="form-success"><span className="success-icon"><Check size={28} /></span><h3>Заявка принята</h3><p>Спасибо. Мы ответим в течение рабочего дня и пришлём список необходимых данных.</p><button className="text-link" type="button" onClick={() => setSubmitted(false)}>Отправить ещё одну заявку <ArrowUpRight size={15} /></button></div> : <form onSubmit={handleSubmit}><div className="form-card__top"><span>APPLICATION / 01</span><span><i className="form-status" /> secure</span></div><div className="form-grid"><label><span>Ваше имя <b>*</b></span><input name="name" placeholder="Как к вам обращаться" required /></label><label><span>Телефон или Telegram <b>*</b></span><input name="contact" placeholder="+7 ... / @username" required /></label><label><span>Ваша роль <b>*</b></span><select name="role" defaultValue="" required><option value="" disabled>Выберите роль</option><option>Собственник</option><option>Генеральный директор</option><option>Финансовый директор</option><option>Операционный директор</option><option>Другое</option></select></label><label><span>Отрасль <b>*</b></span><select name="industry" defaultValue="" required><option value="" disabled>Выберите отрасль</option><option>Торговля / опт-розница</option><option>E-commerce / маркетплейсы</option><option>Производство</option><option>Услуги</option><option>Строительство</option><option>Другое</option></select></label><label><span>Диапазон годовой выручки <b>*</b></span><select name="revenue" defaultValue="" required><option value="" disabled>Выберите диапазон</option><option>до 20 млн ₽</option><option>20–60 млн ₽</option><option>60–150 млн ₽</option><option>150–500 млн ₽</option><option>свыше 500 млн ₽</option><option>затрудняюсь ответить</option></select></label><label><span>Срочность <b>*</b></span><select name="urgency" defaultValue="" required><option value="" disabled>Выберите вариант</option><option>Срочно — решение на этой неделе</option><option>В течение месяца</option><option>Не срочно</option><option>Изучаю рынок</option></select></label><label className="form-full"><span>Главный вопрос <b>*</b></span><textarea name="question" placeholder="Что сейчас больше всего мешает принимать решения?" required /></label></div><label className="consent"><input type="checkbox" required /><span className="checkbox-ui"><Check size={12} /></span><span>Согласен(на) на обработку персональных данных в соответствии с <a href="#privacy">Политикой обработки персональных данных</a> <b>*</b></span></label><button className="button button--lime button--submit" type="submit">Разобрать цифры <ArrowUpRight size={18} /></button></form>}</div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top"><a className="brand" href="#top"><span className="brand-mark"><span /></span><span className="brand-wordmark">maxima<span>consulting</span></span></a><p>Финансовый партнёр<br />для МСБ</p><div className="footer-social"><span>Соцсети</span><a href="https://t.me/maxima_consulting_leed_bot?start=diag_s1" target="_blank" rel="noreferrer">Telegram</a><a href="https://vk.com/maxima_consulting" target="_blank" rel="noreferrer">VK</a><a href="https://m.tenchat.ru/u/eei8UmQE" target="_blank" rel="noreferrer">TenChat</a></div><div className="footer-services"><span>Услуги</span><a href="#top">Финансовая диагностика</a><a href="#top">НДС-2026</a><a href="#top">Управленческий учёт</a><a href="#top">CFO-light</a></div></div>
        <div className="container footer-bottom"><span>© 2026 maxima consulting</span><div><a href="#privacy">NDA</a><a href="#privacy">Политика ПД</a></div><span>Designed for clarity <span className="footer-star">✦</span></span></div>
      </footer>
    </div>
  );
}
