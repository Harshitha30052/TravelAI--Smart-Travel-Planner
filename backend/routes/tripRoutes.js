const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  downloadTripPDF
} = require('../controllers/tripController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(optionalAuth, getTrips)
  .post(optionalAuth, createTrip);

router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

router.route('/:id/pdf')
  .get(downloadTripPDF);

module.exports = router;
