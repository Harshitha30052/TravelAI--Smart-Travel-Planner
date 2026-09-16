const Destination = require('../models/Destination');

// @desc    Get all destinations with optional category/search filter
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const destinations = await Destination.find(filter).sort({ rating: -1 });
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get destination by name or ID
// @route   GET /api/destinations/:name
// @access  Public
const getDestinationByName = async (req, res) => {
  try {
    const param = req.params.name;
    let destination;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      destination = await Destination.findById(param);
    } else {
      destination = await Destination.findOne({
        name: { $regex: new RegExp(`^${param}$`, 'i') }
      });
    }

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDestinations,
  getDestinationByName
};
