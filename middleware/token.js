const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware function for JWT authentication and authorization
const authMiddleware = async (req, res, next) => {
  // Extract token from request headers
  const token = req.header('Authorization');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, '12344321');

    // Fetch user details from database based on decoded user ID
    const user = await User.findById(decoded.userId);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid token, user not found' });
    }

    // Attach user object to request for further processing
    req.user = user;

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error('Token error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
