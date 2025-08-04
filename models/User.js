// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   googleId: { type: String, required: true, unique: true },
//   displayName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   isAdmin: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: String,
  displayName: { 
    type: String,
    default: 'Anonymous' // Optional: Set default if missing
  },
  email: {
    type: String,
    required: true // Keep email as required
  },
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);