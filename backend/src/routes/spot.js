const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController.js');

router.get('/', spotController.getSpot);
router.get('/variation', spotController.getLatestSpot)

module.exports = { router };