const {
  getConversionGoals,
  resolveIdentifiers,
  getDealById,
  isWonGoal,
} = require('./bitrixExport');
const { uploadConversions } = require('./metrikaOfflineConversions');
const { isExported, markExported } = require('./conversionExportStore');
const { logConversionExport } = require('./logger');

async function processDealConversion(deal, options) {
  const goals = getConversionGoals();
  const statusId = deal.STATUS_ID || options.statusId;
  const goal = goals[statusId];

  if (!goal) {
    return { status: 'skipped', reason: 'unknown_status', status_id: statusId };
  }

  const identifiers = await resolveIdentifiers(deal);
  if (!identifiers.leadId) {
    logConversionExport({
      status: 'skipped_deal',
      deal_id: deal.ID,
      goal,
      reason: 'нет lead_id',
      source: options.source,
    });
    return { status: 'skipped', reason: 'no_lead_id', deal_id: deal.ID };
  }

  if (isExported(identifiers.leadId, goal)) {
    return {
      status: 'duplicate',
      lead_id: identifiers.leadId,
      goal,
      deal_id: deal.ID,
    };
  }

  if (!identifiers.clientId && !identifiers.yclid) {
    logConversionExport({
      status: 'skipped_deal',
      deal_id: deal.ID,
      lead_id: identifiers.leadId,
      goal,
      reason: 'нет client_id и yclid',
      source: options.source,
    });
    return { status: 'skipped', reason: 'no_identifiers', lead_id: identifiers.leadId };
  }

  const row = {
    leadId: identifiers.leadId,
    dealId: deal.ID,
    goal,
    target: goal,
    clientId: identifiers.clientId,
    yclid: identifiers.yclid,
    dateTime: deal.DATE_MODIFY || new Date().toISOString(),
  };

  if (isWonGoal(goal)) {
    row.price = Number(deal.OPPORTUNITY) || 0;
  }

  const uploadResult = await uploadConversions([row]);
  markExported([{ leadId: identifiers.leadId, goal, dealId: deal.ID }]);

  logConversionExport({
    status: 'uploaded',
    source: options.source,
    deal_id: deal.ID,
    lead_id: identifiers.leadId,
    goal,
    uploaded: uploadResult.uploaded,
    batches: uploadResult.batches,
  });

  return {
    status: 'uploaded',
    lead_id: identifiers.leadId,
    goal,
    uploaded: uploadResult.uploaded,
  };
}

async function processDealIdConversion(dealId, statusId, source) {
  const deal = await getDealById(dealId);
  if (statusId) {
    deal.STATUS_ID = statusId;
  }
  return processDealConversion(deal, { source, statusId: deal.STATUS_ID });
}

module.exports = {
  processDealConversion,
  processDealIdConversion,
};
