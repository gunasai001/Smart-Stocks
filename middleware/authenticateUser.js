const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.userid = decoded.id;
        next();
  } catch (err) {
    return res.status(401).json({ err });
  }
};

module.exports = authenticateUser;