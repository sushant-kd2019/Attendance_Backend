const express = require('express');

const router = express.Router();
const subjectController = require('../controllers/Subject.controller');

router.post('/subjects',subjectController.create);
router.get('/subjects',subjectController.find);

module.exports = router;