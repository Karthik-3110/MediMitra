const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Verify JWT token
  verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token.' });
    }
  },

  // Check role (optional)
  checkRole(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
      next();
    };
  }
};

module.exports = authMiddleware;