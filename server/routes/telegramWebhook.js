const express = require('express');

const { parseStartPayload } = require('../lib/telegramSources');
const { handleTelegramDialog } = require('../lib/telegramDialog');
const { findRecentByKey, buildTelegramContactKey } = require('../lib/contactsIndex');

const router = express.Router();

function getWebhookSecret() {
  return process.env.TELEGRAM_WEBHOOK_SECRET || '';
}

router.post('/telegram/webhook/:secret', async (req, res) => {
  const expectedSecret = getWebhookSecret();
  if (!expectedSecret || req.params.secret !== expectedSecret) {
    return res.status(404).json({ status: 'not_found' });
  }

  const message = req.body?.message;
  if (!message || !message.text) {
    return res.json({ status: 'ok' });
  }

  const text = message.text.trim();
  const isStart = text.startsWith('/start');

  if (!isStart) {
    const contactKey = buildTelegramContactKey(
      message.from?.username,
      message.from?.id,
    );
    if (findRecentByKey(contactKey)) {
      return res.json({ status: 'ok' });
    }
  }

  let sourceCampaign = 'direct_unknown';
  let clickId = null;

  if (isStart) {
    const rawPayload = text.slice(6).trim();
    const parsed = parseStartPayload(rawPayload);
    sourceCampaign = parsed.source_campaign || 'direct_unknown';
    clickId = parsed.click_id;
  }

  try {
    await handleTelegramDialog(message, {
      sourceCampaign,
      clickId,
    });
  } catch (error) {
    console.error('telegram webhook error:', error);
  }

  return res.json({ status: 'ok' });
});

module.exports = router;
