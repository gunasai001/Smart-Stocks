const express = require('express');
const router = express.Router();
const { getUserPortfolio, addStockToPortfolio, removeStockFromPortfolio, getUser, addStocktoWishlist } = require('../controllers/portfolio');

router.get('/', getUserPortfolio);
router.get('/me', getUser);
router.post('/add/:stockId', addStockToPortfolio);
router.post('/remove/:stockId', removeStockFromPortfolio);
router.post('/wishlist/:stockId', addStocktoWishlist);

module.exports = router;