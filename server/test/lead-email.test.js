const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const tls = require('node:tls');
const { describe, it, beforeEach, afterEach } = require('node:test');

const {
  DEFAULT_NOTIFY_TO,
  isLeadEmailConfigured,
  sendLeadNotifyEmail,
} = require('../lib/leadEmail');

describe('leadEmail', () => {
  let originalEnv;
  let originalFetch;
  let fetchCalls;

  beforeEach(() => {
    originalEnv = {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      BREVO_API_KEY: process.env.BREVO_API_KEY,
      LEAD_EMAIL_FROM: process.env.LEAD_EMAIL_FROM,
      LEAD_NOTIFY_TO: process.env.LEAD_NOTIFY_TO,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_TLS_INSECURE: process.env.SMTP_TLS_INSECURE,
    };
    delete process.env.RESEND_API_KEY;
    delete process.env.BREVO_API_KEY;
    delete process.env.LEAD_NOTIFY_TO;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_TLS_INSECURE;
    fetchCalls = [];
    originalFetch = global.fetch;
    global.fetch = async (url, options) => {
      fetchCalls.push({ url: String(url), options });
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 'email-1' }),
      };
    };
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    global.fetch = originalFetch;
  });

  it('по умолчанию шлёт на grokbot-inbox', () => {
    assert.equal(DEFAULT_NOTIFY_TO, 'maxima@mail.grokbot.com');
  });

  it('без API-ключей письмо не отправляется', async () => {
    process.env.LEAD_EMAIL_FROM = 'leads@example.com';

    const result = await sendLeadNotifyEmail(
      {
        name: 'Иван',
        contact: '@ivan',
        role: 'owner',
        industry: 'trade',
        revenue: 'under_20',
        question: 'Тестовый вопрос для проверки',
        urgency: 'researching',
        consent_pdn: true,
      },
      'lead-test-1',
      'created',
    );

    assert.equal(result, null);
    assert.equal(fetchCalls.length, 0);
    assert.equal(isLeadEmailConfigured(), false);
  });

  it('с Resend шлёт JSON на api.resend.com', async () => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.LEAD_EMAIL_FROM = 'leads@maxima-consulting.ru';
    delete process.env.BREVO_API_KEY;

    await sendLeadNotifyEmail(
      {
        name: 'Пётр',
        contact: '+7 (900) 111-22-33',
        role: 'ceo',
        industry: 'services',
        revenue: '20_60',
        question: 'Второй тестовый вопрос про маржу',
        urgency: 'month',
        utm_source: 'google',
        utm_medium: 'cpc',
        consent_pdn: true,
      },
      'lead-test-2',
      'created',
    );

    assert.equal(fetchCalls.length, 1);
    assert.match(fetchCalls[0].url, /api\.resend\.com/);
    const body = JSON.parse(fetchCalls[0].options.body);
    assert.equal(body.to[0], DEFAULT_NOTIFY_TO);
    assert.match(body.text, /lead-test-2/);
    assert.match(body.text, /Пётр/);
  });

  it('через SMTP шлёт текст заявки на адрес уведомления', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lead-smtp-'));
    const keyPath = path.join(dir, 'key.pem');
    const certPath = path.join(dir, 'cert.pem');
    execFileSync('openssl', [
      'req', '-x509', '-newkey', 'rsa:2048',
      '-keyout', keyPath,
      '-out', certPath,
      '-days', '1',
      '-nodes',
      '-subj', '/CN=localhost',
    ], { stdio: 'ignore' });

    const messages = [];
    const server = tls.createServer({
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }, (socket) => {
      let buffer = '';
      let mode = 'command';
      let authStep = 0;
      const reply = (line) => socket.write(`${line}\r\n`);
      reply('220 localhost ESMTP');

      const onCommand = (line) => {
        const upper = line.toUpperCase();
        if (upper.startsWith('EHLO') || upper.startsWith('HELO')) {
          reply('250-localhost');
          reply('250 AUTH LOGIN');
          return;
        }
        if (upper === 'AUTH LOGIN') {
          authStep = 1;
          reply('334 VXNlcm5hbWU6');
          return;
        }
        if (authStep === 1) {
          authStep = 2;
          reply('334 UGFzc3dvcmQ6');
          return;
        }
        if (authStep === 2) {
          authStep = 0;
          reply('235 OK');
          return;
        }
        if (upper.startsWith('MAIL FROM:')) {
          reply('250 OK');
          return;
        }
        if (upper.startsWith('RCPT TO:')) {
          reply('250 OK');
          return;
        }
        if (upper === 'DATA') {
          mode = 'data';
          reply('354 Go ahead');
          return;
        }
        if (upper === 'QUIT') {
          reply('221 Bye');
          socket.end();
        }
      };

      socket.on('data', (chunk) => {
        buffer += chunk.toString('utf8');
        if (mode === 'data') {
          const end = buffer.indexOf('\r\n.\r\n');
          if (end === -1) {
            return;
          }
          messages.push(buffer.slice(0, end));
          buffer = buffer.slice(end + 5);
          mode = 'command';
          reply('250 OK');
        }
        while (mode === 'command') {
          const index = buffer.indexOf('\r\n');
          if (index === -1) {
            break;
          }
          const line = buffer.slice(0, index);
          buffer = buffer.slice(index + 2);
          onCommand(line);
        }
      });
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    process.env.SMTP_HOST = '127.0.0.1';
    process.env.SMTP_PORT = String(port);
    process.env.SMTP_USER = 'info@maxima-consulting.ru';
    process.env.SMTP_PASS = 'secret';
    process.env.SMTP_TLS_INSECURE = '1';
    process.env.LEAD_EMAIL_FROM = 'info@maxima-consulting.ru';

    try {
      await sendLeadNotifyEmail(
        {
          name: 'Анна',
          contact: '@anna',
          role: 'owner',
          industry: 'trade',
          revenue: 'under_20',
          question: 'Проверка письма через SMTP',
          urgency: 'researching',
          consent_pdn: true,
        },
        'lead-smtp-1',
        'created',
      );
    } finally {
      await new Promise((resolve) => server.close(resolve));
      fs.rmSync(dir, { recursive: true, force: true });
    }

    assert.equal(messages.length, 1);
    assert.match(messages[0], /info@maxima-consulting\.ru/);
    assert.match(messages[0], /maxima@mail\.grokbot\.com/);
    assert.match(messages[0], /lead-smtp-1/);
    assert.match(messages[0], /Анна/);
    assert.equal(fetchCalls.length, 0);
  });
});
