require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');

const leadRouter = require('./routes/lead');
const bitrixWebhookRouter = require('./routes/bitrixWebhook');
const telegramClickRouter = require('./routes/telegramClick');
const telegramWebhookRouter = require('./routes/telegramWebhook');

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));

app.use('/api/internal', bitrixWebhookRouter);
app.use('/api', telegramClickRouter);
app.use('/api', telegramWebhookRouter);
app.use('/api', leadRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Не получилось отправить заявку. Попробуйте ещё раз через минуту — или напишите нам напрямую в Telegram: https://t.me/maxima_consulting_leed_bot?start=fallback_error',
  });
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Lead API listening on port ${PORT}`);
});
