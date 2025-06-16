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
  const profile = await CFProfileData.findOne({ studentId: req.params.id });
  if (!profile) return res.status(404).send('Profile not found');
  res.json(profile);
};

exports.sync = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send('Student not found');

  const cfData = await fetchAndStoreCFData(student);
  res.json(cfData);
};