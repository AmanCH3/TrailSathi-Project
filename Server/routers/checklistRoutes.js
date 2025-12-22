const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');

router.get('/generate', checklistController.generateChecklist);

module.exports = router;
