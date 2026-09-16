const express = require('express');
const router = express.Router();
const { searchBookings, createBooking, getUserBookings } = require('../controllers/bookingController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/search', searchBookings);
router.post('/', optionalAuth, createBooking);
router.get('/', optionalAuth, getUserBookings);

module.exports = router;
