require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const { processDealIdConversion } = require('../lib/processConversion');
const { logConversionExport } = require('../lib/logger');

const router = express.Router();

function isAuthorized(req) {
  const secret = process.env.BITRIX_WEBHOOK_SECRET;
  if (!secret) {
    return false;
  }
  return req.query.secret === secret;
}

router.post('/bitrix-webhook', async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const dealId = req.body.deal_id || req.body.dealId;
  const statusId = req.body.status_id || req.body.statusId;

  if (!dealId) {
    return res.status(400).json({ status: 'error', message: 'deal_id обязателен' });
  }

  try {
    const result = await processDealIdConversion(dealId, statusId, 'webhook');
    return res.json({
      status: 'ok',
      result,
    });
  } catch (error) {
    logConversionExport({
      status: 'failed',
      source: 'webhook',
      deal_id: dealId,
      status_id: statusId,
      error: error.message,
    });
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
