const jwt = require('jsonwebtoken');

const authenticate = (roles = [] ) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    try {
      const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ 
          error: 'Authentication token missing',
          solution: 'Please login or provide Authorization header'
        });
      }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      console.error('Authentication error:', err);

      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }

      res.status(500).json({ 
        error: 'Authentication failed',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
      });
    }
  };
};
module.exports = { authenticate };