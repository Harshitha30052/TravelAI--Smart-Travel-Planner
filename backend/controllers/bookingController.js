const Booking = require('../models/Booking');

// Mock flight inventory generator
const generateFlightOptions = (origin, destination, date, travelers = 1) => {
  const airlines = [
    { name: 'IndiGo 6E-204', departure: '06:15 AM', arrival: '08:45 AM', duration: '2h 30m', basePrice: 4200, stops: 'Non-stop' },
    { name: 'Air India AI-882', departure: '10:30 AM', arrival: '01:15 PM', duration: '2h 45m', basePrice: 5100, stops: 'Non-stop' },
    { name: 'Vistara UK-993', departure: '03:40 PM', arrival: '06:10 PM', duration: '2h 30m', basePrice: 6200, stops: 'Non-stop' },
    { name: 'SpiceJet SG-441', departure: '08:00 PM', arrival: '10:35 PM', duration: '2h 35m', basePrice: 3800, stops: 'Non-stop' }
  ];

  return airlines.map(a => ({
    id: `fl-${Math.random().toString(36).substr(2, 6)}`,
    provider: a.name,
    flightNumber: a.name,
    from: origin || 'Delhi (DEL)',
    to: destination,
    departureTime: a.departure,
    arrivalTime: a.arrival,
    duration: a.duration,
    stops: a.stops,
    pricePerPerson: a.basePrice,
    totalPrice: a.basePrice * travelers,
    currency: 'INR'
  }));
};

// Mock transport inventory
const generateTransportOptions = (destination, travelers = 1) => {
  return [
    {
      id: `tr-1`,
      type: 'Private AC Sedan Cab',
      provider: 'MakeMyTrip Cabs / TravelAI Fleet',
      capacity: '4 Passengers',
      price: 2400,
      description: 'Dedicated driver with airport pickup and city tour inclusion.'
    },
    {
      id: `tr-2`,
      type: 'Self-Drive SUV (Hyundai Creta)',
      provider: 'Zoomcar / Myles Partner',
      capacity: '5 Passengers',
      price: 3200,
      description: 'Unlimited kilometers, comprehensive insurance included.'
    },
    {
      id: `tr-3`,
      type: 'Luxury Multi-Axle Volvo Sleeper',
      provider: 'KSRTC / Zingbus Premier',
      capacity: 'Per Seat',
      price: 1100 * travelers,
      description: 'Air-conditioned luxury semi-sleeper with WiFi and charging points.'
    }
  ];
};

// @desc    Search booking inventory (flights, hotels, transport)
// @route   GET /api/bookings/search
// @access  Public
const searchBookings = async (req, res) => {
  try {
    const { type = 'flight', origin = 'New Delhi', destination = 'Goa', date, travelers = 2 } = req.query;
    const numTravelers = parseInt(travelers, 10) || 1;

    let results = [];
    if (type === 'flight') {
      results = generateFlightOptions(origin, destination, date, numTravelers);
    } else if (type === 'transport') {
      results = generateTransportOptions(destination, numTravelers);
    }

    res.json({
      success: true,
      type,
      destination,
      travelers: numTravelers,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public / Private
const createBooking = async (req, res) => {
  try {
    const { bookingType, destination, provider, title, details, startDate, endDate, travelers, totalPrice } = req.body;

    const booking = new Booking({
      userId: req.user ? req.user._id : null,
      bookingType,
      destination,
      provider,
      title,
      details,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate,
      travelers: travelers || 1,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed! (Simulated transaction)',
      booking
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Public / Private
const getUserBookings = async (req, res) => {
  try {
    const filter = req.user ? { userId: req.user._id } : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchBookings,
  createBooking,
  getUserBookings
};
