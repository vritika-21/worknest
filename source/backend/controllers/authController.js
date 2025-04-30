const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.registerUser = async (req, res) => {
  const { emp_name, emp_email, emp_password, emp_role, emp_department } = req.body;
  try {
    const existing = await Employee.findOne({ emp_email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(emp_password, 10);
    const user = new Employee({ emp_name, emp_email, emp_password: hashed, emp_role, emp_department, history: { joiningDate: new Date() }});
    await user.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.loginUser = async (req, res) => {
  const { emp_email, emp_password } = req.body;
  try {
    const user = await Employee.findOne({ emp_email });
    if (!user) return res.status(404).json({ message: 'Invalid email' });

    const match = await bcrypt.compare(emp_password, user.emp_password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.emp_role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, role: user.emp_role });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};