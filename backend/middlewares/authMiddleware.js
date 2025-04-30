const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Employee.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

exports.authorizeRole = (role) => (req, res, next) => {
  if (req.user.emp_role !== role) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};