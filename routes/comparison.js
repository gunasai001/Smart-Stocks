const express = require('express');
const router = express.Router();
const { getStockData, compareStocks } = require('../controllers/comparison');

router.post('/data', getStockData);
router.post('/compare', compareStocks);

module.exports = router;