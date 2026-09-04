const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_FILE = path.join(DATA_DIR, 'conversion-export-state.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readState() {
  ensureDataDir();
  if (!fs.existsSync(STATE_FILE)) {
    return {
      last_run_at: null,
      exported: {},
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return {
      last_run_at: parsed.last_run_at || null,
      exported: parsed.exported && typeof parsed.exported === 'object' ? parsed.exported : {},
    };
  } catch (error) {
    return {
      last_run_at: null,
      exported: {},
    };
  }
}

function writeState(state) {
  ensureDataDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function isExported(dealId, goal) {
  const state = readState();
  return Boolean(state.exported[`${dealId}:${goal}`]);
}

function markExported(entries) {
  const state = readState();
  entries.forEach(function (entry) {
    state.exported[`${entry.dealId}:${entry.goal}`] = {
      exported_at: new Date().toISOString(),
      deal_id: entry.dealId,
      goal: entry.goal,
    };
  });
  writeState(state);
}

function setLastRunAt(isoDate) {
  const state = readState();
  state.last_run_at = isoDate;
  writeState(state);
}

function getLastRunAt(defaultIso) {
  const state = readState();
  return state.last_run_at || defaultIso;
}

module.exports = {
  getLastRunAt,
  isExported,
  markExported,
  setLastRunAt,
};
