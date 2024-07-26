const validator = require('validator');

exports.validateRegistrationData = (req, res, next) => {
  const { username, email, password, fullname, mobileno } = req.body;
  console.log(username)
  // Check if any required fields are missing
  if (!username || !email || !password || !fullname || !mobileno) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the email is valid
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Check if the password meets the minimum length requirement
  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Additional validation rules can be added as needed

  next();
};