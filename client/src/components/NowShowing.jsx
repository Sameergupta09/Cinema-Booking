import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
	return (
		<div className="mx-4 flex flex-col rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-6 text-gray-900 shadow-lg sm:mx-8 sm:p-8">
			<h2 className="text-3xl font-bold text-gray-800">Now Showing</h2>

			{isFetchingMoviesDone ? (
				movies.length ? (
					<div className="mt-3 overflow-x-auto">
						<div className="mx-auto flex w-fit gap-5">
							{movies.map((movie, index) => (
								<div
									key={index}
									title={movie.name}
									className={`flex w-[120px] flex-col rounded-lg p-1 transition-all duration-300 sm:w-[160px] ${
										selectedMovieIndex === index
											? "bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg hover:scale-105"
											: "bg-white shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-blue-400 hover:text-white"
									}`}
									onClick={() => {
										const newIndex = selectedMovieIndex === index ? null : index;
										setSelectedMovieIndex(newIndex);
										sessionStorage.setItem("selectedMovieIndex", newIndex);
									}}
								>
									<img
										src={movie.img}
										alt={movie.name}
										className="h-40 rounded-lg object-cover shadow-md sm:h-52"
									/>
									<p className="truncate pt-2 text-center text-sm font-semibold sm:text-base">
										{movie.name}
									</p>
								</div>
							))}
						</div>
					</div>
				) : (
					<p className="mt-4 text-center text-lg text-gray-600">There are no movies available</p>
				)
			) : (
				<Loading />
			)}
		</div>
	);
};

export default NowShowing;
