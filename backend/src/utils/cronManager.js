const cron = require('node-cron');
const CronSettings = require('../models/cron');
const { fetchAndStoreCFData } = require('./cfService');
const { notifyInactiveStudents } = require('./inactivityNotifier');

let cronJob = null;

async function startCronJob() {
  const settings = await CronSettings.findOne();
  const cronTime = settings ? settings.cronTime : '0 2 * * *';

  if (cronJob) {
    cronJob.stop();
  }

  cronJob = cron.schedule(cronTime, async () => {
    await fetchAndStoreCFData();
    await notifyInactiveStudents();
  }, { scheduled: true });
}

module.exports = { startCronJob };