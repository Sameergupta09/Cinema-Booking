const Movie = require('../models/Movie')
const Showtime = require('../models/Showtime')
const Cinema = require('../models/Cinema')
const User = require('../models/User')

//@desc     GET all movies
//@route    GET /movie
//@access   Public
exports.getMovies = async (req, res, next) => {
	try {
		const movies = await Movie.find().sort({ createdAt: -1 })
		res.status(200).json({ success: true, count: movies.length, data: movies })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET showing movies
//@route    GET /movie/showing
//@access   Public
exports.getShowingMovies = async (req, res, next) => {
	try {
		const showingShowtime = await Showtime.aggregate([
			{ $match: { showtime: { $gte: new Date() }, isRelease: true } },
			{
				$lookup: {
					from: 'movies', // Replace "movies" with the actual collection name of your movies
					localField: 'movie',
					foreignField: '_id',
					as: 'movie'
				}
			},
			{
				$group: {
					_id: '$movie',
					count: { $sum: 1 }
				}
			},
			{
				$unwind: '$_id'
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$_id']
					}
				}
			},
			{
				$sort: { count: -1 }
			}
		])

		res.status(200).json({ success: true, data: showingShowtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET showing movies with all unreleased showtime
//@route    GET /movie/unreleased/showing
//@access   Private admin
exports.getUnreleasedShowingMovies = async (req, res, next) => {
	try {
		const showingShowtime = await Showtime.aggregate([
			{ $match: { showtime: { $gte: new Date() }, isRelease: true } },
			{
				$lookup: {
					from: 'movies', // Replace "movies" with the actual collection name of your movies
					localField: 'movie',
					foreignField: '_id',
					as: 'movie'
				}
			},
			{
				$group: {
					_id: '$movie',
					count: { $sum: 1 }
				}
			},
			{
				$unwind: '$_id'
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$_id']
					}
				}
			},
			{
				$sort: { count: -1, updatedAt: -1 }
			}
		])

		res.status(200).json({ success: true, data: showingShowtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     GET single movie
//@route    GET /movie/:id
//@access   Public
exports.getMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id)

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}

		res.status(200).json({ success: true, data: movie })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Create movie
//@route    POST /movie
//@access   Private
exports.createMovie = async (req, res, next) => {
	try {
		const movie = await Movie.create(req.body)
		res.status(201).json({
			success: true,
			data: movie
		})
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Update movies
//@route    PUT /movie/:id
//@access   Private Admin
exports.updateMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}
		res.status(200).json({ success: true, data: movie })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Delete single movies
//@route    DELETE /movie/:id
//@access   Private Admin
exports.deleteMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id)

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}

		await movie.deleteOne()
		res.status(200).json({ success: true })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

//@desc     Get dashboard statistics
//@route    GET /movie/stats
//@access   Private Admin
exports.getStats = async (req, res, next) => {
	try {
		// Get cinema count
		const cinemaCount = await Cinema.countDocuments();
		
		// Get user count (excluding current admin)
		const userCount = await User.countDocuments();
		
		// Get movie count
		const movieCount = await Movie.countDocuments();
		
		// Get total ticket count
		const ticketCount = await User.aggregate([
			{ $unwind: "$tickets" },
			{ $count: "total" }
		]);

		res.status(200).json({ 
			success: true, 
			data: { 
				cinemaCount, 
				userCount, 
				movieCount, 
				ticketCount: ticketCount.length > 0 ? ticketCount[0].total : 0
			}
		});
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err.message })
	}
}

//@desc     Get weekly booking data
//@route    GET /movie/weekly-bookings
//@access   Private Admin
exports.getWeeklyBookings = async (req, res, next) => {
	try {
		// Calculate dates for the current week (Sunday to Saturday)
		const today = new Date();
		const currentDay = today.getDay(); // 0 is Sunday, 6 is Saturday
		
		const firstDayOfWeek = new Date(today);
		firstDayOfWeek.setDate(today.getDate() - currentDay);
		firstDayOfWeek.setHours(0, 0, 0, 0);
		
		const lastDayOfWeek = new Date(firstDayOfWeek);
		lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
		lastDayOfWeek.setHours(23, 59, 59, 999);
		
		// Initialize array to hold counts for each day (0 = Sunday, 6 = Saturday)
		const weeklyData = Array(7).fill(0);
		
		// Get all tickets created within the week
		const showtimesWithBookings = await Showtime.find({
			createdAt: {
				$gte: firstDayOfWeek,
				$lte: lastDayOfWeek
			}
		});
		
		// Count tickets by day of week
		showtimesWithBookings.forEach(showtime => {
			const bookingDate = new Date(showtime.createdAt);
			const dayOfWeek = bookingDate.getDay(); // 0-6
			weeklyData[dayOfWeek] += showtime.seats.length;
		});
		
		res.status(200).json({ success: true, data: weeklyData });
	} catch (err) {
		console.log(err);
		res.status(400).json({ success: false, message: err.message });
	}
}

//@desc     Get top movies by ticket sales
//@route    GET /movie/top
//@access   Private Admin
exports.getTopMovies = async (req, res, next) => {
	try {
		const topMovies = await Showtime.aggregate([
			{ $unwind: "$seats" },
			{ 
				$group: {
					_id: "$movie",
					ticketCount: { $sum: 1 }
				}
			},
			{
				$lookup: {
					from: "movies",
					localField: "_id",
					foreignField: "_id",
					as: "movieDetails"
				}
			},
			{ $unwind: "$movieDetails" },
			{
				$project: {
					_id: 1,
					name: "$movieDetails.name",
					img: "$movieDetails.img",
					length: "$movieDetails.length",
					ticketCount: 1
				}
			},
			{ $sort: { ticketCount: -1 } },
			{ $limit: 10 }
		]);
		
		res.status(200).json({ success: true, data: topMovies });
	} catch (err) {
		console.log(err);
		res.status(400).json({ success: false, message: err.message });
	}
}