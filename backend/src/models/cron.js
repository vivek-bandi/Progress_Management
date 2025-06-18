const mongoose = require('mongoose');
const cronSchema = new mongoose.Schema({
  cronTime : String,
});

module.exports = mongoose.model('CronSettings',cronSchema);