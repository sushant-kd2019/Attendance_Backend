const express = require('express');

const router = express.Router();
const attendanceController = require('../controllers/Attendance.controller');

router.post('/attendance',attendanceController.create);
router.get('/attendance/:student_id', attendanceController.find);


module.exports = router;