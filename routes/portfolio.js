const express = require('express');
const router = express.Router();
const { getUserPortfolio, addStockToPortfolio, removeStockFromPortfolio } = require('../controllers/portfolio');

router.get('/', getUserPortfolio);
router.post('/add', addStockToPortfolio);
router.delete('/remove/:stockId', removeStockFromPortfolio);

module.exports = router;