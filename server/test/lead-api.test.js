const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { describe, it, before, after, beforeEach, afterEach } = require('node:test');

const { leadStep1Schema } = require('../lib/validation');

process.env.BITRIX24_WEBHOOK_URL = 'https://example.invalid/rest/1/token/crm.lead.add.json';
process.env.TELEGRAM_BOT_TOKEN = 'test-token';
process.env.TELEGRAM_CHAT_ID = '111';
process.env.TELEGRAM_FALLBACK_ALERT_CHAT_ID = '222';
process.env.EXTERNAL_TIMEOUT_MS = '1000';

const app = require('../index');

const FAILED_LOG = path.join(__dirname, '..', 'data', 'failed-leads.log');

function validPayload(contact) {
  return {
    name: 'Иван',
    contact,
    role: 'owner',
    industry: 'trade',
    revenue: 'under_20',
    question: 'Нужно понять, куда уходит маржа компании',
    urgency: 'researching',
    consent_pdn: true,
  };
}

function request(port, { method, urlPath, body, ip }) {
  const payload = body === undefined ? '' : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      method,
      path: urlPath,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-Forwarded-For': ip,
      },
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try {
          json = raw ? JSON.parse(raw) : null;
        } catch (error) {
          json = null;
        }
        resolve({ status: res.statusCode, json, raw });
      });
    });
    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

describe('Lead API', { concurrency: 1 }, () => {
  let server;
  let port;
  let originalFetch;
  const calls = [];

  before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    port = server.address().port;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  beforeEach(() => {
    calls.length = 0;
    originalFetch = global.fetch;
    global.fetch = async (url, options) => {
      const body = options && options.body ? JSON.parse(options.body) : {};
      calls.push({ url: String(url), body });
      if (String(url).includes('api.telegram.org')) {
        if (String(body.chat_id) === '222') {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              result: { message_id: 9, chat: { id: 222 } },
            }),
          };
        }
        return {
          ok: true,
          json: async () => ({ ok: false, description: 'telegram down' }),
        };
      }
      throw new Error('bitrix down');
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('валидация принимает корректную заявку и отклоняет пустые поля', () => {
    const ok = leadStep1Schema.safeParse(validPayload('+7 (900) 123-45-67'));
    assert.equal(ok.success, true);

    const shortName = leadStep1Schema.safeParse({
      ...validPayload('@validuser'),
      name: 'А',
    });
    assert.equal(shortName.success, false);

    const badPhone = leadStep1Schema.safeParse({
      ...validPayload('+79001234567'),
    });
    assert.equal(badPhone.success, false);

    const noConsent = leadStep1Schema.safeParse({
      ...validPayload('@validuser'),
      consent_pdn: false,
    });
    assert.equal(noConsent.success, false);

    const shortQuestion = leadStep1Schema.safeParse({
      ...validPayload('@validuser'),
      question: 'мало',
    });
    assert.equal(shortQuestion.success, false);
  });

  it('POST /api/lead возвращает 400 на невалидном контакте', async () => {
    const response = await request(port, {
      method: 'POST',
      urlPath: '/api/lead',
      ip: '10.1.0.1',
      body: { ...validPayload('не контакт'), consent_pdn: true },
    });
    assert.equal(response.status, 400);
    assert.equal(response.json.status, 'error');
    assert.equal(calls.length, 0);
  });

  it('middle_name — антиспам-ловушка без внешних вызовов', async () => {
    const response = await request(port, {
      method: 'POST',
      urlPath: '/api/lead',
      ip: '10.1.0.2',
      body: { middle_name: 'bot' },
    });
    assert.equal(response.status, 200);
    assert.equal(response.json.status, 'ok');
    assert.equal(response.json.crm_status, 'created');
    assert.equal(typeof response.json.lead_id, 'string');
    assert.ok(response.json.lead_id.length > 0);
    assert.equal(calls.length, 0);
  });

  it('ограничивает частоту POST /api/lead', async () => {
    const ip = '10.1.0.3';
    const statuses = [];
    for (let i = 0; i < 4; i += 1) {
      const response = await request(port, {
        method: 'POST',
        urlPath: '/api/lead',
        ip,
        body: {},
      });
      statuses.push(response.status);
    }
    assert.deepEqual(statuses.slice(0, 3), [400, 400, 400]);
    assert.equal(statuses[3], 429);
    assert.equal(calls.length, 0);
  });

  it('ограничивает частоту POST /api/lead/:id/enrich', async () => {
    const ip = '10.1.0.4';
    const statuses = [];
    for (let i = 0; i < 6; i += 1) {
      const response = await request(port, {
        method: 'POST',
        urlPath: '/api/lead/test-lead/enrich',
        ip,
        body: { legal_form: 'nope' },
      });
      statuses.push(response.status);
    }
    assert.deepEqual(statuses.slice(0, 5), [400, 400, 400, 400, 400]);
    assert.equal(statuses[5], 429);
    assert.equal(calls.length, 0);
  });

  it('пишет резервную копию и шлёт сигнал, если оба канала упали', async () => {
    const response = await request(port, {
      method: 'POST',
      urlPath: '/api/lead',
      ip: '10.1.0.5',
      body: validPayload('@fallbackuser'),
    });

    assert.equal(response.status, 200);
    assert.equal(response.json.status, 'ok');
    assert.equal(response.json.crm_status, 'failed');

    const log = fs.readFileSync(FAILED_LOG, 'utf8');
    assert.ok(log.includes(response.json.lead_id));

    const alert = calls.find((call) => (
      call.url.includes('api.telegram.org') && String(call.body.chat_id) === '222'
    ));
    assert.ok(alert);
    assert.match(alert.body.text, /failed-leads\.log/);
    assert.match(alert.body.text, new RegExp(response.json.lead_id));
  });

  it('оставляет ответ успешным, если сигнал о резервной записи тоже упал', async () => {
    global.fetch = async (url, options) => {
      const body = options && options.body ? JSON.parse(options.body) : {};
      calls.push({ url: String(url), body });
      throw new Error('network down');
    };

    const response = await request(port, {
      method: 'POST',
      urlPath: '/api/lead',
      ip: '10.1.0.6',
      body: validPayload('@fallbackfail'),
    });

    assert.equal(response.status, 200);
    assert.equal(response.json.status, 'ok');
    assert.equal(response.json.crm_status, 'failed');
    const log = fs.readFileSync(FAILED_LOG, 'utf8');
    assert.ok(log.includes(response.json.lead_id));
  });
});
