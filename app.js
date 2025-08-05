const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const path = require('path');
const session = require('express-session');

// Route imports
const articleRoutes = require('./routes/articles');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const commentRoutes = require('./routes/comments');
const testRouter = require('./routes/test');
const jwt = require('jsonwebtoken');

const app = express();


// Middlewares
// app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:5173', // your frontend origin
//   credentials: true,               // allow cookies
// }));


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://trend-wise-frontend-zeta.vercel.app'
  ],
  credentials: true, // Allow cookies and credentials
}));


app.use(session({
  secret: process.env.SESSION_SECRET || 'your_fallback_secret_here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// THEN initialize passport


app.use(express.json());
app.use(passport.initialize());
app.use(passport.session()); 



require('./config/passport');

// Database connection
connectDB();
// app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.use('/api/test', testRouter);
app.use('/api/articles', articleRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;