const express = require('express');

const router = express.Router();
const studentsController = require('../controllers/Student.controller');

router.post('/students',studentsController.create);
router.get('/students', studentsController.getStudents);

module.exports = router;