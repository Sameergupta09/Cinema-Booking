const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create Booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Booking failed' });
  }
});

// (Optional) Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId movieId cinemaId showtimeId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

module.exports = router;
