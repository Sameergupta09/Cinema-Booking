import { EyeSlashIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Showtimes = ({ showtimes, movies, selectedDate, filterMovie, showMovieDetail = true }) => {
	const { auth } = useContext(AuthContext)
	const navigate = useNavigate()

	const sortedShowtimes = showtimes?.reduce((result, showtime) => {
		const { movie, showtime: showDateTime, seats, _id, isRelease } = showtime

		if (filterMovie && filterMovie._id !== movie) {
			return result
		}

		if (
			new Date(showDateTime).toDateString() === selectedDate.toDateString()
		) {
			if (!result[movie]) {
				result[movie] = []
			}
			result[movie].push({ showtime: showDateTime, seats, _id, isRelease })
		}
		return result
	}, {})

	sortedShowtimes &&
		Object.values(sortedShowtimes).forEach((movie) => {
			movie.sort((a, b) => new Date(a.showtime) - new Date(b.showtime))
		})

	const isPast = (date) => date < new Date()

	if (!Object.keys(sortedShowtimes).length) {
		return <p className="text-center text-gray-500">No showtimes available</p>
	}

	return (
		<div className="space-y-6">
			{movies?.map((movie, index) => (
				sortedShowtimes[movie._id] && (
					<div key={index} className="flex items-center gap-6 p-4 bg-white shadow-lg rounded-lg">
						{showMovieDetail && (
							<img src={movie.img} alt={movie.name} className="w-24 h-36 object-cover rounded-lg shadow-md" />
						)}
						<div className="flex flex-col gap-3">
							{showMovieDetail && (
								<div>
									<h4 className="text-xl font-semibold text-gray-800">{movie.name}</h4>
									<p className="text-sm text-gray-600">Length: {movie.length || '-'} min</p>
								</div>
							)}
							<div className="flex flex-wrap gap-2">
								{sortedShowtimes[movie._id]?.map((showtime, index) => (
									<button
										key={index}
										title={
											`${new Date(showtime.showtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
									}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-300 ${
											isPast(new Date(showtime.showtime))
												? 'bg-gray-300 text-gray-600 cursor-not-allowed'
												: 'bg-blue-600 text-white hover:bg-blue-500'
										}`}
										onClick={() => {
											if (!isPast(new Date(showtime.showtime)) || auth.role === 'admin') {
												navigate(`/showtime/${showtime._id}`)
											}
										}}
									>
										{!showtime.isRelease && (
											<EyeSlashIcon className="w-5 h-5 text-white" title="Unreleased showtime" />
										)}
										{new Date(showtime.showtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</button>
								))}
							</div>
						</div>
					</div>
				)
			))}
		</div>
	)
}

export default Showtimes
