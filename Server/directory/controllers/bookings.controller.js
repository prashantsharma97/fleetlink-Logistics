const Vehicle = require('../models/Vehicle.model');
const Booking = require('../models/Booking.model');
const { calcEstimatedRideDurationHours } = require('../services/rideDuration.service');
const { createBookingSchema } = require('../validators/bookings.validator');

exports.createBooking = async (req, res) => {
  try {
    const { error } = createBookingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ error: 'Missing booking details' });
    }

    const durationHours = calcEstimatedRideDurationHours(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

    const booking = await Booking.create({
      vehicleId,
      customerId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,   
    });

    return res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.deleteOne();
    return res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ error: 'customerId query param required' });
    }

    const bookings = await Booking.find({ customerId }).populate('vehicleId', 'name capacityKg tyres');
    return res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};