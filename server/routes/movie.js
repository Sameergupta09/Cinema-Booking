const express = require('express')
const {
	getMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
	getShowingMovies,
	getUnreleasedShowingMovies,
	getStats,
	getWeeklyBookings,
	getTopMovies
} = require('../controllers/movieController')
const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.route('/').get(getMovies).post(protect, authorize('admin'), createMovie)
router.route('/showing').get(getShowingMovies)
router.route('/unreleased/showing').get(protect, authorize('admin'), getUnreleasedShowingMovies)
router.route('/stats').get(protect, authorize('admin'), getStats)
router.route('/weekly-bookings').get(protect, authorize('admin'), getWeeklyBookings)
router.route('/top').get(protect, authorize('admin'), getTopMovies)
router
	.route('/:id')
	.get(getMovie)
	.put(protect, authorize('admin'), updateMovie)
	.delete(protect, authorize('admin'), deleteMovie)

module.exports = router
