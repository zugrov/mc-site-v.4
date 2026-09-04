const TIMEOUT_MS = Number(process.env.EXTERNAL_TIMEOUT_MS) || 5000;

function getWebhookBase() {
  const url = process.env.BITRIX24_WEBHOOK_URL;
  if (!url) {
    return null;
  }
  return url.replace(/\/crm\.lead\.add\.json\/?$/, '');
}

async function callBitrix(method, params) {
  const base = getWebhookBase();
  if (!base) {
    throw new Error('BITRIX24_WEBHOOK_URL не настроен');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${base}/${method}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error_description || data.error || 'Bitrix API error');
    }

    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

function getConversionGoals() {
  const raw = process.env.BITRIX_CONVERSION_GOALS || '{}';
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch (error) {
    throw new Error('BITRIX_CONVERSION_GOALS: невалидный JSON');
  }
}

function getSelectFields() {
  const fields = ['ID', 'STATUS_ID', 'DATE_MODIFY', 'LEAD_ID'];
  const clientIdCode = process.env.BITRIX_UF_CLIENT_ID_CODE;
  const yclidCode = process.env.BITRIX_UF_YCLID_CODE;

  if (clientIdCode) {
    fields.push(clientIdCode);
  }
  if (yclidCode) {
    fields.push(yclidCode);
  }

  return fields;
}

function parseCommentsIdentifiers(comments) {
  const text = comments || '';
  const clientMatch = text.match(/client_id:\s*(\S+)/);
  const yclidMatch = text.match(/yclid:\s*(\S+)/);

  return {
    clientId: clientMatch && clientMatch[1] ? clientMatch[1] : null,
    yclid: yclidMatch && yclidMatch[1] ? yclidMatch[1] : null,
  };
}

function readFieldValue(entity, fieldCode) {
  if (!fieldCode || !entity) {
    return null;
  }
  const value = entity[fieldCode];
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value).trim();
}

async function listConvertedDeals(sinceIso) {
  const goals = getConversionGoals();
  const statusIds = Object.keys(goals);

  if (!statusIds.length) {
    return [];
  }

  const select = getSelectFields();
  const deals = [];
  let start = 0;

  while (true) {
    const batch = await callBitrix('crm.deal.list', {
      order: { DATE_MODIFY: 'ASC' },
      filter: {
        '>=DATE_MODIFY': sinceIso,
        '@STATUS_ID': statusIds,
      },
      select,
      start,
    });

    if (!Array.isArray(batch) || !batch.length) {
      break;
    }

    deals.push(...batch);

    if (batch.length < 50) {
      break;
    }

    start += batch.length;
  }

  return deals;
}

async function resolveIdentifiers(deal) {
  const clientIdCode = process.env.BITRIX_UF_CLIENT_ID_CODE;
  const yclidCode = process.env.BITRIX_UF_YCLID_CODE;

  let clientId = readFieldValue(deal, clientIdCode);
  let yclid = readFieldValue(deal, yclidCode);

  if ((!clientId || !yclid) && deal.LEAD_ID) {
    const lead = await callBitrix('crm.lead.get', { id: deal.LEAD_ID });
    const fromComments = parseCommentsIdentifiers(lead.COMMENTS);

    if (!clientId) {
      clientId = readFieldValue(lead, clientIdCode) || fromComments.clientId;
    }
    if (!yclid) {
      yclid = readFieldValue(lead, yclidCode) || fromComments.yclid;
    }
  }

  return {
    clientId: clientId || null,
    yclid: yclid || null,
  };
}

module.exports = {
  getConversionGoals,
  listConvertedDeals,
  resolveIdentifiers,
};
