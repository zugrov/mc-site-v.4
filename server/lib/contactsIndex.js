const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const INDEX_FILE = path.join(DATA_DIR, 'contacts-index.json');
const DEFAULT_DAYS = 30;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readIndex() {
  ensureDataDir();
  if (!fs.existsSync(INDEX_FILE)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  } catch (error) {
    return {};
  }
}

function writeIndex(index) {
  ensureDataDir();
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf8');
}

function normalizeContact(contact) {
  const trimmed = contact.trim();

  if (trimmed.startsWith('@')) {
    return `tg:${trimmed.toLowerCase()}`;
  }

  if (/t\.me/i.test(trimmed)) {
    const match = trimmed.match(/t\.me\/([a-zA-Z0-9_]+)/i);
    if (match) {
      return `tg:@${match[1].toLowerCase()}`;
    }
  }

  let digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    digits = `7${digits}`;
  }

  return digits ? `phone:${digits}` : `raw:${trimmed.toLowerCase()}`;
}

function findRecent(contact, days) {
  const periodDays = days || DEFAULT_DAYS;
  const key = normalizeContact(contact);
  const index = readIndex();
  const entry = index[key];

  if (!entry) {
    return null;
  }

  const ageMs = Date.now() - new Date(entry.updated_at).getTime();
  if (ageMs > periodDays * 24 * 60 * 60 * 1000) {
    return null;
  }

  return {
    lead_id: entry.lead_id,
    bitrix_id: entry.bitrix_id,
    updated_at: entry.updated_at,
  };
}

function upsert(contact, meta) {
  const key = normalizeContact(contact);
  upsertByKey(key, meta);
}

function findRecentByKey(key, days) {
  const periodDays = days || DEFAULT_DAYS;
  const index = readIndex();
  const entry = index[key];

  if (!entry) {
    return null;
  }

  const ageMs = Date.now() - new Date(entry.updated_at).getTime();
  if (ageMs > periodDays * 24 * 60 * 60 * 1000) {
    return null;
  }

  return {
    lead_id: entry.lead_id,
    bitrix_id: entry.bitrix_id,
    updated_at: entry.updated_at,
  };
}

function upsertByKey(key, meta) {
  const index = readIndex();
  index[key] = {
    ...meta,
    updated_at: new Date().toISOString(),
  };
  writeIndex(index);
}

function buildTelegramContactKey(username, userId) {
  if (username) {
    return `tg:@${username.toLowerCase()}`;
  }
  return `tg:id:${userId}`;
}

module.exports = {
  findRecent,
  upsert,
  normalizeContact,
  findRecentByKey,
  upsertByKey,
  buildTelegramContactKey,
};
