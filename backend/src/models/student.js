const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name : String,
  email : String,
  phone : Number,
  cfHandle : String,
  currentRating : Number,
  maxRating : Number,
  cfLastUpdated : Date,
  emailCount : {
    type : Number,
    default : 0
  },
  emailReminderDisable :{
    type : Boolean,
    default : false
  }
},{timestamps : true});

module.exports = mongoose.model('Student',studentSchema);