const { z } = require('zod');

const ROLE_VALUES = ['owner', 'ceo', 'cfo', 'coo', 'other'];
const INDUSTRY_VALUES = [
  'trade',
  'ecommerce',
  'production',
  'services',
  'local_services',
  'construction',
  'other',
];
const REVENUE_VALUES = [
  'under_20',
  '20_60',
  '60_150',
  '150_500',
  'over_500',
  'unknown',
];
const URGENCY_VALUES = ['urgent', 'month', 'not_urgent', 'researching'];

const LEGAL_FORM_VALUES = [
  'ooo_osn',
  'ooo_usn',
  'ip_osn',
  'ip_usn',
  'self_employed',
  'other',
];
const SKU_COUNT_VALUES = ['1', '2_10', '11_50', 'over_50'];
const ACCOUNTING_VALUES = ['1c', 'excel', 'crm_erp', 'none', 'other'];
const DATA_AVAILABILITY_VALUES = ['ready', 'need_time', 'unsure'];
const DECISION_MAKER_VALUES = ['self', 'partner', 'other'];
const DESIRED_START_VALUES = ['asap', '2_weeks', 'month', 'exploring'];
const HOW_FOUND_VALUES = ['search', 'referral', 'social', 'other'];
const BUDGET_VALUES = ['under_30k', '30_100k', 'over_100k', 'discuss'];

const PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const TELEGRAM_REGEX = /^(@[a-zA-Z0-9_]{5,32}|https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32})$/i;
const NAME_REGEX = /^[\p{L}\s-]{2,60}$/u;

function isValidContact(value) {
  const trimmed = value.trim();
  if (PHONE_REGEX.test(trimmed)) {
    return true;
  }
  if (TELEGRAM_REGEX.test(trimmed)) {
    return true;
  }
  if (trimmed.startsWith('@') && trimmed.length >= 6) {
    return true;
  }
  if (/^t\.me\//i.test(trimmed)) {
    return true;
  }
  return false;
}

const trackingSchema = z.object({
  landing_url: z.string().max(2000).optional(),
  referrer: z.string().max(2000).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(500).optional(),
  utm_campaign_name: z.string().max(200).optional(),
  yclid: z.string().max(200).optional(),
  client_id: z.string().max(200).optional(),
  client_id_missing: z.boolean().optional(),
  user_agent: z.string().max(500).optional(),
  fast_submit: z.boolean().optional(),
});

const leadStep1Schema = trackingSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, 'Заполните это поле')
    .max(60, 'Заполните это поле')
    .regex(NAME_REGEX, 'Заполните это поле'),
  contact: z
    .string()
    .trim()
    .min(1, 'Оставьте телефон или Telegram — как вам удобнее')
    .refine(isValidContact, {
      message: 'Проверьте номер телефона — например, +7 900 123-45-67',
    }),
  role: z.enum(ROLE_VALUES, { message: 'Заполните это поле' }),
  industry: z.enum(INDUSTRY_VALUES, { message: 'Заполните это поле' }),
  revenue: z.enum(REVENUE_VALUES, { message: 'Заполните это поле' }),
  question: z
    .string()
    .trim()
    .min(10, 'Опишите вопрос чуть подробнее — двух-трёх слов будет мало для подготовки к встрече')
    .max(500, 'Опишите вопрос чуть подробнее — двух-трёх слов будет мало для подготовки к встрече'),
  urgency: z.enum(URGENCY_VALUES, { message: 'Заполните это поле' }),
  consent_pdn: z.literal(true, {
    errorMap: () => ({
      message: 'Нужно согласие на обработку персональных данных, чтобы мы могли вам ответить',
    }),
  }),
  middle_name: z.string().max(0).optional(),
});

const leadStep2Schema = z.object({
  legal_form: z.enum(LEGAL_FORM_VALUES).optional(),
  sku_count: z.enum(SKU_COUNT_VALUES).optional(),
  accounting_system: z.enum(ACCOUNTING_VALUES).optional(),
  data_availability: z.enum(DATA_AVAILABILITY_VALUES).optional(),
  decision_maker: z.enum(DECISION_MAKER_VALUES).optional(),
  desired_start: z.enum(DESIRED_START_VALUES).optional(),
  how_found: z.enum(HOW_FOUND_VALUES).optional(),
  budget: z.enum(BUDGET_VALUES).optional(),
  consent_recording: z.boolean().optional(),
});

const LABELS = {
  role: {
    owner: 'Собственник',
    ceo: 'Генеральный директор',
    cfo: 'Финансовый директор',
    coo: 'Операционный директор',
    other: 'Другое',
  },
  industry: {
    trade: 'Торговля/опт-розница',
    ecommerce: 'E-commerce/маркетплейсы',
    production: 'Производство',
    services: 'Услуги',
    local_services: 'Локальные сервисы',
    construction: 'Строительство',
    other: 'Другое',
  },
  revenue: {
    under_20: 'до 20 млн ₽',
    '20_60': '20–60 млн ₽',
    '60_150': '60–150 млн ₽',
    '150_500': '150–500 млн ₽',
    over_500: 'свыше 500 млн ₽',
    unknown: 'затрудняюсь ответить',
  },
  urgency: {
    urgent: 'срочно (нужно решение на этой неделе)',
    month: 'в течение месяца',
    not_urgent: 'не срочно',
    researching: 'изучаю рынок',
  },
  legal_form: {
    ooo_osn: 'ООО/ОСН',
    ooo_usn: 'ООО/УСН',
    ip_osn: 'ИП/ОСН',
    ip_usn: 'ИП/УСН',
    self_employed: 'самозанятый',
    other: 'другое',
  },
  sku_count: {
    '1': '1',
    '2_10': '2–10',
    '11_50': '11–50',
    over_50: 'свыше 50',
  },
  accounting_system: {
    '1c': '1С',
    excel: 'Excel/Google Sheets',
    crm_erp: 'отраслевая CRM/ERP',
    none: 'нет системы',
    other: 'другое',
  },
  data_availability: {
    ready: 'да, готовы предоставить сразу',
    need_time: 'да, но нужно время',
    unsure: 'не уверен',
  },
  decision_maker: {
    self: 'я лично',
    partner: 'нужно согласование с партнёром/советом',
    other: 'другое',
  },
  desired_start: {
    asap: 'как можно быстрее',
    '2_weeks': 'в течение 2 недель',
    month: 'в течение месяца',
    exploring: 'пока изучаю',
  },
  how_found: {
    search: 'поиск в интернете',
    referral: 'рекомендация',
    social: 'соцсети/Telegram',
    other: 'другое',
  },
  budget: {
    under_30k: 'до 30 тыс ₽',
    '30_100k': '30–100 тыс ₽',
    over_100k: 'свыше 100 тыс ₽',
    discuss: 'обсудим на встрече',
  },
};

function label(group, value) {
  if (!value) {
    return '';
  }
  return LABELS[group]?.[value] || value;
}

function formatValidationError(error) {
  const first = error.errors[0];
  return first?.message || 'Проверьте заполнение формы';
}

module.exports = {
  leadStep1Schema,
  leadStep2Schema,
  label,
  formatValidationError,
  isValidContact,
};
