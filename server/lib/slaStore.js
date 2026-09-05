const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'sla-tasks.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore() {
  ensureDataDir();
  if (!fs.existsSync(STORE_FILE)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
  } catch (error) {
    return {};
  }
}

function writeStore(store) {
  ensureDataDir();
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function saveTask(entry) {
  const store = readStore();
  store[entry.lead_id] = {
    ...entry,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
}

function getTask(leadId) {
  const store = readStore();
  return store[leadId] || null;
}

function getOverdueOpenTasks(nowIso) {
  const store = readStore();
  const now = new Date(nowIso || Date.now()).getTime();

  return Object.values(store).filter(function (task) {
    if (task.escalated || task.completed) {
      return false;
    }
    return new Date(task.deadline).getTime() <= now;
  });
}

function markEscalated(leadId) {
  const store = readStore();
  if (!store[leadId]) {
    return;
  }
  store[leadId].escalated = true;
  store[leadId].escalated_at = new Date().toISOString();
  writeStore(store);
}

function markCompleted(leadId) {
  const store = readStore();
  if (!store[leadId]) {
    return;
  }
  store[leadId].completed = true;
  store[leadId].completed_at = new Date().toISOString();
  writeStore(store);
}

module.exports = {
  saveTask,
  getTask,
  getOverdueOpenTasks,
  markEscalated,
  markCompleted,
};
