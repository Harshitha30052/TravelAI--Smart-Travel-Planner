const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: false
  },
  bookingReference: {
    type: String,
    unique: true,
    default: () => 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase()
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel', 'transport'],
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  travelers: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'refunded'],
    default: 'paid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
