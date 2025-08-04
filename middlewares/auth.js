// module.exports = {
//     isAuthenticated: (req, res, next) => {
//       if (req.isAuthenticated()) return next();
//       res.status(401).json({ error: 'Not authenticated' });
//     },
  
//     isAdmin: (req, res, next) => {
//       if (req.user?.isAdmin) return next();
//       res.status(403).json({ error: 'Admin access required' });
//     }
//   };




  // middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = {
  isAuthenticated: (req, res, next) => {
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1] || req.query?.token;
    
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { _id: decoded.id, isAdmin: decoded.isAdmin }; // Attach to request
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user?.isAdmin) return next();
    res.status(403).json({ error: 'Admin access required' });
  }
};