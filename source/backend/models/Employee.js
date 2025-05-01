const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  emp_name: String,
  emp_email: { type: String, unique: true },
  emp_password: String,
  emp_role: { type: String, enum: ['employee', 'hr'], default: 'employee' },
  emp_department: String,
  emp_status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  leaveBalance: { type: Number, default: 12 },
  history: {
    joiningDate: Date,
    resigningDate: Date,
    lastWorkingDay: Date,
    rejoiningDate: Date
  }
});

module.exports = mongoose.model('employee', employeeSchema);