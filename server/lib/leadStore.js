const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const INDEX_FILE = path.join(DATA_DIR, 'leads-index.json');

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

function saveLeadMeta(leadId, meta) {
  const index = readIndex();
  index[leadId] = {
    ...meta,
    updated_at: new Date().toISOString(),
  };
  writeIndex(index);
}

function getLeadMeta(leadId) {
  const index = readIndex();
  return index[leadId] || null;
}

module.exports = {
  saveLeadMeta,
  getLeadMeta,
};
