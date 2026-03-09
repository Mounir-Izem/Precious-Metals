const express = require('express');
const { parseCoin } = require('../controllers/coinController');

const router = express.Router();

router.get('/parse', parseCoin);

module.exports = router;