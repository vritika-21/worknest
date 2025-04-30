const express = require('express');
const { addEmployee, disableEmployee, generateOfferLetter, generatePayslip, getHistory } = require('../controllers/hrController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authenticate, authorizeRole('hr'));

router.post('/add', addEmployee);
router.patch('/disable/:id', disableEmployee);
router.get('/offer-letter/:id', generateOfferLetter);
router.get('/payslip/:id', generatePayslip);
router.get('/history/:id', getHistory);

module.exports = router;