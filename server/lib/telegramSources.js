const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'telegram-sources.json');

const FALLBACK = {
  utm_source: 'telegram',
  utm_medium: 'direct',
  utm_campaign: '',
  page_label: 'сайта',
};

let cachedConfig = null;

function loadConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    cachedConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (error) {
    cachedConfig = {};
  }

  return cachedConfig;
}

function getSourceConfig(code) {
  const config = loadConfig();
  const entry = config[code];

  if (!entry) {
    return {
      ...FALLBACK,
      source_campaign: code || 'direct_unknown',
      page_label: 'сайта (источник неизвестен)',
    };
  }

  return {
    ...entry,
    source_campaign: code,
  };
}

function parseStartPayload(rawPayload) {
  if (!rawPayload || !rawPayload.trim()) {
    return {
      source_campaign: 'direct_unknown',
      click_id: null,
    };
  }

  const trimmed = rawPayload.trim();
  const dashIndex = trimmed.lastIndexOf('-');

  if (dashIndex <= 0) {
    return {
      source_campaign: trimmed,
      click_id: null,
    };
  }

  const sourceCampaign = trimmed.slice(0, dashIndex);
  const clickId = trimmed.slice(dashIndex + 1);

  if (!clickId || clickId.length < 4) {
    return {
      source_campaign: trimmed,
      click_id: null,
    };
  }

  return {
    source_campaign: sourceCampaign,
    click_id: clickId,
  };
}

module.exports = {
  getSourceConfig,
  parseStartPayload,
};
