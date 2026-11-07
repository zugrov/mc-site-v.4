const tls = require('node:tls');

const { buildLeadMessage } = require('./telegram');

const TIMEOUT_MS = Number(process.env.EXTERNAL_TIMEOUT_MS) || 5000;
const DEFAULT_NOTIFY_TO = 'maxima@mail.grokbot.com';
const DEFAULT_SMTP_HOST = 'smtp.mail.ru';
const DEFAULT_SMTP_PORT = 465;

function getLeadNotifyTo() {
  const to = (process.env.LEAD_NOTIFY_TO || '').trim();
  return to || DEFAULT_NOTIFY_TO;
}

function getSmtpUser() {
  return (process.env.SMTP_USER || '').trim();
}

function getSmtpPass() {
  return process.env.SMTP_PASS || '';
}

function isSmtpConfigured() {
  return Boolean(getSmtpUser() && getSmtpPass());
}

function getFromAddress() {
  return (
    process.env.LEAD_EMAIL_FROM
    || process.env.RESEND_FROM
    || getSmtpUser()
    || ''
  ).trim();
}

function isLeadEmailConfigured() {
  if (isSmtpConfigured() && getFromAddress()) {
    return true;
  }
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

function takeSmtpResponse(buffer) {
  const lines = buffer.split('\r\n');
  const complete = [];

  for (let index = 0; index < lines.length - 1; index += 1) {
    const line = lines[index];
    complete.push(line);
    const isFinal = line.length >= 4 && line[3] === ' ';
    if (!isFinal) {
      continue;
    }

    return {
      code: Number(line.slice(0, 3)),
      text: complete.map((item) => item.slice(4)).join('\n'),
      rest: lines.slice(index + 1).join('\r\n'),
    };
  }

  return null;
}

function encodeSubject(value) {
  if (/^[\x20-\x7E]*$/.test(value)) {
    return value;
  }
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
}

function buildSmtpData({ from, to, subject, text }) {
  const body = text.replace(/\r?\n/g, '\r\n').split('\r\n').map((line) => (
    line.startsWith('.') ? `.${line}` : line
  )).join('\r\n');

  return [
    `From: Maxima Consulting <${from}>`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    body,
    '.',
    '',
  ].join('\r\n');
}

function sendViaSmtp({ to, from, subject, text }) {
  const host = (process.env.SMTP_HOST || DEFAULT_SMTP_HOST).trim();
  const port = Number(process.env.SMTP_PORT) || DEFAULT_SMTP_PORT;
  const user = getSmtpUser();
  const pass = getSmtpPass();

  return new Promise((resolve, reject) => {
    const tlsOptions = {
      host,
      port,
      rejectUnauthorized: process.env.SMTP_TLS_INSECURE !== '1',
    };
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
      tlsOptions.servername = host;
    }
    const socket = tls.connect(tlsOptions);

    let buffer = '';
    let stage = 'greeting';
    let settled = false;

    const finish = (error, result) => {
      if (settled) {
        return;
      }
      settled = true;
      socket.end();
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    };

    const writeLine = (line) => {
      socket.write(`${line}\r\n`);
    };

    const failCode = (code, message) => {
      finish(new Error(`SMTP ${code}: ${message || 'ошибка'}`));
    };

    const onResponse = (code, message) => {
      if (code >= 400) {
        failCode(code, message);
        return;
      }

      if (stage === 'greeting') {
        stage = 'ehlo';
        writeLine('EHLO maxima-consulting.ru');
        return;
      }
      if (stage === 'ehlo') {
        stage = 'auth';
        writeLine('AUTH LOGIN');
        return;
      }
      if (stage === 'auth') {
        stage = 'user';
        writeLine(Buffer.from(user, 'utf8').toString('base64'));
        return;
      }
      if (stage === 'user') {
        stage = 'pass';
        writeLine(Buffer.from(pass, 'utf8').toString('base64'));
        return;
      }
      if (stage === 'pass') {
        stage = 'mail';
        writeLine(`MAIL FROM:<${from}>`);
        return;
      }
      if (stage === 'mail') {
        stage = 'rcpt';
        writeLine(`RCPT TO:<${to}>`);
        return;
      }
      if (stage === 'rcpt') {
        stage = 'data';
        writeLine('DATA');
        return;
      }
      if (stage === 'data') {
        stage = 'body';
        socket.write(buildSmtpData({ from, to, subject, text }));
        return;
      }
      if (stage === 'body') {
        stage = 'quit';
        writeLine('QUIT');
        finish(null, { ok: true });
      }
    };

    const consume = () => {
      let parsed = takeSmtpResponse(buffer);
      while (parsed) {
        buffer = parsed.rest;
        onResponse(parsed.code, parsed.text);
        if (settled) {
          return;
        }
        parsed = takeSmtpResponse(buffer);
      }
    };

    socket.setTimeout(TIMEOUT_MS);
    socket.on('timeout', () => finish(new Error('SMTP timeout')));
    socket.on('error', (error) => finish(error));
    socket.on('end', () => {
      if (!settled) {
        finish(new Error('SMTP connection closed'));
      }
    });
    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      consume();
    });
  });
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
  return deliverEmail({ to, from, subject, text });
}

async function sendEnrichNotifyEmail(payload, leadId) {
  if (!isLeadEmailConfigured()) {
    return null;
  }

  const to = getLeadNotifyTo();
  const from = getFromAddress();
  const text = buildEnrichEmailText(payload, leadId);
  const subject = `Дозаполнение заявки [${leadId}]`;
  return deliverEmail({ to, from, subject, text });
}

function deliverEmail(message) {
  if (isSmtpConfigured()) {
    return sendViaSmtp(message);
  }
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(message);
  }
  return sendViaBrevo(message);
}

module.exports = {
  DEFAULT_NOTIFY_TO,
  isLeadEmailConfigured,
  sendLeadNotifyEmail,
  sendEnrichNotifyEmail,
};
