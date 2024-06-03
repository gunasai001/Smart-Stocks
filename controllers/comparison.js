const Stock = require('../models/Stock');

exports.getStockData = async (req, res) => {
  try {
    const { symbols } = req.body;

    const stockData = await Stock.find({ symbol: { $in: symbols } });

    res.status(200).json({
      success: true,
      stockData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

exports.compareStocks = async (req, res) => {
  try {
    const { symbols } = req.body;

    const stockData = await Stock.find({ symbol: { $in: symbols } });

    // Perform stock comparison logic and calculations here
    const comparisonData = stockData.map(stock => {
      // Calculate comparison metrics for each stock
      return {
        symbol: stock.symbol,
        companyName: stock.company_name,
        // Add comparison metrics here
      };
    });

    res.status(200).json({
      success: true,
      comparisonData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};