// server/routes/dashboard.js
const express = require("express");
const router = express.Router();
const Cinema = require("../models/Cinema");
// const Booking = require("../models/Booking");
const User = require("../models/User");
const Movie = require("../models/Movie");

router.get("/dashboard-stats", async (req, res) => {
  try {
    const cinemas = await Cinema.countDocuments();
    // const bookings = await Booking.countDocuments();
    const users = await User.countDocuments();
    const movies = await Movie.countDocuments();

    res.json({ cinemas, bookings, users, movies });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
