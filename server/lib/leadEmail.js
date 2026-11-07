const { buildLeadMessage } = require('./telegram');

const TIMEOUT_MS = Number(process.env.EXTERNAL_TIMEOUT_MS) || 5000;
const DEFAULT_NOTIFY_TO = 'maxima+leed@mail.grokbot.com';

function getLeadNotifyTo() {
  const to = (process.env.LEAD_NOTIFY_TO || '').trim();
  return to || DEFAULT_NOTIFY_TO;
}

function getFromAddress() {
  return (process.env.LEAD_EMAIL_FROM || process.env.RESEND_FROM || '').trim();
}

function isLeadEmailConfigured() {
  if (process.env.RESEND_API_KEY && getFromAddress()) {
    return true;
  }
  if (process.env.BREVO_API_KEY && getFromAddress()) {
    return true;
  }
  return false;
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function sendViaResend({ to, from, subject, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const response = await fetchWithTimeout('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || response.statusText || 'Resend error';
    throw new Error(message);
  }

  return data;
}

async function sendViaBrevo({ to, from, subject, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  const response = await fetchWithTimeout('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: from, name: 'Maxima Consulting' },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.code || response.statusText || 'Brevo error';
    throw new Error(message);
  }

  return data;
}

function buildEnrichEmailText(payload, leadId) {
  const lines = [`Дозаполнение заявки [lead_id: ${leadId}]`];
  const { label } = require('./validation');

  const fields = [
    ['legal_form', 'Юрлицо/режим'],
    ['sku_count', 'SKU'],
    ['accounting_system', 'Учёт'],
    ['data_availability', 'Выгрузки'],
    ['decision_maker', 'Решение'],
    ['desired_start', 'Срок'],
    ['how_found', 'Как нашли'],
    ['budget', 'Бюджет'],
  ];

  for (const [key, title] of fields) {
    if (payload[key]) {
      lines.push(`${title}: ${label(key, payload[key])}`);
    }
  }
  if (payload.consent_recording) {
    lines.push('Согласие на запись: да');
  }

  return lines.join('\n');
}

async function sendLeadNotifyEmail(payload, leadId, crmStatus) {
  if (!isLeadEmailConfigured()) {
    return null;
  }

  const to = getLeadNotifyTo();
  const from = getFromAddress();
  const text = buildLeadMessage(payload, leadId, crmStatus);
  const subject = `Заявка с сайта [${leadId}]`;

  if (process.env.RESEND_API_KEY) {
    return sendViaResend({ to, from, subject, text });
  }

  return sendViaBrevo({ to, from, subject, text });
}

async function sendEnrichNotifyEmail(payload, leadId) {
  if (!isLeadEmailConfigured()) {
    return null;
  }

  const to = getLeadNotifyTo();
  const from = getFromAddress();
  const text = buildEnrichEmailText(payload, leadId);
  const subject = `Дозаполнение заявки [${leadId}]`;

  if (process.env.RESEND_API_KEY) {
    return sendViaResend({ to, from, subject, text });
  }

  return sendViaBrevo({ to, from, subject, text });
}

module.exports = {
  DEFAULT_NOTIFY_TO,
  isLeadEmailConfigured,
  sendLeadNotifyEmail,
  sendEnrichNotifyEmail,
};
