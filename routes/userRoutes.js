const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/user');
const Stock = require('../models/stock');
const authMiddleware = require('../middleware/token');

const signUpSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(5),
    email: z.string().email(),
  });
  
  const signInSchema = z.object({
    username: z.string(),
    password: z.string(),
  });
// Define user routes here

router.post('/signup', async (req, res) => {
  try {
    // Validate user input
    const { username, password, email } = signUpSchema.parse(req.body);

    // Create a new user
    const user = new User({
      username,
      password,
      email
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, '12344321');

    // Respond with success message and token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
  
  // Route for user sign in
  router.post('/signin', async (req, res) => {
    try {
      // Validate user input
      const { username, password } = signInSchema.parse(req.body);
  
      // Find the user by username
      const user = await User.findOne({ username });
  
      // If user not found or password doesn't match, return error
      if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }
  
      // Create and send JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      // Sign JWT token
      jwt.sign(payload, '12344321',  (error, token) => {
        if (error) {
          console.error(error.message);
          res.status(500).send('Server Error');
        }
        res.json({ token });
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Route for user profile
  router.get('/profile', authMiddleware, async (req, res) => {
    try {
      // Get user details from database
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });

  router.get('/profile/portfolio', authMiddleware, async (req, res) => {
    try {
      // Get user details from database including stock_ids
      const user = await User.findById(req.user.id).populate('stock_ids').select('-password');
      
      // Extract stocks from user
      const stocks = user.stock_ids;
  
      // Return the stocks
      res.json(stocks);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });

  router.post('/profile/portfolio/add', authMiddleware, async (req, res) => {
    try {
      const { stockId } = req.body;
  
      // Find the user by ID
      const user = await User.findById(req.user.id);
  
      // Check if the stockId is already in the stocks array
      if (user.stock_ids.includes(stockId)) {
        return res.status(400).json({ message: 'Stock already exists in portfolio' });
      }
  
      // Add the new stockId to the stocks array
      user.stock_ids.push(stockId);
      await user.save();
  
      res.status(200).json({ message: 'Stock added to portfolio successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  router.post('/profile/portfolio/remove', authMiddleware, async (req, res) => {
    try {
      const { stockId } = req.body;
  
      // Find the user by ID
      const user = await User.findById(req.user.id);
  
      // Check if the stockId exists in the stocks array
      if (!user.stock_ids.includes(stockId)) {
        return res.status(400).json({ message: 'Stock does not exist in portfolio' });
      }
  
      // Remove the stockId from the stocks array
      user.stock_ids = user.stock_ids.filter(id => id !== stockId);
      await user.save();
  
      res.status(200).json({ message: 'Stock removed from portfolio successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  

  router.get('/stocks', authMiddleware, async (req, res) => {
    try {
      // Fetch all stocks from the database
      const stocks = await Stock.find();
  
      // Check if there are no stocks found
      if (!stocks || stocks.length === 0) {
        return res.status(404).json({ message: 'No stocks found' });
      }
  
      // Return the stocks
      res.json(stocks);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;
