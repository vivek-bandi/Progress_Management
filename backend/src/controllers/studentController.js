const { Parser } = require('json2csv');
const Student = require('../models/student');
const CFProfileData = require('../models/CFData');
const { fetchAndStoreCFData } = require('../utils/cfService');

exports.getAll = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

exports.add = async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  await fetchAndStoreCFData(student);
  res.status(201).json(student);
};

exports.update = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) { 
    return res.status(404).send('Student not found');
  }

  const prevHandle = student.cfHandle;
  Object.assign(student, req.body);
  await student.save();

  if (req.body.cfHandle && req.body.cfHandle !== prevHandle) {
    await fetchAndStoreCFData(student);
  }

  res.json(student);
};

exports.delete = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  await CFProfileData.deleteOne({ studentId: req.params.id });
  res.json({ message: 'Deleted' });
};

exports.getStudentProfile = async (req, res) => {
  const profile = await CFProfileData.findOne({ studentId: req.params.id }).populate('studentId');
  if (!profile) return res.status(404).send('Profile not found');
  res.json(profile);
};


exports.exportCSV = async (req, res) => {
  const students = await Student.find({}).lean();

  if (!students.length) {
    return res.status(404).send('No students to export');
  }

  const cleanedStudents = students.map(s => ({
    name: s.name || '',
    email: s.email || '',
    phone: s.phone ? String(s.phone) : '',
    cfHandle: s.cfHandle || '',
    currentRating: s.currentRating || 0,
    maxRating: s.maxRating || 0
  }));

  // console.log(cleanedStudents);
  const fields = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Codeforces Handle', value: 'cfHandle' },
    { label: 'Current Rating', value: 'currentRating' },
    { label: 'Max Rating', value: 'maxRating' },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(cleanedStudents);

  res.header('Content-Type', 'text/csv');
  res.attachment('students.csv');
  res.send(csv);
};

exports.getContentHistory = async (req, res) => {
  const { id } = req.params;
  const days = parseInt(req.query.days) || 30;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  try {
    const cfData = await CFProfileData.findOne({ studentId: id });

    if (!cfData) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const filteredContests = cfData.ratingHistory
      .filter(c => c.contestDate >= cutoffDate)
      .sort((a, b) => new Date(a.contestDate) - new Date(b.contestDate));

    const data = filteredContests.map(c => ({
      date: c.contestDate,
      contestName: c.contestName,
      oldRating: c.oldRating,
      newRating: c.newRating,
      ratingChange: c.ratingChange,
      rank: c.rank,
      problemsUnsolved: c.problemsUnsolved
    }));

    res.json(data);
  } catch (err) {
    console.error('Failed to get contest history', err);
    res.status(500).json({ error: 'Failed to get contest history' });
  }
};