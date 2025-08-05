const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};



exports.getCurrentUser = async (req, res) => {
  try {
    // Get token from cookies or Authorization header
    console.log('Cookies:', req.cookies);
console.log('Headers:', req.headers.authorization);

    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.googleAuthCallback = (req, res) => {
  try {
    const token = generateToken(req.user);
    
    // Set HTTP-only cookie (for web)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from strict for better compatibility
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    // For React frontend - redirect with token in URL
    const frontendURL = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/auth-callback?token=${token}`);
    
  } catch (err) {
    console.error('Auth error:', err);
    const frontendURL = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/login?error=auth_failed`);
  }
};







// Keep logout and getCurrentUser exactly the same
// exports.verifyToken = (req, res) => {
//   try {
//     const token = req.cookies.jwt || req.query.token;
//     if (!token) return res.json({ valid: false });
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.json({ valid: true, user: decoded });
//   } catch (err) {
//     res.json({ valid: false });
//   }
// };



exports.verifyToken = async (req, res) => {
  try {
    const token = req.cookies.jwt || req.query.token;
    
    if (!token) {
      return res.status(401).json({ valid: false, error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.json({ valid: false, error: 'Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    res.json({ valid: true, user });
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message });
  }
};







// Logout handler
exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out successfully' });
};







// Get current authenticated user
// exports.getCurrentUser = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Not authenticated' });
//     }
    
//     const user = await User.findById(req.user.id)
//       .select('-__v -createdAt -updatedAt');
      
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// };

exports.getCurrentUser = async (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);

  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await User.findById(req.user.id)
    .select('-__v -createdAt -updatedAt');

  res.json(user);
};

