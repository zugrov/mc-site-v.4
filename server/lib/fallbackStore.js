const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FAILED_LOG = path.join(DATA_DIR, 'failed-leads.log');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function saveFailedLead(payload) {
  ensureDataDir();
  const line = JSON.stringify({
    ...payload,
    saved_at: new Date().toISOString(),
  });
  fs.appendFileSync(FAILED_LOG, `${line}\n`, 'utf8');
}

module.exports = {
  saveFailedLead,
};
