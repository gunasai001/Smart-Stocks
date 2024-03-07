// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/stock_management')
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Middleware for JSON parsing
app.use(express.json());

// Use user and stock routes
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
