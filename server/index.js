require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const rateLimit = require('express-rate-limit');

const leadRouter = require('./routes/lead');

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));

app.use('/api/', rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Не получилось отправить заявку. Попробуйте ещё раз через минуту — или напишите нам напрямую в Telegram: https://t.me/maxima_cfo',
  },
}));

app.use('/api', leadRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Не получилось отправить заявку. Попробуйте ещё раз через минуту — или напишите нам напрямую в Telegram: https://t.me/maxima_cfo',
  });
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Lead API listening on port ${PORT}`);
});
