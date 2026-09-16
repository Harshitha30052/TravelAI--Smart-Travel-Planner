const express = require('express');
const router = express.Router();
const { getDestinations, getDestinationByName } = require('../controllers/destinationController');

router.get('/', getDestinations);
router.get('/:name', getDestinationByName);

module.exports = router;
