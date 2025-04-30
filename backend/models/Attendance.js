const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  emp_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  date: String,
  checkIn: Date,
  checkOut: Date
});

module.exports = mongoose.model('Attendance', attendanceSchema);