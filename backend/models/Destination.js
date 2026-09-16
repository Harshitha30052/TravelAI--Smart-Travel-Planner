const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagline: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: 'India' },
  description: { type: String, required: true },
  heroImage: { type: String, required: true },
  thumbnailImage: { type: String },
  category: { 
    type: String, 
    enum: ['Beaches', 'Mountains', 'Heritage', 'Adventure', 'Wildlife', 'International'],
    default: 'Beaches'
  },
  bestTimeToVisit: { type: String, default: 'October to March' },
  avgCostPerDay: { type: Number, default: 3500 },
  rating: { type: Number, default: 4.8 },
  weatherDefaults: {
    temp: { type: Number, default: 28 },
    condition: { type: String, default: 'Sunny' },
    rainChance: { type: Number, default: 15 },
    icon: { type: String, default: 'sun' }
  },
  popularAttractions: [{
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: 'Sightseeing' },
    typicalCost: { type: Number, default: 500 },
    image: { type: String },
    isIndoor: { type: Boolean, default: false }
  }],
  hotels: [{
    name: { type: String, required: true },
    rating: { type: Number, default: 3 },
    pricePerNight: { type: Number, required: true },
    location: { type: String },
    amenities: [{ type: String }],
    image: { type: String }
  }],
  activities: [{
    title: { type: String, required: true },
    category: { type: String, default: 'Adventure' },
    cost: { type: Number, default: 1000 },
    duration: { type: String, default: '2 hours' },
    isIndoor: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Destination', DestinationSchema);
