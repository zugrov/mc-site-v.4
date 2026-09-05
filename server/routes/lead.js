const express = require('express');
const rateLimit = require('express-rate-limit');

const { generateLeadId, generateFakeLeadId } = require('../lib/leadId');
const {
  leadStep1Schema,
  leadStep2Schema,
  formatValidationError,
} = require('../lib/validation');
const {
  createLead,
  updateLead,
  appendDuplicateLeadComment,
  getLeadComments,
  buildCommentsForStore,
} = require('../lib/bitrix');
const {
  sendLeadMessage,
  editMessageMarkCrmOk,
  sendEnrichMessage,
  notifyManagerNewTask,
} = require('../lib/telegram');
const { logLeadAttempt } = require('../lib/logger');
const { saveFailedLead } = require('../lib/fallbackStore');
const { saveLeadMeta, getLeadMeta } = require('../lib/leadStore');
const { findRecent, upsert } = require('../lib/contactsIndex');
const { getSlaDeadline } = require('../lib/businessHours');
const { createFirstContactTask } = require('../lib/bitrixTasks');
const { saveTask } = require('../lib/slaStore');

const router = express.Router();

function getClientIp(req) {
  return req.ip || req.headers['x-forwarded-for'] || 'unknown';
}

async function handleSlaWorkflow(bitrixId, leadId, payload) {
  const deadlineIso = getSlaDeadline(new Date());
  const ownerId = process.env.BITRIX_DEFAULT_OWNER_ID;

  const taskId = await createFirstContactTask({
    bitrixLeadId: bitrixId,
    leadId,
    payload,
    deadlineIso,
    ownerId,
  });

  await notifyManagerNewTask(payload, leadId, deadlineIso);

  saveTask({
    lead_id: leadId,
    bitrix_id: bitrixId,
    bitrix_task_id: taskId,
    name: payload.name,
    deadline: deadlineIso,
    escalated: false,
    completed: false,
  });
}

router.post('/lead', rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Не получилось отправить заявку. Попробуйте ещё раз через минуту — или напишите нам напрямую в Telegram: https://t.me/maxima_consulting_leed_bot?start=fallback_error',
  },
}), async (req, res) => {
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
  let slaError = null;

  const duplicate = findRecent(payload.contact);

  if (duplicate) {
    try {
      const existingComments = await getLeadComments(duplicate.bitrix_id);
      await appendDuplicateLeadComment(
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
      bitrixId = await createLead(payload, leadId);
      crmStatus = 'created';
      upsert(payload.contact, {
        lead_id: leadId,
        bitrix_id: bitrixId,
      });
    } catch (error) {
      bitrixError = error.message;
    }
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

  if (crmStatus === 'created' && bitrixId) {
    try {
      await handleSlaWorkflow(bitrixId, leadId, payload);
    } catch (error) {
      slaError = error.message;
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
    duplicate_of: duplicate?.lead_id || null,
  });

  logLeadAttempt({
    lead_id: leadId,
    crm_status: crmStatus,
    bitrix_id: bitrixId,
    bitrix_error: bitrixError,
    telegram_error: telegramError,
    sla_error: slaError,
    duplicate_of: duplicate?.lead_id || null,
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
