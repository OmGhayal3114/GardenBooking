// Routes: /api/admin
const express  = require('express');
const router   = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getDashboardStats, getAllBookings, getAllUsers, addVenue, updateVenueStatus, createSlots, adminCancelBooking } = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats',                    getDashboardStats);
router.get('/bookings',                 getAllBookings);
router.get('/users',                    getAllUsers);
router.post('/venues',                  addVenue);
router.put('/venues/:id/status',        updateVenueStatus);
router.post('/slots',                   createSlots);
router.put('/bookings/:id/cancel',      adminCancelBooking);

module.exports = router;
