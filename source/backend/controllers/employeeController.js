const Attendance = require('../models/Attendance');
const Leave = require('../models/LeaveRequest');
const Feedback = require('../models/Feedback');
const Employee = require('../models/Employee');

exports.checkIn = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  await Attendance.create({ employeeId: req.user._id, date: today, checkIn: new Date() });
  res.json({ message: 'Checked in' });
};

exports.checkOut = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  await Attendance.findOneAndUpdate({ employeeId: req.user._id, date: today }, { checkOut: new Date() });
  res.json({ message: 'Checked out' });
};

exports.applyLeave = async (req, res) => {
  const { fromDate, toDate, reason } = req.body;
  await Leave.create({ employeeId: req.user._id, fromDate, toDate, reason });
  res.json({ message: 'Leave request submitted' });
};

exports.getLeaveBalance = async (req, res) => {
  const user = await Employee.findById(req.user._id);
  res.json({ leaveBalance: user.leaveBalance });
};

exports.submitFeedback = async (req, res) => {
  await Feedback.create({ message: req.body.message });
  res.json({ message: 'Feedback submitted anonymously' });
};