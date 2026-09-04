const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LEADS_LOG = path.join(DATA_DIR, 'leads.log');
const CONVERSION_EXPORT_LOG = path.join(DATA_DIR, 'conversion-export.log');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function logLeadAttempt(entry) {
  ensureDataDir();
  const line = JSON.stringify({
    ...entry,
    logged_at: new Date().toISOString(),
  });
  fs.appendFileSync(LEADS_LOG, `${line}\n`, 'utf8');
}

function logConversionExport(entry) {
  ensureDataDir();
  const line = JSON.stringify({
    ...entry,
    logged_at: new Date().toISOString(),
  });
  fs.appendFileSync(CONVERSION_EXPORT_LOG, `${line}\n`, 'utf8');
}

module.exports = {
  logLeadAttempt,
  logConversionExport,
};
