const Student = require('../models/student');
const CFData = require('../models/CFData');
const { sendEmail } = require('./emailService');
const { getInactivityReminderEmail } = require('./emailTemplate');

async function notifyInactiveStudents() {
  const students = await Student.find({ emailRemainderDisable: { $ne: true } });
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (const student of students) {
    const cfData = await CFData.findOne({ studentId: student._id });
    if (!cfData) continue;

    const hasRecent = cfData.problemStats.some(
      p => p.solvedDate && p.solvedDate > sevenDaysAgo
    );

    if (!hasRecent) {
      const emailContent = getInactivityReminderEmail(student);
      await sendEmail({
        to: student.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
      student.emailCount = (student.emailCount || 0) + 1;
      await student.save();
    }
  }
}

module.exports = { notifyInactiveStudents };