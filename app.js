const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
require('dotenv').config();

// Import routes
const portfolioRoutes = require('./routes/portfolio');
const comparisonRoutes = require('./routes/comparison');
const predictionsRoutes = require('./routes/predictions');
const stockRoutes = require('./routes/stocks');
const authRoutes = require('./routes/auth');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const limiter = require('./middleware/rateLimit');
const securityHeaders = require('./middleware/securityHeaders');

// Import authentication strategies
require('./auth/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger); // Request logging
app.use(limiter); // Rate limiting
app.use(securityHeaders); // Security headers
app.use(passport.initialize());

// Database connection
const connectDB = require('./config/database');
const authenticateUser = require('./middleware/authenticateUser');

// Connect to the database
connectDB();

// Rest of your application code...

// Routes
app.use('/api/auth', authRoutes);
app.use(authenticateUser)
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/stocks', stockRoutes);

// Error handling
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});