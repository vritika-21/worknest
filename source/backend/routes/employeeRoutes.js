const express = require('express');
const { checkIn, checkOut, applyLeave, getLeaveBalance, submitFeedback } = require('../controllers/employeeController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authenticate, authorizeRole('employee'));

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.post('/leave', applyLeave);
router.get('/leave-balance', getLeaveBalance);
router.post('/feedback', submitFeedback);


module.exports = router;