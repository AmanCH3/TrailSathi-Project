const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/', (req, res, next) => {
    console.log('Weather route hit');
    next();
}, weatherController.getWeather);

module.exports = router;
