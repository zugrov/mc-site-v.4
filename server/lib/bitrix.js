const { label } = require('./validation');

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

function getLeadFieldCodesMap() {
  const raw = process.env.BITRIX_LEAD_FIELD_CODES;
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch (error) {
    return {};
  }
}

function splitContact(contact) {
  const trimmed = contact.trim();
  if (trimmed.startsWith('@') || /t\.me/i.test(trimmed)) {
    return { phone: null, telegram: trimmed };
  }
  return { phone: trimmed, telegram: null };
}

function buildSourceLabel(payload) {
  const source = payload.utm_source || 'direct';
  const medium = payload.utm_medium || 'form';
  return `${source}/${medium}`;
}

function buildComments(payload, leadId) {
  const lines = [
    `lead_id: ${leadId}`,
    `Роль: ${label('role', payload.role)}`,
    `Отрасль: ${label('industry', payload.industry)}`,
    `Выручка: ${label('revenue', payload.revenue)}`,
    `Срочность: ${label('urgency', payload.urgency)}`,
    `Вопрос: ${payload.question}`,
    '',
    `source: ${buildSourceLabel(payload)}`,
    `landing_url: ${payload.landing_url || ''}`,
    `referrer: ${payload.referrer || ''}`,
    `utm_source: ${payload.utm_source || ''}`,
    `utm_medium: ${payload.utm_medium || ''}`,
    `utm_campaign: ${payload.utm_campaign || ''}`,
    `utm_content: ${payload.utm_content || ''}`,
    `utm_term: ${payload.utm_term || ''}`,
    `utm_campaign_name: ${payload.utm_campaign_name || ''}`,
    `yclid: ${payload.yclid || ''}`,
    `client_id: ${payload.client_id || ''}`,
  ];

  return lines.join('\n');
}

function buildCommentsForStore(payload, leadId) {
  return buildComments(payload, leadId);
}

function applyMappedFields(fields, payload, leadId, fieldCodes) {
  const payloadMap = {
    source: buildSourceLabel(payload),
    utm_source: payload.utm_source || '',
    utm_medium: payload.utm_medium || '',
    utm_campaign: payload.utm_campaign || '',
    utm_content: payload.utm_content || '',
    utm_term: payload.utm_term || '',
    utm_campaign_name: payload.utm_campaign_name || '',
    yclid: payload.yclid || '',
    client_id: payload.client_id || '',
    landing_url: payload.landing_url || '',
    lead_id: leadId,
    timestamp: new Date().toISOString(),
  };

  Object.keys(fieldCodes).forEach(function (key) {
    const code = fieldCodes[key];
    if (code && Object.prototype.hasOwnProperty.call(payloadMap, key)) {
      fields[code] = payloadMap[key];
    }
  });
}

function buildLeadFields(payload, leadId) {
  const { phone, telegram } = splitContact(payload.contact);
  const title = `Заявка ${leadId.slice(0, 8)} — ${payload.name}`;

  const fields = {
    TITLE: title,
    NAME: payload.name,
    COMMENTS: buildComments(payload, leadId),
    SOURCE_ID: 'WEB',
    OPENED: 'Y',
  };

  if (phone) {
    fields.PHONE = [{ VALUE: phone, VALUE_TYPE: 'WORK' }];
  }

  if (telegram) {
    fields.IM = [{ VALUE: telegram, VALUE_TYPE: 'TELEGRAM' }];
  }

  const ownerId = process.env.BITRIX_DEFAULT_OWNER_ID;
  if (ownerId) {
    fields.ASSIGNED_BY_ID = Number(ownerId);
  }

  applyMappedFields(fields, payload, leadId, getLeadFieldCodesMap());

  return fields;
}

async function createLead(payload, leadId) {
  const fields = buildLeadFields(payload, leadId);
  const bitrixId = await callBitrix('crm.lead.add', { fields });
  return bitrixId;
}

async function appendDuplicateLeadComment(bitrixId, payload, newLeadId, existingComments) {
  const lines = [
    `[Повторная заявка ${newLeadId}]`,
    `Имя: ${payload.name}`,
    `Контакт: ${payload.contact}`,
    `Источник: ${buildSourceLabel(payload)}`,
    `Страница: ${payload.landing_url || '—'}`,
    `UTM campaign: ${payload.utm_campaign || '—'}`,
    `Вопрос: ${payload.question}`,
  ];

  const comment = `${existingComments || ''}\n\n${lines.join('\n')}`.trim();

  await callBitrix('crm.lead.update', {
    id: bitrixId,
    fields: {
      COMMENTS: comment,
    },
  });
}

async function getLeadComments(bitrixId) {
  const lead = await callBitrix('crm.lead.get', { id: bitrixId });
  return lead.COMMENTS || '';
}

