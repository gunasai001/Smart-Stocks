const User = require('../models/User');

// Get user portfolio
exports.getUserPortfolio = async (req, res) => {
  try {
    const userId = req.userid; // Assuming you have authenticated the user and the userId is available in req.user
    const user = await User.findById(userId).populate('selected_stocks.stock');
    
    res.status(200).json({
      success: true,
      portfolio: user.selected_stocks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const userId = req.userid; // Assuming you have authenticated the user and the userId is available in req.user
    const user = await User.findById(userId)

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add stock to portfolio
exports.addStockToPortfolio = async (req, res) => {
  try {
    const userId = req.userid;
    const { _id, price, quantity, symbol } = req.body;
    
    // Find the user and check if the stock is already in the portfolio
    const user = await User.findById(userId);
    
    
    
    const stockExists = user.selected_stocks.some(stock => {
      return stock._id.toString() === _id
    });
    
    if (stockExists) {
      return res.status(400).json({
        success: false,
        message: 'Stock already exists in portfolio'
      });
    }

    // If the stock doesn't exist, add it to the portfolio
    user.selected_stocks.push({ _id, price, quantity });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Stock added to portfolio',
      portfolio: user.selected_stocks
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'Serversdfsdf Error'
    });
  }
};

// Remove stock from portfolio
exports.removeStockFromPortfolio = async (req, res) => {
  try {
    const userId = req.userid;
    const { _id } = req.body;

    // Find the user and check if the stock is in the portfolio
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stockIndex = user.selected_stocks.findIndex(stock => stock._id.toString() === _id);
    
    if (stockIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found in portfolio'
      });
    }

    // If the stock exists, remove it from the portfolio
    user.selected_stocks.splice(stockIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Stock removed from portfolio',
      portfolio: user.selected_stocks
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};