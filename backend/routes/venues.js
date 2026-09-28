// Routes: /api/venues
const express = require('express');
const router  = express.Router();
const { getVenues, getVenueById, getVenueAvailability } = require('../controllers/venueController');

router.get('/',                    getVenues);
router.get('/:id',                 getVenueById);
router.get('/:id/availability',    getVenueAvailability);

module.exports = router;
