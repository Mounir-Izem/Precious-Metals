const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController.js');

router.get('/', healthController.getHealth);
router.get('/ready', healthController.checkHealth);


module.exports = { router };

