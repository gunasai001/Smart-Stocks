// Import the necessary modules
const jwt = require('jsonwebtoken'); // JSON Web Token for authentication
const passport = require('passport'); // Authentication middleware
const config = require('../config'); // Configuration file
const User = require('../models/User'); // User model

// Export the registration function
exports.registerUser = async (req, res) => {
  // Log that a registration request has been received
  console.log("register req recieved")

  try {
    // Destructure the request body data
    const { username, email, password, fullname, mobileno } = req.body;

    // Check if there is already a user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If there is, return an error response
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if there is already a user with the same username
    const existing = await User.findOne({ username });
    if (existing) {
      // If there is, return an error response
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password,
      fullname,
      mobileno
    });

    // Log the new user instance
    console.log(newUser)

    // Hash the password before saving
    await newUser.hashPassword();

    // Save the user to the database
    await newUser.save();

    // Return a success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // If there is an error, return an error response
    res.status(500).json({err});
  }
};

// Export the login function
exports.loginUser = async (req, res, next) => {
  // Authenticate the user using the 'local' strategy
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      // If there is an error or the user is not authenticated, return an error response
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If the user is authenticated, log them in without saving a session
    req.login(user, { session: false }, async (err) => {
      if (err) {
        // If there is an error, pass it to the next middleware
        return next(err);
      }

      // Generate a JSON Web Token
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: '1d'
      });

      // Return a success response with the token and user data
      return res.json({ token, user });
    });
  })(req, res, next);
};


