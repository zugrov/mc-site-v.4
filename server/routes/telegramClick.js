const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const { saveClick } = require('../lib/telegramClicks');

const router = express.Router();

const clickSchema = z.object({
  click_id: z.string().min(4).max(32),
  source_campaign: z.string().min(1).max(64),
  client_id: z.string().max(128).optional(),
  yclid: z.string().max(128).optional(),
  landing_url: z.string().max(2048).optional(),
});

router.post('/telegram-click', rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Слишком много запросов' },
}), (req, res) => {
  const parsed = clickSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Некорректные параметры клика',
    });
  }

  const data = parsed.data;
  saveClick(data.click_id, {
    source_campaign: data.source_campaign,
    client_id: data.client_id || '',
    yclid: data.yclid || '',
    landing_url: data.landing_url || '',
  });

  return res.json({ status: 'ok' });
});

module.exports = router;
