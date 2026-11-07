const assert = require('node:assert/strict');
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
    };
    delete process.env.RESEND_API_KEY;
    delete process.env.BREVO_API_KEY;
    delete process.env.LEAD_NOTIFY_TO;
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
    process.env.RESEND_API_KEY = originalEnv.RESEND_API_KEY;
    process.env.BREVO_API_KEY = originalEnv.BREVO_API_KEY;
    process.env.LEAD_EMAIL_FROM = originalEnv.LEAD_EMAIL_FROM;
    process.env.LEAD_NOTIFY_TO = originalEnv.LEAD_NOTIFY_TO;
    global.fetch = originalFetch;
  });

  it('по умолчанию шлёт на grokbot-inbox', () => {
    assert.equal(DEFAULT_NOTIFY_TO, 'maxima+leed@mail.grokbot.com');
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
});
