const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CLICKS_FILE = path.join(DATA_DIR, 'telegram-clicks.json');
const TTL_MS = 24 * 60 * 60 * 1000;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readClicks() {
  ensureDataDir();
  if (!fs.existsSync(CLICKS_FILE)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(CLICKS_FILE, 'utf8'));
  } catch (error) {
    return {};
  }
}

function writeClicks(clicks) {
  ensureDataDir();
  fs.writeFileSync(CLICKS_FILE, JSON.stringify(clicks, null, 2), 'utf8');
}

function saveClick(clickId, meta) {
  const clicks = readClicks();
  clicks[clickId] = {
    ...meta,
    created_at: new Date().toISOString(),
  };
  writeClicks(clicks);
}

function consumeClick(clickId) {
  const clicks = readClicks();
  const entry = clicks[clickId];

  if (!entry) {
    return null;
  }

  delete clicks[clickId];
  writeClicks(clicks);

  const ageMs = Date.now() - new Date(entry.created_at).getTime();
  if (ageMs > TTL_MS) {
    return null;
  }

  return {
    source_campaign: entry.source_campaign,
    client_id: entry.client_id || '',
    yclid: entry.yclid || '',
    landing_url: entry.landing_url || '',
  };
}

module.exports = {
  saveClick,
  consumeClick,
};
