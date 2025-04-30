const Attendance = require('../models/Attendance');

// Check-in 
exports.checkIn = async (req, res) => {
    const { emp_Id, checkInTime } = req.body;
    try {
        const today = new Date();
        today.setHours(0,0,0,0);

        // Check if already checked-in today
        const existingAttendance = await Attendance.findOne({ emp_Id, date: today });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const attendance = new Attendance({
            emp_Id,
            date: today,
            checkInTime
        });

        await attendance.save();

        return res.status(201).json({ message: 'Checked in successfully' });
    } catch (error) {
        console.error('Check-in error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Check-out 
exports.checkOut = async (req, res) => {
    const { emp_Id, checkOutTime } = req.body;
    try {
        const today = new Date();
        today.setHours(0,0,0,0);

        const attendance = await Attendance.findOne({ emp_Id, date: today });

        if (!attendance) {
            return res.status(404).json({ message: 'No check-in record found for today' });
        }

        attendance.checkOutTime = checkOutTime;
        await attendance.save();

        return res.status(200).json({ message: 'Checked out successfully' });
    } catch (error) {
        console.error('Check-out error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};