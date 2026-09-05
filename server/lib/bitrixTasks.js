const { callBitrix } = require('./bitrix');

function buildSourceLabel(payload) {
  const source = payload.utm_source || 'direct';
  const medium = payload.utm_medium || 'form';
  return `${source}/${medium}`;
}

function buildTaskTitle(payload, leadId) {
  return `Первый контакт с лидом ${payload.name} [${leadId.slice(0, 8)}]`;
}

function buildTaskDescription(payload, leadId) {
  return [
    `Связаться с новым лидом ${payload.name} по заявке ${leadId}.`,
    `Источник: ${buildSourceLabel(payload)}.`,
    `Главный вопрос: ${payload.question}.`,
  ].join('\n');
}

async function createFirstContactTask(options) {
  const {
    bitrixLeadId,
    leadId,
    payload,
    deadlineIso,
    ownerId,
  } = options;

  const responsibleId = ownerId || process.env.BITRIX_DEFAULT_OWNER_ID;
  if (!responsibleId) {
    throw new Error('BITRIX_DEFAULT_OWNER_ID не настроен');
  }

  const fields = {
    TITLE: buildTaskTitle(payload, leadId),
    DESCRIPTION: buildTaskDescription(payload, leadId),
    RESPONSIBLE_ID: Number(responsibleId),
    DEADLINE: deadlineIso,
    UF_CRM_TASK: [`L_${bitrixLeadId}`],
  };

  const result = await callBitrix('tasks.task.add', { fields });
  return result.task?.id || result.id || result;
}

async function getTaskStatus(taskId) {
  const result = await callBitrix('tasks.task.get', { taskId });
  const task = result.task || result;
  return {
    status: Number(task.status || task.STATUS),
    realStatus: Number(task.realStatus || task.REAL_STATUS || task.status),
  };
}

function isTaskCompleted(statusInfo) {
  const status = statusInfo.realStatus || statusInfo.status;
  return status === 5;
}

module.exports = {
  createFirstContactTask,
  getTaskStatus,
  isTaskCompleted,
};
