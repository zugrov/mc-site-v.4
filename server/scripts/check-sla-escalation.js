require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const {
  getOverdueOpenTasks,
  markEscalated,
  markCompleted,
} = require('../lib/slaStore');
const {
  getTaskStatus,
  isTaskCompleted,
} = require('../lib/bitrixTasks');
const { notifySlaEscalation } = require('../lib/telegram');
const { logLeadAttempt } = require('../lib/logger');

async function runEscalationCheck() {
  const overdueTasks = getOverdueOpenTasks(new Date().toISOString());

  if (!overdueTasks.length) {
    console.log('SLA-проверка: просроченных задач нет');
    return;
  }

  for (const task of overdueTasks) {
    try {
      if (task.bitrix_task_id) {
        const statusInfo = await getTaskStatus(task.bitrix_task_id);
        if (isTaskCompleted(statusInfo)) {
          markCompleted(task.lead_id);
          continue;
        }
      }

      await notifySlaEscalation(task);
      markEscalated(task.lead_id);

      logLeadAttempt({
        event: 'sla_escalation',
        lead_id: task.lead_id,
        bitrix_task_id: task.bitrix_task_id,
        deadline: task.deadline,
      });
    } catch (error) {
      logLeadAttempt({
        event: 'sla_escalation_error',
        lead_id: task.lead_id,
        error: error.message,
      });
    }
  }

  console.log(`SLA-проверка завершена: эскалаций ${overdueTasks.length}`);
}

runEscalationCheck().catch(function (error) {
  console.error('Ошибка SLA-проверки:', error.message);
  process.exit(1);
});