async function updateLead(bitrixId, enrichPayload, leadId, existingComments) {
  const enrichLines = [];

  if (enrichPayload.legal_form) {
    enrichLines.push(`Юрлицо/режим: ${label('legal_form', enrichPayload.legal_form)}`);
  }
  if (enrichPayload.sku_count) {
    enrichLines.push(`Направления/SKU: ${label('sku_count', enrichPayload.sku_count)}`);
  }
  if (enrichPayload.accounting_system) {
    enrichLines.push(`Учётная система: ${label('accounting_system', enrichPayload.accounting_system)}`);
  }
  if (enrichPayload.data_availability) {
    enrichLines.push(`Выгрузки: ${label('data_availability', enrichPayload.data_availability)}`);
  }
  if (enrichPayload.decision_maker) {
    enrichLines.push(`Решение принимает: ${label('decision_maker', enrichPayload.decision_maker)}`);
  }
  if (enrichPayload.desired_start) {
    enrichLines.push(`Срок начала: ${label('desired_start', enrichPayload.desired_start)}`);
  }
  if (enrichPayload.how_found) {
    enrichLines.push(`Как узнали: ${label('how_found', enrichPayload.how_found)}`);
  }
  if (enrichPayload.budget) {
    enrichLines.push(`Бюджет: ${label('budget', enrichPayload.budget)}`);
  }
  if (enrichPayload.consent_recording) {
    enrichLines.push('Согласие на запись разговора: да');
  }

  if (!enrichLines.length) {
    return;
  }

  const comment = `${existingComments || ''}\n\n[Дозаполнение ${leadId}]\n${enrichLines.join('\n')}`;

  await callBitrix('crm.lead.update', {
    id: bitrixId,
    fields: {
      COMMENTS: comment.trim(),
    },
  });
}

function buildTelegramDialogComments(payload, leadId) {
  const lines = [
    `lead_id: ${leadId}`,
    `event: telegram_dialog`,
    `source_campaign: ${payload.source_campaign || 'direct_unknown'}`,
    `Telegram: ${payload.telegram || payload.contact || ''}`,
    `Первое сообщение: ${payload.first_message || ''}`,
    '',
    `source: ${buildSourceLabel(payload)}`,
    `landing_url: ${payload.landing_url || ''}`,
    `utm_source: ${payload.utm_source || ''}`,
    `utm_medium: ${payload.utm_medium || ''}`,
    `utm_campaign: ${payload.utm_campaign || ''}`,
    `yclid: ${payload.yclid || ''}`,
    `client_id: ${payload.client_id || ''}`,
  ];

  return lines.join('\n');
}

function buildTelegramDialogFields(payload, leadId) {
  const name = payload.name || 'Telegram-диалог';
  const title = `Telegram ${leadId.slice(0, 8)} — ${name}`;

  const fields = {
    TITLE: title,
    NAME: name,
    COMMENTS: buildTelegramDialogComments(payload, leadId),
    SOURCE_ID: 'TELEGRAM',
    OPENED: 'Y',
  };

  if (payload.telegram) {
    fields.IM = [{ VALUE: payload.telegram, VALUE_TYPE: 'TELEGRAM' }];
  }

  const ownerId = process.env.BITRIX_DEFAULT_OWNER_ID;
  if (ownerId) {
    fields.ASSIGNED_BY_ID = Number(ownerId);
  }

  applyMappedFields(fields, payload, leadId, getLeadFieldCodesMap());

  return fields;
}

async function createTelegramDialogLead(payload, leadId) {
  const fields = buildTelegramDialogFields(payload, leadId);
  const bitrixId = await callBitrix('crm.lead.add', { fields });
  return bitrixId;
}

async function appendTelegramDialogComment(bitrixId, payload, leadId, existingComments) {
  const lines = [
    `[telegram_dialog ${leadId}]`,
    `source_campaign: ${payload.source_campaign || 'direct_unknown'}`,
    `Telegram: ${payload.telegram || payload.contact || ''}`,
    `Первое сообщение: ${payload.first_message || ''}`,
    `Источник: ${buildSourceLabel(payload)}`,
    `client_id: ${payload.client_id || '—'}`,
    `yclid: ${payload.yclid || '—'}`,
  ];

  const comment = `${existingComments || ''}\n\n${lines.join('\n')}`.trim();

  await callBitrix('crm.lead.update', {
    id: bitrixId,
    fields: {
      COMMENTS: comment,
    },
  });
}

module.exports = {
  callBitrix,
  createLead,
  updateLead,
  appendDuplicateLeadComment,
  appendTelegramDialogComment,
  createTelegramDialogLead,
  getLeadComments,
  buildCommentsForStore,
};
