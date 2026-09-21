const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  preferences: {
    travelStyle: {
      type: String,
      enum: ['Budget', 'Moderate', 'Luxury'],
      default: 'Moderate'
    },
    foodPreference: {
      type: String,
      enum: ['Vegetarian', 'Pure Vegetarian', 'Non-Veg', 'Street Food', 'Fine Dining'],
      default: 'Non-Veg'
    },
    pace: {
      type: String,
      enum: ['Relaxed', 'Balanced', 'Fast'],
      default: 'Balanced'
    },
    interests: [{
      type: String
    }],
    homeCity: {
      type: String,
      default: 'New Delhi'
    },
    defaultCurrency: {
      type: String,
      default: 'INR'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
