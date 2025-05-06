const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const Leave = require('../models/LeaveRequest');
const PDFDocument = require('pdfkit');
const Feedback = require('../models/Feedback');

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
  if (!emp) return res.status(404).json({ message: 'Employee not found' });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Offer_Letter_${emp.emp_name}.pdf`);
  doc.pipe(res);
  doc.fontSize(16).text('Offer Letter', { align: 'center' });
  doc.moveDown(2);

  const formattedDate = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy
  const [day, month, year] = formattedDate.split('/');
  doc.fontSize(12).text(`Date: ${day}-${month}-${year}`);
  doc.moveDown();

  doc.text(`To,`);
  doc.text(`${emp.emp_name}`);
  doc.text(`${emp.emp_email}`);
  doc.moveDown();

  doc.text(`Subject: Offer of Employment`);
  doc.moveDown();

  doc.text(`Dear ${emp.emp_name},`);
  doc.moveDown();

  doc.text(`We are pleased to offer you the position of ${emp.emp_designation || 'Employee'} in the ${emp.emp_department} department at WORKNEST. Your employment is set to commence on 15-05-2025.`);
  doc.moveDown();

  doc.text(`Your compensation will be as discussed and will be detailed in the annexure attached with this letter. You will report to your department head at our office located at Worknest,Durg, Chhattisgarh.`);
  doc.moveDown();

  doc.text(`We are excited to have you as part of our team and look forward to your contributions.`);
  doc.moveDown();

  doc.text(`Sincerely,`);
  doc.text(`ADMIN`);
  doc.text(`HR Department`);
  doc.text(`WORKNEST`);
  doc.end();
};


exports.generatePayslip = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Sample salary calculation logic
    const baseSalary = 30000;
    const bonus = 5000;
    const deductions = 2000;
    const totalSalary = baseSalary + bonus - deductions;

    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip_${emp.emp_name}.pdf`);

    doc.pipe(res);

    // PDF Content
    doc.fontSize(18).text('Payslip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${emp.emp_name}`);
    doc.text(`Department: ${emp.emp_department}`);
    doc.text(`Base Salary: ₹${baseSalary}`);
    doc.text(`Bonus: ₹${bonus}`);
    doc.text(`Deductions: ₹${deductions}`);
    doc.text(`Total Salary: ₹${totalSalary}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.end();

  } catch (error) {
    console.error('Error generating payslip:', error);
    res.status(500).json({ message: 'Error generating payslip' });
  }
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

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Failed to fetch leave requests' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
};