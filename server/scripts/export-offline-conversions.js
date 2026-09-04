require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const {
  getConversionGoals,
  listConvertedDeals,
  resolveIdentifiers,
} = require('../lib/bitrixExport');
const { uploadConversions } = require('../lib/metrikaOfflineConversions');
const {
  getLastRunAt,
  isExported,
  markExported,
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
    since: sinceIso,
    goals: goalCount,
  });

  const deals = await listConvertedDeals(sinceIso);
  const pendingRows = [];
  const exportedEntries = [];
  let skippedDuplicate = 0;
  let skippedNoIdentifiers = 0;

  for (const deal of deals) {
    const goal = goals[deal.STATUS_ID];
    if (!goal) {
      continue;
    }

    if (isExported(deal.ID, goal)) {
      skippedDuplicate += 1;
      continue;
    }

    const identifiers = await resolveIdentifiers(deal);
    if (!identifiers.clientId && !identifiers.yclid) {
      skippedNoIdentifiers += 1;
      logConversionExport({
        status: 'skipped_deal',
        deal_id: deal.ID,
        goal,
        reason: 'нет client_id и yclid',
      });
      continue;
    }

    pendingRows.push({
      dealId: deal.ID,
      goal,
      target: goal,
      clientId: identifiers.clientId,
      yclid: identifiers.yclid,
      dateTime: deal.DATE_MODIFY,
    });
  }

  if (!pendingRows.length) {
    setLastRunAt(runStartedAt);
    logConversionExport({
      status: 'completed',
      since: sinceIso,
      deals_found: deals.length,
      uploaded: 0,
      skipped_duplicate: skippedDuplicate,
      skipped_no_identifiers: skippedNoIdentifiers,
    });
    console.log(`Экспорт завершён: сделок ${deals.length}, отправлено 0`);
    return;
  }

  const uploadResult = await uploadConversions(pendingRows);

  pendingRows.forEach(function (row) {
    exportedEntries.push({
      dealId: row.dealId,
      goal: row.goal,
    });
  });

  markExported(exportedEntries);
  setLastRunAt(runStartedAt);

  logConversionExport({
    status: 'completed',
    since: sinceIso,
    deals_found: deals.length,
    uploaded: uploadResult.uploaded,
    batches: uploadResult.batches,
    skipped_duplicate: skippedDuplicate,
    skipped_no_identifiers: skippedNoIdentifiers,
  });

  console.log(
    `Экспорт завершён: сделок ${deals.length}, отправлено ${uploadResult.uploaded}`
  );
}

runExport().catch(function (error) {
  logConversionExport({
    status: 'failed',
    error: error.message,
  });
  console.error('Ошибка экспорта офлайн-конверсий:', error.message);
  process.exit(1);
});
