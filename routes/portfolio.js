const express = require('express');
const router = express.Router();
const { getUserPortfolio, addStockToPortfolio, removeStockFromPortfolio, getUser } = require('../controllers/portfolio');

router.get('/', getUserPortfolio);
router.get('/me', getUser);
router.post('/add/:stockId', addStockToPortfolio);
router.post('/remove/:stockId', removeStockFromPortfolio);

module.exports = router;