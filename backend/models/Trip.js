const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  time: { type: String, default: '10:00 AM' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  category: { type: String, default: 'sightseeing' },
  estimatedCost: { type: Number, default: 0 },
  isIndoor: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 }
}, { _id: false });

const DaySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: String },
  title: { type: String, default: '' },
  theme: { type: String, default: 'Exploration' },
  activities: [ActivitySchema]
}, { _id: false });

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  endDate: {
    type: String
  },
  durationDays: {
    type: Number,
    required: true,
    default: 5
  },
  travelers: {
    type: Number,
    required: true,
    default: 2
  },
  budget: {
    type: Number,
    required: true,
    default: 40000
  },
  estimatedBudget: {
    type: Number,
    default: 38000
  },
  currency: {
    type: String,
    default: 'INR'
  },
  budgetBreakdown: {
    transport: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food_and_dining: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    contingency_and_local: { type: Number, default: 0 }
  },
  preferences: {
    travelStyle: { type: String, default: 'Moderate' },
    hotelRating: { type: Number, default: 3 },
    transportation: { type: String, default: 'Flight' },
    foodPreference: { type: String, default: 'Non-Veg' },
    interests: [{ type: String }]
  },
  hotel: {
    name: { type: String, default: 'Standard 3-Star Resort' },
    rating: { type: Number, default: 3 },
    pricePerNight: { type: Number, default: 3500 },
    location: { type: String, default: 'Central Area' },
    amenities: [{ type: String }],
    image: { type: String, default: '' }
  },
  weatherSummary: {
    temp: { type: Number, default: 28 },
    condition: { type: String, default: 'Sunny & Pleasant' },
    rainChance: { type: Number, default: 10 },
    humidity: { type: Number, default: 65 },
    icon: { type: String, default: 'sun' },
    advice: { type: String, default: 'Great weather for outdoor exploration!' }
  },
  itinerary: [DaySchema],
  packingList: [{
    category: { type: String, required: true },
    items: [{
      name: { type: String, required: true },
      checked: { type: Boolean, default: false },
      essential: { type: Boolean, default: true }
    }]
  }],
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'completed'],
    default: 'planning'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', TripSchema);
