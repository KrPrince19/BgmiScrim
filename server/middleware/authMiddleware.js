const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.warn(`🔐 Auth Failure: User not found for ID ${decoded.id}`);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        console.error(`🔐 Auth Failure: Token invalid or expired. Error: ${error.message}`);
        return res.status(401).json({ message: 'Not authorized, token failed' });
      } else {
        console.error(`💥 Database/Server Error in auth middleware: ${error.message}`);
        // Return 500 for DB errors so the client doesn't treat it as an expired session
        return res.status(500).json({ message: 'Server error during authentication' });
      }
    }
  }

  if (!token) {
    console.warn('🔐 Auth Failure: No token provided in headers.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
