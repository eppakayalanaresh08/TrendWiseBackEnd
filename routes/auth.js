


const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken')
const User = require('../models/User'); // 👈 Add this import

router.get('/',(req,res)=>{
  res.send("<a href='/auth/google '>Login with google</a>")
})
// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    
    prompt: 'select_account' 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureMessage: true 
  }),
  authController.googleAuthCallback
);

// Logout route
router.get('/logout', authController.logout);

// Get current user
router.get('/current', authController.getCurrentUser);



router.get('/verify-token', async (req, res) => {
  try {
    // 1. Get token from all possible sources
    const tokenSources = {
      cookie: req.cookies?.jwt,
      query: req.query?.token,
      header: req.headers.authorization?.replace('Bearer ', '')
    };

    console.log('🔍 Token sources:', tokenSources);

    // 2. Clean and select the first valid token
    const getCleanToken = (token) => {
      if (!token) return null;
      return token.toString().trim().replace(/\n/g, '');
    };

    const token = getCleanToken(tokenSources.query) || 
                 getCleanToken(tokenSources.cookie) || 
                 getCleanToken(tokenSources.header);

    // 3. Validate token exists
    if (!token) {
      console.log('❌ No valid token found in any source');
      return res.status(401).json({ 
        valid: false,
        error: 'No token provided',
        hints: [
          'Send via cookie: jwt=<token>',
          'Send via query: ?token=<token>',
          'Send via header: Authorization: Bearer <token>'
        ]
      });
    }

    console.log('✅ Using token:', token);

    // 4. Verify token structure
    if (token.split('.').length !== 3) {
      console.log('❌ Malformed token structure');
      return res.status(400).json({ 
        valid: false,
        error: 'Invalid token format',
        expected: 'Header.Payload.Signature'
      });
    }

    // 5. Verify token signature and expiration
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      console.log('🔓 Decoded token:', decoded);
    } catch (verifyErr) {
      console.log('❌ Verification failed:', verifyErr.message);
      return res.status(401).json({ 
        valid: false,
        error: verifyErr.message.includes('expired') 
          ? 'Token expired' 
          : 'Invalid token signature',
        solution: verifyErr.message.includes('expired')
          ? 'Generate a new token'
          : 'Check your JWT_SECRET'
      });
    }

    // 6. Verify user exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log(`❌ User not found for ID: ${decoded.id}`);
      return res.status(404).json({ 
        valid: false,
        error: 'User not found'
      });
    }

    console.log(`👤 Verified user: ${user.email}`);
    console.log(user,'uservaild')

    // 7. Successful verification
    return res.json({ 
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar:user.avatar,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    console.error('🔥 Unexpected error:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        cookies: req.cookies
      }
    });

    return res.status(500).json({ 
      valid: false,
      error: 'Internal server error',
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});





module.exports = router;



















// router.get('/verify', (req, res) => {
//   const token = req.query.token;
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.json({ valid: true, user: decoded });
//   } catch (err) {
//     res.json({ valid: false });
//   }
// });



// router.get('/verify-token', authController.verifyToken);

// In your backend routes/auth.js
// router.get('/verify-token', (req, res) => {
//   try {
//     const token = req.cookies.jwt || req.query.token;
    
//     if (!token) {
//       return res.status(400).json({ valid: false, error: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.json({ 
//       valid: true, 
//       user: { 
//         id: decoded.id, 
//         isAdmin: decoded.isAdmin 
//       }
//     });
//   } catch (err) {
//     res.json({ valid: false, error: 'Invalid token' });
//   }
// });


// router.get('/verify-token', async (req, res) => {
//   try {
//     const token = req.cookies.jwt || req.query.token;
    
//     if (!token) {
//       return res.status(400).json({ 
//         valid: false, 
//         error: 'No token provided' 
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
    
//     if (!user) {
//       return res.json({ valid: false });
//     }

//     res.json({ 
//       valid: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin
//       }
//     });
//   } catch (err) {
//     res.json({ 
//       valid: false,
//       error: 'Invalid token'
//     });
//   }
// });









// In your authController.js or verify-token route
// router.get('/verify-token', async (req, res) => {
//   try {

//     console.log('📦 Request cookies:', req.cookies); // Log all cookies
//     console.log('🔍 Query params:', req.query); // Log query params
//     // const token = req.cookies.jwt || req.query.token;
//     const rawToken = req.query?.token;
//     const token = rawToken ? rawToken.trim() : null;
    
//     console.log('🧹 Cleaned token:', token); // Verify it's clean
    
//     // 1. Log the incoming token
//     console.log('🔑 Received Token:', token);
//     console.log('🔐 JWT_SECRET exists?:', process.env.JWT_SECRET ? 'Yes' : 'No');

//     if (!token) {
//       console.log('❌ No token provided');
//       return res.status(400).json({ valid: false, error: 'No token provided' });
//     }

//     // 2. Verify with detailed error logging
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('✅ Decoded Token:', decoded);
//     } catch (verifyErr) {
//       console.log('❌ Verification failed:', verifyErr.message);
//       console.log('⚠️ Token contents (UNVERIFIED):', jwt.decode(token));
//       return res.json({ valid: false, error: verifyErr.message });
//     }

//     // 3. Check user existence
//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) {
//       console.log('❌ User not found for ID:', decoded.id);
//       return res.json({ valid: false, error: 'User not found' });
//     }

//     console.log('👤 Verified User:', user.email);
//     res.json({ valid: true, user });
    
//   } catch (err) {
//     console.error('🔥 Unexpected error:', err);
//     res.status(500).json({ valid: false, error: 'Server error' });
//   }
// });




