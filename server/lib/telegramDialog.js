const { generateLeadId } = require('./leadId');
const {
  createTelegramDialogLead,
  appendTelegramDialogComment,
  getLeadComments,
} = require('./bitrix');
const { sendWelcomeMessage, notifyManagerNewDialog } = require('./telegram');
const {
  findRecentByKey,
  upsertByKey,
  buildTelegramContactKey,
} = require('./contactsIndex');
const { getSourceConfig } = require('./telegramSources');
const { consumeClick } = require('./telegramClicks');
const { uploadConversions } = require('./metrikaOfflineConversions');
const { isExported, markExported } = require('./conversionExportStore');
const { logLeadAttempt, logConversionExport } = require('./logger');
const { saveLeadMeta } = require('./leadStore');

const TELEGRAM_DIALOG_GOAL = 'telegram_dialog';
const processedChats = new Map();
const DEDUP_TTL_MS = 60 * 1000;

function isRecentlyProcessed(chatId) {
  const lastAt = processedChats.get(chatId);
  if (!lastAt) {
    return false;
  }

  if (Date.now() - lastAt > DEDUP_TTL_MS) {
    processedChats.delete(chatId);
    return false;
  }

  return true;
}

function markProcessed(chatId) {
  processedChats.set(chatId, Date.now());
}

function buildDialogPayload(message, sourceCampaign, clickData) {
  const sourceConfig = getSourceConfig(sourceCampaign);
  const username = message.from?.username;
  const userId = message.from?.id;
  const firstName = message.from?.first_name || '';
  const telegram = username ? `@${username}` : `id:${userId}`;

  return {
    name: firstName || telegram,
    contact: telegram,
    telegram,
    source_campaign: sourceConfig.source_campaign || sourceCampaign,
    utm_source: sourceConfig.utm_source || '',
    utm_medium: sourceConfig.utm_medium || '',
    utm_campaign: sourceConfig.utm_campaign || '',
    landing_url: clickData?.landing_url || '',
    client_id: clickData?.client_id || '',
    yclid: clickData?.yclid || '',
    first_message: message.text || '',
    page_label: sourceConfig.page_label || 'сайта',
  };
}

async function exportTelegramDialogConversion(leadId, payload) {
  if (!payload.client_id && !payload.yclid) {
    return { status: 'skipped', reason: 'no_identifiers' };
  }

  if (isExported(leadId, TELEGRAM_DIALOG_GOAL)) {
    return { status: 'duplicate', lead_id: leadId, goal: TELEGRAM_DIALOG_GOAL };
  }

  const row = {
    leadId,
    target: TELEGRAM_DIALOG_GOAL,
    clientId: payload.client_id,
    yclid: payload.yclid,
    dateTime: new Date().toISOString(),
  };

  const uploadResult = await uploadConversions([row]);
  markExported([{ leadId, goal: TELEGRAM_DIALOG_GOAL }]);

  logConversionExport({
    status: 'uploaded',
    source: 'telegram_dialog',
    lead_id: leadId,
    goal: TELEGRAM_DIALOG_GOAL,
    uploaded: uploadResult.uploaded,
    batches: uploadResult.batches,
  });

  return {
    status: 'uploaded',
    lead_id: leadId,
    goal: TELEGRAM_DIALOG_GOAL,
    uploaded: uploadResult.uploaded,
  };
}

async function handleTelegramDialog(message, options) {
  const chatId = message.chat?.id;
  const username = message.from?.username;
  const userId = message.from?.id;

  if (!chatId || !userId) {
    return { status: 'ignored', reason: 'missing_chat_or_user' };
  }

  if (isRecentlyProcessed(chatId)) {
    return { status: 'ignored', reason: 'duplicate_update' };
  }

  markProcessed(chatId);

  const sourceCampaign = options.sourceCampaign || 'direct_unknown';
  const clickData = options.clickId ? consumeClick(options.clickId) : null;
  const payload = buildDialogPayload(message, sourceCampaign, clickData);
  const contactKey = buildTelegramContactKey(username, userId);
  const leadId = generateLeadId();

  let crmStatus = 'failed';
  let bitrixId = null;
  let bitrixError = null;
  let telegramError = null;
  let conversionError = null;

  const duplicate = findRecentByKey(contactKey);

  if (duplicate) {
    try {
      const existingComments = await getLeadComments(duplicate.bitrix_id);
      await appendTelegramDialogComment(
        duplicate.bitrix_id,
        payload,
        leadId,
        existingComments,
      );
      bitrixId = duplicate.bitrix_id;
      crmStatus = 'duplicate';
    } catch (error) {
      bitrixError = error.message;
    }
  } else {
    try {
      bitrixId = await createTelegramDialogLead(payload, leadId);
      crmStatus = 'created';
      upsertByKey(contactKey, {
        lead_id: leadId,
        bitrix_id: bitrixId,
      });
    } catch (error) {
      bitrixError = error.message;
    }
  }

  try {
    await sendWelcomeMessage(chatId, payload.page_label);
  } catch (error) {
    telegramError = error.message;
  }

  try {
    await notifyManagerNewDialog(payload, leadId, crmStatus);
  } catch (error) {
    telegramError = telegramError || error.message;
  }

  if (crmStatus === 'created' || crmStatus === 'duplicate') {
    try {
      await exportTelegramDialogConversion(leadId, payload);
    } catch (error) {
      conversionError = error.message;
    }
  }

  saveLeadMeta(leadId, {
    bitrix_id: bitrixId,
    payload,
    duplicate_of: duplicate?.lead_id || null,
    channel: 'telegram_dialog',
  });

  logLeadAttempt({
    event: 'telegram_dialog',
    lead_id: leadId,
    crm_status: crmStatus,
    bitrix_id: bitrixId,
    bitrix_error: bitrixError,
    telegram_error: telegramError,
    conversion_error: conversionError,
    duplicate_of: duplicate?.lead_id || null,
    source_campaign: payload.source_campaign,
    click_id: options.clickId || null,
    chat_id: chatId,
    telegram_user_id: userId,
  });

  return {
    status: 'ok',
    lead_id: leadId,
    crm_status: crmStatus,
  };
}

module.exports = {
  handleTelegramDialog,
};
