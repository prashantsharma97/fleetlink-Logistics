const express = require('express');
const router = express.Router();
const bookingsCtrl = require('../controllers/bookings.controller');
const auth = require('../middleware/auth.middleware');

router.post('/api/bookings', auth, bookingsCtrl.createBooking);
router.get('/api/bookings-details', auth, bookingsCtrl.getUserBookings);
router.delete('/api/bookings/:id', auth, bookingsCtrl.cancelBooking);

module.exports = router;
