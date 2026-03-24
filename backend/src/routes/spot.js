const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController.js');

router.get('/variation', spotController.getLatestSpot)
router.get('/latest', spotController.getTodaySpot)

module.exports = { router };