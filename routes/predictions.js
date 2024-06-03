const express = require('express');
const router = express.Router();
const { getStockPredictions, generatePredictions } = require('../controllers/predictions');

router.post('/get', getStockPredictions);
router.post('/generate', generatePredictions);

module.exports = router;