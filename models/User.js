const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  selected_stocks: [{
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  wishlisted_stocks: [{
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
  }]
});

userSchema.methods.hashPassword = async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;