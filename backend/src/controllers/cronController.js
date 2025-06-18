const CronSettings = require('../models/cron');

exports.updateTime = async (req, res) => {
  try {
    const { cronTime } = req.body;
    if (!cronTime) {
      return res.status(400).json({ error: 'Cron time is required' });
    }

    let settings = await CronSettings.findOne();
    if (!settings) {
      settings = new CronSettings({ cronTime });
    } else {
      settings.cronTime = cronTime;
    }
    await settings.save();
    res.json({ message: 'Cron time updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCurrentTime = async (req, res) => {
  try {
    let settings = await CronSettings.findOne();
    if (!settings) {
      settings = new CronSettings({ cronTime: '0 2 * * *' });
      await settings.save();
    }
    res.json({ cronTime: settings.cronTime });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};