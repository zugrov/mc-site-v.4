const express = require('express');
const rateLimit = require('express-rate-limit');

const { generateLeadId, generateFakeLeadId } = require('../lib/leadId');
const {
  leadStep1Schema,
  leadStep2Schema,
  formatValidationError,
} = require('../lib/validation');
const { createLead, updateLead, buildCommentsForStore } = require('../lib/bitrix');
const {
  sendLeadMessage,
  editMessageMarkCrmOk,
  sendEnrichMessage,
} = require('../lib/telegram');
const { logLeadAttempt } = require('../lib/logger');
const { saveFailedLead } = require('../lib/fallbackStore');
const { saveLeadMeta, getLeadMeta } = require('../lib/leadStore');

const router = express.Router();

function getClientIp(req) {
  return req.ip || req.headers['x-forwarded-for'] || 'unknown';
}

router.post('/lead', async (req, res) => {
  const body = {
    ...req.body,
    user_agent: req.headers['user-agent'] || '',
  };

  if (body.middle_name && body.middle_name.trim()) {
    return res.json({
      status: 'ok',
      lead_id: generateFakeLeadId(),
      crm_status: 'created',
    });
  }

  const parsed = leadStep1Schema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: formatValidationError(parsed.error),
    });
  }

  const payload = parsed.data;
  const leadId = generateLeadId();
  const timestamp = new Date().toISOString();
  let crmStatus = 'failed';
  let bitrixId = null;
  let telegramResult = null;
  let bitrixError = null;
  let telegramError = null;

  try {
    bitrixId = await createLead(payload, leadId);
    crmStatus = 'created';
  } catch (error) {
    bitrixError = error.message;
  }

  try {
    telegramResult = await sendLeadMessage(payload, leadId, crmStatus);
  } catch (error) {
    telegramError = error.message;
  }

  if (crmStatus === 'created' && telegramResult) {
    try {
      await editMessageMarkCrmOk(
        telegramResult.chatId,
        telegramResult.messageId,
        telegramResult.text,
      );
    } catch (error) {
      // Не блокируем ответ пользователю
    }
  }

  if (!bitrixId && !telegramResult) {
    saveFailedLead({
      lead_id: leadId,
      payload,
      bitrix_error: bitrixError,
      telegram_error: telegramError,
      ip: getClientIp(req),
    });
  }

  saveLeadMeta(leadId, {
    bitrix_id: bitrixId,
    telegram_message_id: telegramResult?.messageId,
    telegram_chat_id: telegramResult?.chatId,
    payload,
    comments: buildCommentsForStore(payload, leadId),
  });

  logLeadAttempt({
    lead_id: leadId,
    crm_status: crmStatus,
    bitrix_id: bitrixId,
    bitrix_error: bitrixError,
    telegram_error: telegramError,
    ip: getClientIp(req),
    timestamp,
    fast_submit: payload.fast_submit || false,
  });

  return res.json({
    status: 'ok',
    lead_id: leadId,
    crm_status: crmStatus,
  });
});

router.post('/lead/:leadId/enrich', async (req, res) => {
  const { leadId } = req.params;
  const parsed = leadStep2Schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: formatValidationError(parsed.error),
    });
  }

  const enrichPayload = parsed.data;
  const meta = getLeadMeta(leadId);

  logLeadAttempt({
    lead_id: leadId,
    event: 'enrich',
    enrich: enrichPayload,
  });

  if (meta?.bitrix_id) {
    try {
      await updateLead(meta.bitrix_id, enrichPayload, leadId, meta.comments);
    } catch (error) {
      logLeadAttempt({
        lead_id: leadId,
        event: 'enrich_bitrix_error',
        error: error.message,
      });
    }
  }

  try {
    await sendEnrichMessage(enrichPayload, leadId);
  } catch (error) {
    logLeadAttempt({
      lead_id: leadId,
      event: 'enrich_telegram_error',
      error: error.message,
    });
  }

  return res.json({ status: 'ok' });
});

module.exports = router;
