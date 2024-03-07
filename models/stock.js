const mongoose = require('mongoose');

// Define stock schema
const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Define stock model
const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
