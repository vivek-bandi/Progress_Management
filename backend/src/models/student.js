const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name : String,
  email : String,
  phone : Number,
  cfHandle : Number,
  currentRating : Number,
  maxRating : Number,
  cfLastUpdated : Date,
  emailCount : {
    type : Number,
    default : 0
  },
  emailRemainderDisable :{
    type : Boolean,
    default : false
  }
},{timestamps : true});

module.exports = mongoose.Model('Student',studentSchema);