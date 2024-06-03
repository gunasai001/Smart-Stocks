const Stock = require('../models/Stock');
const { getPredictions } = require('../utils/python-integration');

exports.getStockPredictions = async (req, res) => {
  try {
    const { symbols } = req.body;

    const stockData = await Stock.find({ symbol: { $in: symbols } }, { predictions: 1 });

    res.status(200).json({
      success: true,
      predictions: stockData.map(stock => stock.predictions)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

exports.generatePredictions = async (req, res) => {
  try {
    const { symbols } = req.body;

    const stockData = await Stock.find({ symbol: { $in: symbols } });
    const predictions = await getPredictions(stockData);

    // Update the predictions in the database
    const updatedStocks = await Promise.all(
      stockData.map(async (stock, index) => {
        return await Stock.findByIdAndUpdate(
          stock._id,
          {
            $push: {
              predictions: predictions[index]
            }
          },
          { new: true }
        );
      })
    );

    res.status(200).json({
      success: true,
      predictions: updatedStocks.map(stock => stock.predictions)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};