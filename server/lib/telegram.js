const { label } = require('./validation');

const TIMEOUT_MS = Number(process.env.EXTERNAL_TIMEOUT_MS) || 5000;

function getTelegramConfig() {
  return {
    token: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  };
}

async function telegramRequest(method, body) {
  const { token } = getTelegramConfig();
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN не настроен');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error');
    }

    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

function buildLeadMessage(payload, leadId, crmStatus) {
  const statusLine = crmStatus === 'created'
    ? '✅ создана'
    : '⚠ ошибка записи — завести вручную';

  return [
    `Новая заявка [lead_id: ${leadId}]`,
    `Имя: ${payload.name}`,
    `Контакт: ${payload.contact}`,
    `Роль: ${label('role', payload.role)}`,
    `Отрасль: ${label('industry', payload.industry)}`,
    `Выручка: ${label('revenue', payload.revenue)}`,
    `Вопрос: ${payload.question}`,
    `Срочность: ${label('urgency', payload.urgency)}`,
    `Источник: ${payload.utm_source || '—'}/${payload.utm_medium || '—'}`,
    `Кампания: ${payload.utm_campaign || '—'}`,
    `Страница: ${payload.landing_url || '—'}`,
    `Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
    `Статус CRM: ${statusLine}`,
  ].join('\n');
}

async function sendLeadMessage(payload, leadId, crmStatus) {
  const { chatId } = getTelegramConfig();
  if (!chatId) {
    throw new Error('TELEGRAM_CHAT_ID не настроен');
  }

  const text = buildLeadMessage(payload, leadId, crmStatus);
  const result = await telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
  });

  return {
    messageId: result.message_id,
    chatId: result.chat.id,
    text,
  };
}

async function editMessageMarkCrmOk(chatId, messageId, originalText) {
  const updatedText = originalText.replace(
    /Статус CRM: .+/,
    'Статус CRM: ✅ создана',
  );

  await telegramRequest('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text: updatedText,
  });
}

async function sendEnrichMessage(payload, leadId) {
  const { chatId } = getTelegramConfig();
  if (!chatId) {
    throw new Error('TELEGRAM_CHAT_ID не настроен');
  }

  const lines = [`Дозаполнение заявки [lead_id: ${leadId}]`];

  if (payload.legal_form) {
    lines.push(`Юрлицо/режим: ${label('legal_form', payload.legal_form)}`);
  }
  if (payload.sku_count) {
    lines.push(`SKU: ${label('sku_count', payload.sku_count)}`);
  }
  if (payload.accounting_system) {
    lines.push(`Учёт: ${label('accounting_system', payload.accounting_system)}`);
  }
  if (payload.data_availability) {
    lines.push(`Выгрузки: ${label('data_availability', payload.data_availability)}`);
  }
  if (payload.decision_maker) {
    lines.push(`Решение: ${label('decision_maker', payload.decision_maker)}`);
  }
  if (payload.desired_start) {
    lines.push(`Срок: ${label('desired_start', payload.desired_start)}`);
  }
  if (payload.how_found) {
    lines.push(`Источник: ${label('how_found', payload.how_found)}`);
  }
  if (payload.budget) {
    lines.push(`Бюджет: ${label('budget', payload.budget)}`);
  }
  if (payload.consent_recording) {
    lines.push('Согласие на запись: да');
  }

  await telegramRequest('sendMessage', {
    chat_id: chatId,
    text: lines.join('\n'),
  });
}

module.exports = {
  sendLeadMessage,
  editMessageMarkCrmOk,
  sendEnrichMessage,
};
