import { TrashIcon } from "@heroicons/react/24/solid";

const MovieLists = ({ movies = [], search = "", handleDelete }) => {
	// Filter movies based on search query
	const filteredMovies = movies.filter((movie) =>
		movie.name.toLowerCase().includes(search.toLowerCase())
	);

	// No movies found message
	if (!filteredMovies.length) {
		return (
			<div className="flex h-40 items-center justify-center rounded-md bg-white text-center text-lg font-semibold text-gray-500 shadow-md">
				No movies found.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 shadow-lg 
		lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-5">
			{filteredMovies.map((movie, index) => (
				<div
					key={index}
					className="flex min-w-fit flex-grow overflow-hidden rounded-md bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
				>
					<img
						src={movie.img}
						alt={movie.name}
						className="h-36 w-24 rounded-l-md object-cover sm:h-48 sm:w-32"
					/>
					<div className="flex flex-grow flex-col justify-between p-3">
						<div>
							<p className="text-lg font-semibold sm:text-xl">{movie.name}</p>
							<p className="text-sm text-gray-600">Length: {movie.length ? `${movie.length} min` : "-"}</p>
						</div>
						<button
							className="flex w-fit items-center gap-1 self-end rounded-md bg-gradient-to-br from-red-700 to-rose-600 px-2 py-1 text-sm font-medium text-white transition-all duration-300 hover:from-red-600 hover:to-rose-500"
							onClick={() => handleDelete(movie)}
						>
							DELETE
							<TrashIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default MovieLists;
