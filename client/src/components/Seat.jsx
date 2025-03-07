import { CheckIcon } from '@heroicons/react/24/outline'
import { memo, useState } from 'react'

const Seat = ({ seat, setSelectedSeats, selectable, isAvailable }) => {
	const [isSelected, setIsSelected] = useState(false)

	return (
		<button
			title={`${seat.row}${seat.number}`}
			className={`flex h-10 w-10 items-center justify-center rounded-md border-2 transition-all ${
				!isAvailable
					? 'cursor-not-allowed bg-gray-400 border-gray-500'
					: isSelected
					? 'bg-blue-500 border-blue-700 text-white shadow-md'
					: 'bg-white border-gray-300 hover:bg-gray-100 hover:shadow-lg'
			}`}
			onClick={() => {
				if (!isAvailable) return
				if (isSelected) {
					setIsSelected(false)
					setSelectedSeats((prev) => prev.filter((e) => e !== `${seat.row}${seat.number}`))
				} else if (selectable) {
					setIsSelected(true)
					setSelectedSeats((prev) => [...prev, `${seat.row}${seat.number}`])
				}
			}}
		>
			{isSelected && <CheckIcon className="h-5 w-5 stroke-[3] text-white" />}
		</button>
	)
}

export default memo(Seat)
