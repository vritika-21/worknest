const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  emp_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  fromDate: Date,
  toDate: Date,
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Leave_Requests', leaveSchema);