const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');


exports.registerUser = async (req, res) => {
  let { emp_name, emp_email, emp_password, emp_role, emp_department } = req.body;

  emp_name = emp_name?.trim();
  emp_email = emp_email?.trim().toLowerCase();
  emp_password = emp_password?.trim();
  emp_role = emp_role?.trim();
  emp_department = emp_department?.trim();

  // Validate required fields
  if (!emp_name || !emp_email || !emp_password || !emp_role || !emp_department) {
    return res.status(400).json({
      message: 'All fields are required',
      errors: {
        ...(!emp_name && { emp_name: 'Name is required' }),
        ...(!emp_email && { emp_email: 'Email is required' }),
        ...(!emp_password && { emp_password: 'Password is required' }),
        ...(!emp_role && { emp_role: 'Role is required' }),
        ...(!emp_department && { emp_department: 'Department is required' })
      }
    });
  }

  try {
    const existing = await Employee.findOne({ emp_email });

    if (existing) {
      return res.status(400).json({
        message: 'Email already exists',
        field: 'emp_email'
      });
    }

    const hashed = await bcrypt.hash(emp_password, 12);
    const user = new Employee({
      emp_name,
      emp_email,
      emp_password: hashed,
      emp_role,
      emp_department,
      history: { joiningDate: new Date() }
    });

    try {
      await user.save();
    } catch (err) {
      console.error('Registration Error:', err);

      if (err.code === 11000 && err.keyPattern?.emp_email) {
        return res.status(400).json({
          message: 'Email already exists',
          field: 'emp_email'
        });
      }
      throw err;
    }

    const token = jwt.sign(
      { id: user._id, role: user.emp_role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.emp_email,
        role: user.emp_role
      }
    });

  } catch (err) {
    console.error('Registration Error:', err);
    
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(key => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? err.message : null
    });
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

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};