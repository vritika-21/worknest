const Employee = require('../models/Employee');
const PDFDocument = require('pdfkit');

exports.addEmployee = async (req, res) => {
  const { emp_name, emp_email, emp_password, emp_department } = req.body;
  const hashed = await bcrypt.hash(emp_password, 10);
  const emp = new Employee({ emp_name, emp_email, emp_password: hashed, emp_role: 'employee', emp_department });
  await emp.save();
  res.json({ message: 'Employee added' });
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