const express = require('express');
const { addEmployee, disableEmployee, generateOfferLetter, generatePayslip, getHistory, getAllEmployees, approveLeave, rejectLeave } = require('../controllers/hrController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Apply authentication and authorization for all routes
router.use(authenticate, authorizeRole('hr'));

// Route to add a new employee
router.post('/employees', addEmployee);

// Route to get all employees
router.get('/employees', getAllEmployees);

// Route to disable an employee by ID
router.patch('/disable/:id', disableEmployee);

// Routes for generating offer letters, payslips, and employee history
router.get('/offer-letter/:id', generateOfferLetter);
router.get('/payslip/:id', generatePayslip);
router.get('/history/:id', getHistory);

// Add this to hrRoutes.js to handle leave approval and rejection
router.post('/employees/approve', approveLeave);  // Route for approving leaves
router.post('/employees/reject', rejectLeave);   // Route for rejecting leaves

module.exports = router;