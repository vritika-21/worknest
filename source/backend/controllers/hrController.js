const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const Leave = require('../models/LeaveRequest');
const PDFDocument = require('pdfkit');

exports.addEmployee = async (req, res) => {
  try {
    const { emp_name, emp_email, emp_password, emp_department } = req.body;
    const hashed = await bcrypt.hash(emp_password, 10);
    const emp = new Employee({
      emp_name,
      emp_email,
      emp_password: hashed,
      emp_role: 'employee',
      emp_department,
      emp_status: 'active',
      leaveBalance: 12,
      history: {}
    });
    await emp.save();
    res.status(201).json({ message: 'Employee added', employee: emp });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Failed to add employee' });
  }
};

exports.disableEmployee = async (req, res) => {
  await Employee.findByIdAndUpdate(req.params.id, { emp_status: 'disabled' });
  res.json({ message: 'Employee disabled' });
};

exports.generateOfferLetter = async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.text(`Offer Letter\n\nDear ${emp.emp_name},\nWe are pleased to offer you the role of ${emp.emp_department}...`);
  doc.end();
};

exports.generatePayslip = async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.text(`Payslip\n\nName: ${emp.emp_name}\nDepartment: ${emp.emp_department}\nSalary: ₹XXXXX`);
  doc.end();
};

exports.getHistory = async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  res.json(emp.history);
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

exports.approveLeave = async (req, res) => {
  const { leaveRequestId } = req.body;
  try {
    const leave = await Leave.findById(leaveRequestId);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    leave.status = 'approved';
    await leave.save();

    res.json({ message: 'Leave approved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving leave' });
  }
};

exports.rejectLeave = async (req, res) => {
  const { leaveRequestId } = req.body;
  try {
    const leave = await Leave.findById(leaveRequestId);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    leave.status = 'rejected';
    await leave.save();

    res.json({ message: 'Leave rejected successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting leave' });
  }
};