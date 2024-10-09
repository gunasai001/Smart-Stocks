const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  price: Number,
  sector: String,
  industry: String,
  market_cap: Number,
  dividend_yield: Number,
  price_to_earnings_ratio: Number,
  eps: Number,
  beta: Number,
  volume: Number,
  latest_price: Number,
  last_updated: Date,
  historical_prices: [{
    date: Date,
    open: Number,
    high: Number, 
    low: Number,
    close: Number
  }],
  predictions: [Number]
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;