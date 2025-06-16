const mongoose = require('mongoose');
const cronSchema = new mongoose.Schema({
  cronTime : String,
  frequency : {
    type : String,
    default : 'daily'
  }
});

module.exports = mongoose.model('CronSettings',cronSchema);