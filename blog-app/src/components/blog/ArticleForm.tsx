/** Короткая заявка в конце статьи. Поля второго шага уходят тем же POST, что и на главной. */
export function ArticleForm() {
  return (
    <section className="guide-cta-band" id="request" aria-labelledby="article-form-title">
      <h2 id="article-form-title">Нужен разбор под вашу компанию?</h2>
      <p className="muted">30 минут, без обязательств.</p>
      <form className="contact-form" data-lead-form data-wizard noValidate>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="middle_name">Middle name</label>
          <input type="text" name="middle_name" id="middle_name" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="utm_source" />
        <input type="hidden" name="utm_medium" />
        <input type="hidden" name="utm_campaign" />
        <input type="hidden" name="utm_content" />
        <input type="hidden" name="utm_term" />
        <input type="hidden" name="utm_campaign_name" />
        <input type="hidden" name="yclid" />
        <input type="hidden" name="client_id" />
        <input type="hidden" name="landing_url" />
        <input type="hidden" name="referrer" />
        <input type="hidden" name="client_id_missing" />
        <div data-wizard-step="1">
          <label className="field">
            Ваше имя
            <input id="name" name="name" autoComplete="name" required placeholder="Как к вам обращаться?" />
          </label>
          <label className="field">
            Телефон или Telegram
            <input id="contact" name="contact" autoComplete="tel" required placeholder="+7 или @username" />
          </label>
          <label className="field">
            Диапазон выручки
            <select id="revenue" name="revenue" required defaultValue="">
              <option value="">Выберите</option>
              <option value="under_20">до 20 млн ₽</option>
              <option value="20_60">20–60 млн ₽</option>
              <option value="60_150">60–150 млн ₽</option>
              <option value="150_500">150–500 млн ₽</option>
              <option value="over_500">свыше 500 млн ₽</option>
              <option value="unknown">затрудняюсь ответить</option>
            </select>
          </label>
          <button className="button" type="button" data-wizard-next>Дальше</button>
        </div>
        <div data-wizard-step="2" hidden>
          <label className="field">
            Роль в компании
            <select id="role" name="role" required defaultValue="">
              <option value="">Выберите</option>
              <option value="owner">Собственник</option>
              <option value="ceo">Генеральный директор</option>
              <option value="cfo">Финансовый директор</option>
              <option value="coo">Операционный директор</option>
              <option value="other">Другое</option>
            </select>
          </label>
          <label className="field">
            Отрасль
            <select id="industry" name="industry" required defaultValue="">
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
          <label className="field">
            Срочность
            <select id="urgency" name="urgency" required defaultValue="">
              <option value="">Выберите</option>
              <option value="urgent">Срочно (нужно решение на этой неделе)</option>
              <option value="month">В течение месяца</option>
              <option value="not_urgent">Не срочно</option>
              <option value="researching">Изучаю рынок</option>
            </select>
          </label>
          <label className="field">
            Главный вопрос
            <textarea id="question" name="question" required rows={3} placeholder="Что сейчас беспокоит в финансах бизнеса?" />
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="consent_pdn" required />
            <span>
              Согласен(на) на обработку персональных данных в соответствии с{" "}
              <a href="https://maxima-consulting.ru/privacy">Политикой обработки персональных данных</a> *
            </span>
          </label>
          <button className="button" type="submit">Записаться на разбор</button>
        </div>
      </form>
    </section>
  );
}
