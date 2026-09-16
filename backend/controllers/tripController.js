const Trip = require('../models/Trip');
const { generateTripPDF } = require('../services/pdfService');

// @desc    Get all user trips
// @route   GET /api/trips
// @access  Public / Private
const getTrips = async (req, res) => {
  try {
    const filter = req.user ? { userId: req.user._id } : {};
    const trips = await Trip.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Public / Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new trip
// @route   POST /api/trips
// @access  Public / Private
const createTrip = async (req, res) => {
  try {
    const tripData = { ...req.body };
    if (req.user) {
      tripData.userId = req.user._id;
    }
    const trip = new Trip(tripData);
    await trip.save();
    res.status(201).json({ success: true, trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Public / Private
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Public / Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download Trip as PDF
// @route   GET /api/trips/:id/pdf
// @access  Public / Private
const downloadTripPDF = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const filename = `Itinerary_${trip.destination.replace(/\s+/g, '_')}_${trip.durationDays}Days.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    generateTripPDF(trip, res);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF itinerary' });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  downloadTripPDF
};
