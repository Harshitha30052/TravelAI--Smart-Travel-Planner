const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  richData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
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
  title: {
    type: String,
    default: 'New Trip Planning'
  },
  currentTripState: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  messages: [ChatMessageSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
