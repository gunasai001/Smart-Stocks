const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName, mobileNumber } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      fullName,
      mobileNumber
    });


    // Hash the password before saving
    await newUser.hashPassword();

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ err});
  }
};

exports.loginUser = async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    req.login(user, { session: false }, async (err) => {
      if (err) {
        return next(err);
      }

      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: '1d'
      });

      return res.json({ token, user });
    });
  })(req, res, next);
};

