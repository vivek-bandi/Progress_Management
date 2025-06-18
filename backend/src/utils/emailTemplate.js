function getInactivityReminderEmail(student) {
  return {
    subject: 'Get back to problem solving!',
    html: `<p>Hi ${student.name},</p>
           <p>We noticed you haven't made any submissions in the last 7 days. Time to get back to practice!</p>`,
    text: `Hi ${student.name},\n\nWe noticed you haven't made any submissions in the last 7 days. Time to get back to practice!`,
  };
}

module.exports = { getInactivityReminderEmail };