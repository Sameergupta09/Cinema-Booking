import { ArrowsRightLeftIcon, ArrowsUpDownIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDraggable } from "react-use-draggable-scroll";
import { AuthContext } from "../context/AuthContext";

const ScheduleTable = ({ cinema, selectedDate }) => {
	const ref = useRef(null);
	const { auth } = useContext(AuthContext);
	const { events } = useDraggable(ref);
	const navigate = useNavigate();

	const getRowStart = (showtime) => {
		showtime = new Date(showtime);
		return Math.round((60 * showtime.getHours() + showtime.getMinutes()) / 5);
	};

	const getRowSpan = (length) => Math.round(length / 5);

	const getTodayShowtimes = (theater) => {
		return theater.showtimes?.filter((showtime) => {
			const date = new Date(showtime.showtime);
			return date.getDate() === selectedDate.getDate() &&
				date.getMonth() === selectedDate.getMonth() &&
				date.getFullYear() === selectedDate.getFullYear();
		});
	};

	const isPast = (date) => date < new Date();

	const [firstRowStart, lastRowEnd, showtimeCount] = (() => {
		let first = Infinity, last = 0, count = 0;
		cinema.theaters.forEach((theater) => {
			theater.showtimes.forEach((showtime) => {
				if (getTodayShowtimes(theater).includes(showtime)) {
					const start = getRowStart(showtime.showtime);
					first = Math.min(first, start);
					last = Math.max(last, start + getRowSpan(showtime.movie.length));
					count++;
				}
			});
		});
		return [first, last, count];
	})();

	const gridRows = Math.max(1, lastRowEnd - firstRowStart);
	const shiftStart = 3, shiftEnd = 2;

	return (
		<div
			className={`grid min-h-[50vh] max-h-screen overflow-x-auto 
				grid-cols-${cinema.theaters.length} grid-rows-${gridRows + shiftEnd} 
				rounded-lg bg-gradient-to-br from-indigo-100 to-white p-4 shadow-lg`}
			{...events}
			ref={ref}
		>
			{cinema.theaters?.map((theater, theaterIndex) =>
				getTodayShowtimes(theater)?.map((showtime, showtimeIndex) => (
					<button
						key={showtimeIndex}
						className={`flex flex-col items-center p-2 text-center text-sm font-semibold transition-all duration-300
							row-span-${getRowSpan(showtime.movie.length)} 
							row-start-${getRowStart(showtime.showtime) - firstRowStart + shiftStart} 
							col-start-${theater.number} mx-1 rounded-lg shadow-md
							${!isPast(new Date(showtime.showtime)) ? "bg-white hover:bg-gray-100" : 
								`bg-gray-200 ${auth.role === "admin" ? "hover:bg-gray-300" : "cursor-not-allowed"}`}
							${!showtime.isRelease && "ring-2 ring-gray-800 ring-inset"}`}
						onClick={() => {
							if (!isPast(new Date(showtime.showtime)) || auth.role === "admin") {
								navigate(`/showtime/${showtime._id}`);
							}
						}}
						title={`${showtime.movie.name}\n${new Date(showtime.showtime).toLocaleTimeString()} - 
							${new Date(new Date(showtime.showtime).getTime() + showtime.movie.length * 60000).toLocaleTimeString()}`}
					>
						{!showtime.isRelease && <EyeSlashIcon className="h-5 w-5 text-gray-800" title="Unreleased showtime" />}
						<p>{showtime.movie.name}</p>
						<p className="text-xs">{new Date(showtime.showtime).toLocaleTimeString()} - 
							{new Date(new Date(showtime.showtime).getTime() + showtime.movie.length * 60000).toLocaleTimeString()}</p>
					</button>
				))
			)}

			{showtimeCount === 0 && (
				<div className="col-span-full row-start-3 flex items-center justify-center text-lg font-medium text-gray-600">
					No showtimes available
				</div>
			)}

			{cinema.theaters.map((theater, index) => (
				<div
					key={index}
					className="sticky top-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700 p-2 text-white rounded-lg shadow-md"
				>
					<p className="text-xl font-semibold">{index + 1}</p>
					{auth.role === "admin" && (
						<>
							<div className="flex gap-2 text-xs">
								<p className="flex items-center gap-1">
									<ArrowsUpDownIcon className="h-4 w-4" />
									{theater.seatPlan.row}
								</p>
								<p className="flex items-center gap-1">
									<ArrowsRightLeftIcon className="h-4 w-4" />
									{theater.seatPlan.column}
								</p>
							</div>
							<p className="flex items-center gap-1 text-sm">
								<UserIcon className="h-4 w-4" />
								{(theater.seatPlan.row.length * theater.seatPlan.column).toLocaleString()} Seats
							</p>
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default ScheduleTable;
