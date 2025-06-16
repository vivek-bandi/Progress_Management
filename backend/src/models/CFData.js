const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  //context from https://codeforces.com/api/user.rating?handle=Fefer_Ivan code forces api
  contestId : Number,
  contestName : String,
  rank : Number,
  oldRating : Number,
  newRating : Number,
  ratingChange : Number,
  contestDate : Date,
  problemsUnsolved : Number,
});
const problemSchema = new mongoose.Schema({
  problemId : String,
  rating : Number,
  solvedDate : Date
});
const cfDataSchema = new mongoose.Schema({
  //context from https://codeforces.com/api/user.status?handle=Fefer_Ivan code forces api
  studentId : { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  ratingHistory : [contestSchema],
  problemStats : [problemSchema],
  lastSync : Date,
});

module.exports = mongoose.model('CFData',cfDataSchema);