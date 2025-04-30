const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
    emp_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true },
    basic_Salary: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    net_Salary: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payslip', payslipSchema);