(function () {
  'use strict';

  var METRIKA_COUNTER_ID = 112291401;

  var API_LEAD = '/api/lead';
  var TELEGRAM_LINK = 'https://t.me/maxima_cfo';
  var MEMO_LINK = '/financial-diagnostics#trust';

  var TRACKING_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'utm_campaign_name',
    'yclid',
    'client_id',
    'landing_url',
    'referrer',
  ];

  var STORAGE_KEY = 'mc_tracking_params';

  var ERROR_MESSAGES = {
    required: 'Заполните это поле',
    contact: 'Оставьте телефон или Telegram — как вам удобнее',
    phone: 'Проверьте номер телефона — например, +7 900 123-45-67',
    telegram: 'Укажите Telegram в формате @username или t.me/username',
    question: 'Опишите вопрос чуть подробнее — двух-трёх слов будет мало для подготовки к встрече',
    consent: 'Нужно согласие на обработку персональных данных, чтобы мы могли вам ответить',
    network: 'Проверьте подключение к интернету и повторите отправку',
    server: 'Не получилось отправить заявку. Попробуйте ещё раз через минуту — или напишите нам напрямую в Telegram: ' + TELEGRAM_LINK,
  };

  function qs(form, selector) {
    return form.querySelector(selector);
  }

  function readQueryParams() {
    var params = new URLSearchParams(window.location.search);
    var result = {};

    TRACKING_KEYS.forEach(function (key) {
      if (key === 'client_id' || key === 'landing_url' || key === 'referrer') {
        return;
      }
      var value = params.get(key);
      if (value) {
        result[key] = value;
      }
    });

    return result;
  }

  function loadStoredParams() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function saveParams(params) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch (error) {
      // ignore
    }
  }

  function fillHiddenFields(form, params) {
    TRACKING_KEYS.forEach(function (key) {
      var input = form.querySelector('[name="' + key + '"]');
      if (input) {
        input.value = params[key] || '';
      }
    });
  }

  function initTracking(form) {
    var queryParams = readQueryParams();
    var storedParams = loadStoredParams();
    var merged = Object.assign({}, storedParams, queryParams, {
      landing_url: window.location.href,
      referrer: document.referrer || '',
    });

    if (Object.keys(queryParams).length) {
      saveParams(merged);
    }

    fillHiddenFields(form, merged);

    if (typeof ym === 'function' && METRIKA_COUNTER_ID) {
      var resolved = false;
      var timer = setTimeout(function () {
        if (!resolved) {
          var missing = form.querySelector('[name="client_id_missing"]');
          if (missing) {
            missing.value = 'true';
          }
        }
      }, 2000);

      ym(METRIKA_COUNTER_ID, 'getClientID', function (clientId) {
        resolved = true;
        clearTimeout(timer);
        if (clientId) {
          merged.client_id = String(clientId);
          saveParams(merged);
          fillHiddenFields(form, merged);
        }
      });
    }
  }

  function digitsOnly(value) {
    return value.replace(/\D/g, '');
  }

  function formatPhone(value) {
    var digits = digitsOnly(value);
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }
    if (digits.startsWith('7')) {
      digits = digits.slice(0, 11);
    } else if (digits.length) {
      digits = ('7' + digits).slice(0, 11);
    }

    if (!digits.length) {
      return '';
    }

    var rest = digits.slice(1);
    var formatted = '+7';
    if (rest.length > 0) {
      formatted += ' (' + rest.slice(0, 3);
    }
    if (rest.length >= 3) {
      formatted += ') ' + rest.slice(3, 6);
    }
    if (rest.length >= 6) {
      formatted += '-' + rest.slice(6, 8);
    }
    if (rest.length >= 8) {
      formatted += '-' + rest.slice(8, 10);
    }
    return formatted;
  }

  function isPhone(value) {
    return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value.trim());
  }

  function isTelegram(value) {
    var trimmed = value.trim();
    if (/^@[a-zA-Z0-9_]{5,32}$/.test(trimmed)) {
      return true;
    }
    if (/^https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32}$/i.test(trimmed)) {
      return true;
    }
    if (/^t\.me\/[a-zA-Z0-9_]{5,32}$/i.test(trimmed)) {
      return true;
    }
    return false;
  }

  function isNameValid(value) {
    return /^[\p{L}\s-]{2,60}$/u.test(value.trim());
  }

  function setFieldError(field, message) {
    field.classList.add('is-invalid');
    var group = field.closest('.form-group') || field.closest('.form-checkbox');
    if (!group) {
      return;
    }
    var existing = group.querySelector('.form-error');
    if (existing) {
      existing.textContent = message;
      return;
    }
    var error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    group.appendChild(error);
  }

  function clearFieldError(field) {
    field.classList.remove('is-invalid');
    var group = field.closest('.form-group') || field.closest('.form-checkbox');
    if (!group) {
      return;
    }
    var existing = group.querySelector('.form-error');
    if (existing) {
      existing.remove();
    }
  }

  function validateField(field) {
    clearFieldError(field);
    var name = field.name;
    var value = field.type === 'checkbox' ? field.checked : field.value.trim();

    if (name === 'middle_name') {
      return true;
    }

    if (field.required || name === 'consent_pdn') {
      if (field.type === 'checkbox' && !field.checked) {
        setFieldError(field, ERROR_MESSAGES.consent);
        return false;
      }
      if (field.type !== 'checkbox' && !value) {
        setFieldError(field, ERROR_MESSAGES.required);
        return false;
      }
    }

    if (name === 'name' && value && !isNameValid(value)) {
      setFieldError(field, ERROR_MESSAGES.required);
      return false;
    }

    if (name === 'contact' && value) {
      if (!isPhone(value) && !isTelegram(value)) {
        if (value.startsWith('@') || value.includes('t.me')) {
          setFieldError(field, ERROR_MESSAGES.telegram);
        } else {
          setFieldError(field, ERROR_MESSAGES.phone);
        }
        return false;
      }
    }

    if (name === 'question' && value && value.length < 10) {
      setFieldError(field, ERROR_MESSAGES.question);
      return false;
    }

    return true;
  }

  function validateForm(form) {
    var valid = true;
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      if (field.name === 'middle_name') {
        return;
      }
      if (!validateField(field)) {
        valid = false;
      }
    });
    return valid;
  }

  function updateSubmitState(form) {
    var submitBtn = qs(form, '[type="submit"]');
    if (!submitBtn) {
      return;
    }

    var requiredOk = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (field.type === 'checkbox' && !field.checked) {
        requiredOk = false;
      } else if (field.type !== 'checkbox' && !field.value.trim()) {
        requiredOk = false;
      }
    });

    var consent = qs(form, '[name="consent_pdn"]');
    if (consent && !consent.checked) {
      requiredOk = false;
    }

    submitBtn.disabled = !requiredOk;
  }

  function collectFormData(form) {
    var data = {};
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      if (field.name === 'middle_name') {
        data.middle_name = field.value;
        return;
      }
      if (field.type === 'checkbox') {
        if (field.name === 'consent_pdn') {
          data.consent_pdn = field.checked;
        }
        return;
      }
      if (field.name) {
        data[field.name] = field.value.trim();
      }
    });

    var clientIdMissing = form.querySelector('[name="client_id_missing"]');
    if (clientIdMissing && clientIdMissing.value === 'true') {
      data.client_id_missing = true;
    }

    var loadedAt = Number(form.dataset.loadedAt || 0);
    if (loadedAt && Date.now() - loadedAt < 3000) {
      data.fast_submit = true;
    }

    return data;
  }

  function showFormError(form, message) {
    var box = form.querySelector('.form-global-error');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-global-error';
      form.insertBefore(box, form.firstChild);
    }
    box.textContent = message;
  }

  function clearFormError(form) {
    var box = form.querySelector('.form-global-error');
    if (box) {
      box.remove();
    }
  }

  function fireMetrikaGoal() {
    if (typeof ym === 'function' && METRIKA_COUNTER_ID) {
      ym(METRIKA_COUNTER_ID, 'reachGoal', 'lead_submit');
    }
  }

  function renderThankYou(container, leadId) {
    container.innerHTML =
      '<div class="lead-thankyou">' +
      '<h3 class="lead-thankyou__title">Заявка принята</h3>' +
      '<p class="lead-thankyou__text">Спасибо! Мы получили вашу заявку и свяжемся с вами в течение рабочего дня — обычно быстрее.</p>' +
      '<p class="lead-thankyou__id">Номер вашей заявки: <strong>' + leadId + '</strong></p>' +
      '<p class="lead-thankyou__text">Пока ждёте звонка, вы можете:</p>' +
      '<ul class="lead-thankyou__list">' +
      '<li>посмотреть <a href="' + MEMO_LINK + '">пример итогового memo</a>;</li>' +
      '<li>написать нам в <a href="' + TELEGRAM_LINK + '" target="_blank" rel="noopener">Telegram</a>, если что-то захочется уточнить раньше.</li>' +
      '</ul>' +
      '<div class="lead-step2" data-step2></div>' +
      '</div>';

    renderStep2(container.querySelector('[data-step2]'), leadId);
  }

  function renderStep2(container, leadId) {
    container.innerHTML =
      '<p class="lead-step2__title">Ещё 2 минуты — и мы точнее подготовимся к разговору</p>' +
      '<form class="lead-step2__form" data-enrich-form>' +
      '<div class="form-group"><label>Юрлицо / режим налогообложения</label>' +
      '<select name="legal_form"><option value="">Не указано</option>' +
      '<option value="ooo_osn">ООО/ОСН</option><option value="ooo_usn">ООО/УСН</option>' +
      '<option value="ip_osn">ИП/ОСН</option><option value="ip_usn">ИП/УСН</option>' +
      '<option value="self_employed">Самозанятый</option><option value="other">Другое</option></select></div>' +
      '<div class="form-group"><label>Число направлений / SKU</label>' +
      '<select name="sku_count"><option value="">Не указано</option>' +
      '<option value="1">1</option><option value="2_10">2–10</option>' +
      '<option value="11_50">11–50</option><option value="over_50">Свыше 50</option></select></div>' +
      '<div class="form-group"><label>Учётная система</label>' +
      '<select name="accounting_system"><option value="">Не указано</option>' +
      '<option value="1c">1С</option><option value="excel">Excel/Google Sheets</option>' +
      '<option value="crm_erp">Отраслевая CRM/ERP</option><option value="none">Нет системы</option>' +
      '<option value="other">Другое</option></select></div>' +
      '<div class="form-group"><label>Доступность выгрузок</label>' +
      '<select name="data_availability"><option value="">Не указано</option>' +
      '<option value="ready">Да, готовы предоставить сразу</option>' +
      '<option value="need_time">Да, но нужно время</option>' +
      '<option value="unsure">Не уверен</option></select></div>' +
      '<div class="form-group"><label>Кто принимает решение</label>' +
      '<select name="decision_maker"><option value="">Не указано</option>' +
      '<option value="self">Я лично</option><option value="partner">Нужно согласование с партнёром/советом</option>' +
      '<option value="other">Другое</option></select></div>' +
      '<div class="form-group"><label>Желаемый срок начала</label>' +
      '<select name="desired_start"><option value="">Не указано</option>' +
      '<option value="asap">Как можно быстрее</option><option value="2_weeks">В течение 2 недель</option>' +
      '<option value="month">В течение месяца</option><option value="exploring">Пока изучаю</option></select></div>' +
      '<div class="form-group"><label>Как узнали о нас</label>' +
      '<select name="how_found"><option value="">Не указано</option>' +
      '<option value="search">Поиск в интернете</option><option value="referral">Рекомендация</option>' +
      '<option value="social">Соцсети/Telegram</option><option value="other">Другое</option></select></div>' +
      '<div class="form-group"><label>Допустимый бюджет</label>' +
      '<select name="budget"><option value="">Не указано</option>' +
      '<option value="under_30k">До 30 тыс ₽</option><option value="30_100k">30–100 тыс ₽</option>' +
      '<option value="over_100k">Свыше 100 тыс ₽</option><option value="discuss">Обсудим на встрече</option></select></div>' +
      '<label class="form-checkbox"><input type="checkbox" name="consent_recording" />' +
      '<span>Согласен(на) на запись разговора для подготовки к встрече</span></label>' +
      '<button type="submit" class="btn-submit lead-step2__submit">Отправить уточнения</button>' +
      '<p class="form-note lead-step2__skip">Можно пропустить — заявка уже принята</p>' +
      '</form>';

    var enrichForm = container.querySelector('[data-enrich-form]');
    enrichForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var payload = {};
      enrichForm.querySelectorAll('select, input').forEach(function (field) {
        if (field.type === 'checkbox') {
          payload[field.name] = field.checked;
        } else if (field.value) {
          payload[field.name] = field.value;
        }
      });

      fetch(API_LEAD + '/' + encodeURIComponent(leadId) + '/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).finally(function () {
        container.innerHTML = '<p class="lead-step2__done">Спасибо! Уточнения отправлены.</p>';
      });
    });
  }

  function bindForm(form) {
    form.dataset.loadedAt = String(Date.now());
    initTracking(form);

    var contactField = qs(form, '[name="contact"]');
    if (contactField) {
      contactField.addEventListener('input', function () {
        var val = contactField.value.trim();
        if (!val.startsWith('@') && !val.includes('t.me') && digitsOnly(val).length) {
          contactField.value = formatPhone(contactField.value);
        }
        updateSubmitState(form);
      });
    }

    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
        updateSubmitState(form);
      });
      field.addEventListener('input', function () {
        clearFieldError(field);
        updateSubmitState(form);
      });
      field.addEventListener('change', function () {
        updateSubmitState(form);
      });
    });

    updateSubmitState(form);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearFormError(form);

      if (!validateForm(form)) {
        return;
      }

      var submitBtn = qs(form, '[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляем...';
      }

      var payload = collectFormData(form);

      fetch(API_LEAD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok || result.data.status !== 'ok') {
            throw new Error(result.data.message || ERROR_MESSAGES.server);
          }

          fireMetrikaGoal();
          var wrap = form.closest('.cta-form__form-wrap') || form.parentElement;
          renderThankYou(wrap, result.data.lead_id);
        })
        .catch(function (error) {
          var message = error.message || ERROR_MESSAGES.server;
          if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
            message = ERROR_MESSAGES.network;
          }
          showFormError(form, message);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Отправить';
          }
          updateSubmitState(form);
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-lead-form]').forEach(bindForm);
  });
})();
