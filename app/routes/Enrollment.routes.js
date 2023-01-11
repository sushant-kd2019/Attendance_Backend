const express = require('express');

const router = express.Router();
const enrollmentController = require('../controllers/Enrollment.controller');

router.post('/enrollments',enrollmentController.create);

module.exports = router;