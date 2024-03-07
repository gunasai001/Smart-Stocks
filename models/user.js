const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  stock_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }]
});

// Define user model
const User = mongoose.model('User', userSchema);

module.exports = User;
