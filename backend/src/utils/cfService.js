const axios = require('axios');
const CFProfileData = require('../models/CFData');

async function fetchCFData(handle) {
  const [infoRes, ratingRes, statusRes] = await Promise.all([
    axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
    axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`),
    axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)
  ]);

  return {
    info: infoRes.data.result[0],
    ratingHistory: ratingRes.data.result,
    submissions: statusRes.data.result
  };
}

function processContests(ratingHistory, submissions) {
  return ratingHistory.map(r => {
    const contestDate = new Date(r.ratingUpdateTimeSeconds * 1000);


    const contestSubmissions = submissions.filter(
      s => s.problem.contestId === r.contestId
    );

    const problemsAttempted = new Set();
    const problemsSolved = new Set();

    contestSubmissions.forEach(s => {
      const pid = `${s.problem.contestId}-${s.problem.index}`;
      problemsAttempted.add(pid);
      if (s.verdict === 'OK') {
        problemsSolved.add(pid);
      }
    });

    const problemsUnsolvedCount = problemsAttempted.size - problemsSolved.size;

    return {
      contestId: r.contestId,
      contestName: r.contestName,
      rank: r.rank,
      oldRating: r.oldRating,
      newRating: r.newRating,
      ratingChange: r.newRating - r.oldRating,
      contestDate,
      problemsUnsolved: problemsUnsolvedCount >= 0 ? problemsUnsolvedCount : 0
    };
  });
}

function processProblemStats(submissions) {
  const accepted = submissions.filter(s => s.verdict === 'OK');
  const problemMap = {};

  accepted.forEach(s => {
    const pid = `${s.problem.contestId}${s.problem.index}`;
    if (!problemMap[pid]) {
      problemMap[pid] = {
        problemId: pid,
        rating: s.problem.rating || 0,
        solvedDate: new Date(s.creationTimeSeconds * 1000)
      };
    } else {
      const solvedDate = new Date(s.creationTimeSeconds * 1000);
      if (solvedDate < problemMap[pid].solvedDate) {
        problemMap[pid].solvedDate = solvedDate;
      }
    }
  });

  return Object.values(problemMap);
}

async function fetchAndStoreCFData(student) {
  const data = await fetchCFData(student.cfHandle);

  const contests = processContests(data.ratingHistory, data.submissions);
  const problemStats = processProblemStats(data.submissions);

  const cfProfile = await CFProfileData.findOneAndUpdate(
    { studentId: student._id },
    {
      studentId: student._id,
      ratingHistory: contests,
      problemStats: problemStats,
      lastSync: new Date()
    },
    { upsert: true, new: true }
  );

  student.currentRating = data.info.rating || 0;
  student.maxRating = data.info.maxRating || 0;
  student.cfLastUpdated = new Date();
  await student.save();

  return cfProfile;
}

module.exports = { fetchAndStoreCFData };