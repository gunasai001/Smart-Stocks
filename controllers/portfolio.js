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

// Add stock to portfolio
exports.addStockToPortfolio = async (req, res) => {
  try {
    const userId = req.userid;
    const { stockId, price, quantity } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          selected_stocks: { stock: stockId, price, quantity }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      portfolio: user.selected_stocks
    });
  } catch (err) {
    res.status(500).json({
      err
    });
  }
};

// Remove stock from portfolio
exports.removeStockFromPortfolio = async (req, res) => {
  try {
    const userId = req.userid;
    const { stockId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          selected_stocks: { stock: stockId }
        }
      },
      { new: true }
    );

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