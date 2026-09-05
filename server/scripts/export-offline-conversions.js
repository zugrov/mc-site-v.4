require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const {
  getConversionGoals,
  listConvertedDeals,
} = require('../lib/bitrixExport');
const { processDealConversion } = require('../lib/processConversion');
const {
  getLastRunAt,
  setLastRunAt,
} = require('../lib/conversionExportStore');
const { logConversionExport } = require('../lib/logger');

function getDefaultSinceIso() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

async function runExport() {
  const goals = getConversionGoals();
  const goalCount = Object.keys(goals).length;

  if (!goalCount) {
    logConversionExport({
      status: 'skipped',
      reason: 'BITRIX_CONVERSION_GOALS пуст',
    });
    console.log('Экспорт пропущен: BITRIX_CONVERSION_GOALS не настроен');
    return;
  }

  const sinceIso = getLastRunAt(getDefaultSinceIso());
  const runStartedAt = new Date().toISOString();

  logConversionExport({
    status: 'started',
    source: 'nightly',
    since: sinceIso,
    goals: goalCount,
  });

  const deals = await listConvertedDeals(sinceIso);
  let uploaded = 0;
  let skippedDuplicate = 0;
  let skippedNoIdentifiers = 0;
  let skippedNoLeadId = 0;

  for (const deal of deals) {
    const result = await processDealConversion(deal, { source: 'nightly' });

    if (result.status === 'uploaded') {
      uploaded += result.uploaded || 1;
    } else if (result.status === 'duplicate') {
      skippedDuplicate += 1;
    } else if (result.reason === 'no_identifiers') {
      skippedNoIdentifiers += 1;
    } else if (result.reason === 'no_lead_id') {
      skippedNoLeadId += 1;
    }
  }

  setLastRunAt(runStartedAt);

  logConversionExport({
    status: 'completed',
    source: 'nightly',
    since: sinceIso,
    deals_found: deals.length,
    uploaded,
    skipped_duplicate: skippedDuplicate,
    skipped_no_identifiers: skippedNoIdentifiers,
    skipped_no_lead_id: skippedNoLeadId,
  });

  console.log(`Экспорт завершён: сделок ${deals.length}, отправлено ${uploaded}`);
}

runExport().catch(function (error) {
  logConversionExport({
    status: 'failed',
    source: 'nightly',
    error: error.message,
  });
  console.error('Ошибка экспорта офлайн-конверсий:', error.message);
  process.exit(1);
});
