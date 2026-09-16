import { FormEvent, useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  LockKeyhole,
  Menu,
  MoveUpRight,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";

const scenarios = [
  {
    number: "01",
    tag: "PRICE ENGINE",
    title: "Сценарий цены",
    description:
      "Как разные варианты ценообразования при новом режиме НДС отразятся на конечной цене для клиента и на позиции относительно конкурентов.",
    icon: ArrowUpRight,
    accent: "lime",
    metric: "+8–12%",
    metricLabel: "диапазон пересмотра",
  },
  {
    number: "02",
    tag: "MARGIN CONTROL",
    title: "Сценарий маржи",
    description:
      "Как изменится маржинальность по направлениям, товарам или услугам при сохранении текущей цены и при её пересмотре.",
    icon: Scale,
    accent: "blue",
    metric: "4–6 п.п.",
    metricLabel: "возможное снижение",
  },
  {
    number: "03",
    tag: "CASH FLOW",
    title: "Сценарий движения денежных средств",
    description:
      "Как выбранный вариант повлияет на движение денег: сроки платежей, отсрочки, кассовые разрывы.",
    icon: WalletCards,
    accent: "orange",
    metric: "Q2",
    metricLabel: "точка внимания",
  },
];

const faqs = [
  {
    question: "Вы поможете снизить НДС?",
    answer:
      "Нет. Мы не занимаемся налоговой оптимизацией и не даём таких обещаний. Мы считаем, как разные решения по цене и режиму отражаются на марже и деньгах, чтобы вы могли принять взвешенное решение.",
  },
  {
    question: "Это консультация по налогам?",
    answer:
      "Это финансовая, а не налоговая консультация. Вопросы, требующие юридической налоговой оценки, мы рекомендуем решать с бухгалтером или налоговым консультантом; при необходимости подскажем, на что обратить внимание.",
  },
  {
    question: "У меня оборот меньше 20 млн ₽, мне это нужно?",
    answer:
      "Порог влияет на обязанность платить НДС, но не отменяет необходимость планировать: при приближении к порогу или при росте бизнеса сценарии стоит просчитать заранее.",
  },
  {
    question: "Что я получу по итогу?",
    answer:
      "Memo со сравнением сценариев по цене, марже и движению денежных средств, и рекомендации по приоритетным следующим шагам.",
  },
  {
    question: "Сколько это стоит и как долго длится?",
    answer:
      "Стоимость и сроки уточняем после короткого звонка — они зависят от сложности бизнеса и объёма данных.",
  },
];

const rows = [
  ["А — цена без изменений", "Без изменений", "Снижение на 4–6 п.п.", "Кассовый разрыв возможен в Q2"],
  ["Б — пересмотр цены", "+8–12%", "Сохранение текущей маржи", "Риск оттока клиентов"],
  ["В — смешанный подход", "+3–5% на часть SKU", "Частичное восстановление", "Более плавный переход"],
];

function scrollToForm() {
  document.querySelector("#request")?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    toast.success("Заявка отправлена", {
      description: "Мы свяжемся с вами в ближайшее время, чтобы уточнить вводные.",
    });
  }

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Maxima Consulting — на главную">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">maxima<span>consulting</span></span>
        </a>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`}>
          <a href="#scenarios" onClick={() => setMobileOpen(false)}>Сценарии</a>
          <a href="#reference" onClick={() => setMobileOpen(false)}>Справочно</a>
          <a href="#trust" onClick={() => setMobileOpen(false)}>Подход</a>
          <a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href="tel:+79808488480">+7 980 848-84-80</a>
          <button className="button button-small button-dark" onClick={scrollToForm}>Обсудить задачу <ArrowUpRight size={15} /></button>
        </div>
        <button className="menu-button" aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-grid" />
          <div className="hero-copy reveal">
            <div className="eyebrow"><span className="eyebrow-dot" /> ФИНАНСОВЫЕ СЦЕНАРИИ <span className="eyebrow-line" /> НДС—2026</div>
            <h1>НДС-2026:<br /><em>сценарии</em> для<br />вашего бизнеса<span className="title-dot">.</span></h1>
            <p className="hero-lead">Цена, маржа и движение денежных средств — без решений наугад.</p>
            <div className="hero-ctas">
              <button className="button button-primary" onClick={scrollToForm}>Проверить сценарий <ArrowUpRight size={18} /></button>
              <a className="text-link" href="#scenarios">Что мы посчитаем <MoveUpRight size={16} /></a>
            </div>
            <div className="hero-proof"><ShieldCheck size={16} /><span>Считаем на ваших данных</span><span className="proof-separator">·</span><span>NDA до начала работы</span></div>
          </div>
          <div className="hero-visual reveal reveal-delay-2">
            <div className="visual-orbit orbit-large" />
            <div className="visual-orbit orbit-small" />
            <div className="visual-core">
              <span className="core-label">УСН / 2026</span>
              <strong>20<span>млн ₽</span></strong>
              <span className="core-caption">порог освобождения<br />от НДС</span>
            </div>
            <div className="float-card float-card-top"><span className="float-icon lime-icon"><Activity size={15} /></span><span><b>3 сценария</b><small>на одной модели</small></span></div>
            <div className="float-card float-card-bottom"><span className="float-icon blue-icon"><BarChart3 size={15} /></span><span><b>+12.4%</b><small>вариант роста цены</small></span><ArrowUpRight className="float-trend" size={15} /></div>
            <div className="chart-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="visual-note">01 / 03<br /><span>сценарии</span></div>
          </div>
          <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></div>
        </section>

        <section className="marquee-section" aria-label="Ключевые направления расчёта">
          <div className="marquee-track"><span>PRICE</span><span className="marquee-star">✳</span><span>MARGIN</span><span className="marquee-star">✳</span><span>CASH FLOW</span><span className="marquee-star">✳</span><span>PRICE</span><span className="marquee-star">✳</span><span>MARGIN</span></div>
        </section>

        <section id="scenarios" className="section-pad scenarios-section">
          <div className="section-intro reveal"><div className="section-kicker">01 / СЦЕНАРИИ</div><div><h2>Что мы <em>посчитаем</em></h2><p>Три сценария на одной модели — сравниваете варианты и принимаете решение сами.</p></div></div>
          <div className="scenario-grid">
            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return <article className={`scenario-card accent-${scenario.accent} reveal reveal-delay-${index + 1}`} key={scenario.number}>
                <div className="scenario-top"><span className="scenario-number">{scenario.number}</span><span className="scenario-tag">{scenario.tag}</span><Icon size={23} strokeWidth={1.5} /></div>
                <div className="scenario-content"><h3>{scenario.title}</h3><p>{scenario.description}</p></div>
                <div className="scenario-metric"><strong>{scenario.metric}</strong><span>{scenario.metricLabel}</span></div>
                <div className="card-arrow"><ArrowUpRight size={17} /></div>
              </article>;
            })}
          </div>
          <div className="scenario-note reveal"><span className="note-mark">↳</span><p>Мы не даём одного «правильного» ответа — показываем, как выглядит бизнес в каждом сценарии, и передаём выбор вам.</p></div>
        </section>

        <section id="reference" className="section-pad reference-section">
          <div className="reference-layout">
            <div className="section-intro intro-stacked reveal"><div className="section-kicker">02 / СПРАВОЧНО</div><h2>Что изменилось<br />для УСН <em>в 2026</em></h2><p>Порог освобождения от НДС для бизнеса на УСН сохранён на уровне 20 млн ₽ годовой выручки — это правило действует до 2029 года включительно согласно Федеральному закону № 228-ФЗ.</p><a className="source-link" href="https://www.nalog.gov.ru/rn77/taxation/reference_work/usn/" target="_blank" rel="noreferrer">Первоисточник: справочная информация ФНС <ArrowUpRight size={14} /></a></div>
            <div className="threshold-panel reveal reveal-delay-2"><div className="panel-top"><span>THRESHOLD MONITOR</span><span className="live-dot">LIVE</span></div><div className="threshold-number">20 <small>млн ₽</small></div><p>годовая выручка / порог освобождения от НДС</p><div className="threshold-scale"><span>0</span><div className="scale-line"><span className="scale-fill" /><i /></div><span>20M</span></div><div className="threshold-foot"><span><i className="legend-dot lime-dot" /> актуальный порог</span><span>до 2029 года</span></div></div>
          </div>
          <div className="legal-note reveal"><CircleHelp size={18} /><p>Ранее обсуждавшийся график с порогами 15 и 10 млн ₽ не применяется как действующий. Мы поможем разобраться, что конкретно это означает для вашего бизнеса и какие сценарии стоит просчитать в вашем случае.</p></div>
          <div className="disclaimer">Информация носит справочный характер и не является налоговой консультацией в юридическом смысле; финальные решения по налоговому режиму принимайте вместе с бухгалтером или налоговым консультантом.</div>
          <div className="table-wrap reveal"><table><thead><tr><th>Сценарий</th><th>Цена для клиента</th><th>Маржа</th><th>Движение денежных средств</th></tr></thead><tbody>{rows.map((row, index) => <tr key={row[0]}><td><span className={`table-index index-${index}`}>0{index + 1}</span>{row[0]}</td><td className={index === 1 ? "positive" : ""}>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table><span className="table-caption">Пример обезличенной сценарной таблицы — не расчёт на данных конкретного клиента.</span></div>
        </section>

        <section id="trust" className="section-pad trust-section">
          <div className="section-intro reveal"><div className="section-kicker">03 / ДОВЕРИЕ</div><div><h2>Почему можно<br /><em>доверять</em> результату</h2></div></div>
          <div className="trust-grid">
            <div className="trust-list reveal"><div className="trust-item"><span className="trust-icon"><BarChart3 size={19} /></span><div><h3>Финансовые сценарии, а не налоговые схемы</h3><p>Мы работаем с финансовыми сценариями, а не с налоговыми схемами и не занимаемся налоговой оптимизацией.</p></div></div><div className="trust-item"><span className="trust-icon"><LockKeyhole size={19} /></span><div><h3>Формат работы по NDA</h3><p>Данные бизнеса не передаются третьим лицам. Соглашение о конфиденциальности подписывается до начала работы.</p></div></div></div>
            <div className="memo-card reveal reveal-delay-2"><div className="memo-header"><span className="memo-file"><FileText size={18} /></span><span>MEMO / STRUCTURE</span><span className="memo-status">ANONYMIZED</span></div><div className="memo-title">Пример структуры memo</div><div className="memo-lines"><div><Check size={14} /> Сравнение сценариев по цене, марже и движению денежных средств</div><div><Check size={14} /> Ключевые допущения и ограничения расчёта</div><div><Check size={14} /> Риски каждого варианта</div><div><Check size={14} /> Рекомендации по приоритетным следующим шагам</div></div><div className="memo-footer">Пример структуры документа — не расчёт на данных конкретного клиента.</div></div>
          </div>
        </section>

        <section id="faq" className="section-pad faq-section">
          <div className="faq-layout"><div className="section-intro intro-stacked reveal"><div className="section-kicker">04 / FAQ</div><h2>Частые<br /><em>вопросы</em></h2><p>Коротко о подходе, границах работы и результате, который вы получите.</p></div><div className="faq-list reveal reveal-delay-2">{faqs.map((faq, index) => <div className={`faq-item ${openFaq === index ? "is-open" : ""}`} key={faq.question}><button className="faq-trigger" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span><i>0{index + 1}</i>{faq.question}</span><ChevronDown size={19} /></button>{openFaq === index && <div className="faq-answer"><p>{faq.answer}</p></div>}</div>)}</div></div>
        </section>

        <section id="request" className="request-section section-pad">
          <div className="request-glow" /><div className="request-layout"><div className="request-copy reveal"><div className="eyebrow"><span className="eyebrow-dot" /> СЛЕДУЮЩИЙ ШАГ</div><h2>Проверим<br /><em>сценарии</em><br />на ваших данных<span className="title-dot">.</span></h2><p>Без обещаний по экономии — только расчёт на ваших данных.</p><div className="direct-contact"><span>Или напишите напрямую</span><a href="tel:+79808488480"><Phone size={15} /> +7 980 848-84-80</a><a href="https://t.me/maxima_consulting_leed_bot?start=nds_s1" target="_blank" rel="noreferrer"><Send size={15} /> @maxima_consulting_leed_bot</a></div></div><div className="form-card reveal reveal-delay-2">{submitted ? <div className="form-success"><div className="success-icon"><Check size={25} /></div><h3>Заявка принята</h3><p>Спасибо. Мы свяжемся с вами в ближайшее время, чтобы уточнить вводные и предложить формат расчёта.</p><button className="button button-primary" onClick={() => setSubmitted(false)}>Отправить ещё одну <ArrowUpRight size={17} /></button></div> : <form onSubmit={handleSubmit}><div className="form-heading"><span>01</span><strong>Запросить расчёт сценариев</strong><small>Без обязательств на этом шаге.</small></div><label className="honeypot">Middle name<input name="middleName" tabIndex={-1} autoComplete="off" /></label><div className="form-grid"><label>Ваше имя *<input required name="name" placeholder="Как к вам обращаться" /></label><label>Телефон или Telegram *<input required name="contact" placeholder="+7 / @username" /></label><label>Роль в компании *<select required name="role" defaultValue=""><option value="" disabled>Выберите</option><option>Собственник</option><option>Генеральный директор</option><option>Финансовый директор</option><option>Операционный директор</option><option>Другое</option></select></label><label>Отрасль *<select required name="industry" defaultValue=""><option value="" disabled>Выберите</option><option>Торговля / опт-розница</option><option>E-commerce / маркетплейсы</option><option>Производство</option><option>Услуги</option><option>Локальные сервисы</option><option>Строительство</option><option>Другое</option></select></label><label>Диапазон годовой выручки *<select required name="revenue" defaultValue=""><option value="" disabled>Выберите</option><option>до 20 млн ₽</option><option>20–60 млн ₽</option><option>60–150 млн ₽</option><option>150–500 млн ₽</option><option>свыше 500 млн ₽</option><option>затрудняюсь ответить</option></select></label><label>Срочность *<select required name="urgency" defaultValue=""><option value="" disabled>Выберите</option><option>Срочно (нужно решение на этой неделе)</option><option>В течение месяца</option><option>Не срочно</option><option>Изучаю рынок</option></select></label><label className="full-width">Главный вопрос *<textarea required name="question" placeholder="Что хотите понять или просчитать?" rows={3} /></label></div><label className="consent"><input type="checkbox" required /> <span>Согласен(на) на обработку персональных данных в соответствии с Политикой обработки персональных данных *</span></label><button className="button button-primary submit-button" type="submit">Проверить сценарий <ArrowUpRight size={18} /></button></form>}</div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a className="brand" href="#top"><span className="brand-mark"><span /></span><span className="brand-name">maxima<span>consulting</span></span></a><p>Финансовый партнёр<br />для МСБ</p><div className="footer-social"><span>Соцсети</span><a href="https://t.me/maxima_consulting_leed_bot?start=nds_s1" target="_blank" rel="noreferrer">Telegram</a><a href="https://vk.com/maxima_consulting" target="_blank" rel="noreferrer">VK</a><a href="https://m.tenchat.ru/u/eei8UmQE" target="_blank" rel="noreferrer">TenChat</a></div><div className="footer-services"><span>Услуги</span><a href="#request">Финансовая диагностика</a><a href="#request">НДС-2026</a><a href="#request">Управленческий учёт</a><a href="#request">CFO-light</a></div></div><div className="footer-bottom"><span>© maxima consulting, 2026</span><div><a href="#request">NDA</a><a href="#request">Политика ПД</a></div><span className="footer-signature">DESIGNED FOR DECISIONS <Sparkles size={13} /></span></div></footer>
      <button className="floating-cta" onClick={scrollToForm} aria-label="Оставить заявку">
        <span className="floating-cta-pulse" />
        <Send size={16} />
        <span>Оставить заявку</span>
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
