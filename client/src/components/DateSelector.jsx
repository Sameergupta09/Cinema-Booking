import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

const DateSelector = ({ selectedDate, setSelectedDate }) => {
	const { auth } = useContext(AuthContext)
	const wrapperRef = useRef(null)
	const [isEditing, SetIsEditing] = useState(false)

	const handlePrevDay = () => {
		const prevDay = new Date(selectedDate)
		prevDay.setDate(prevDay.getDate() - 1)
		setSelectedDate(prevDay)
		sessionStorage.setItem('selectedDate', prevDay)
	}

	const handleNextDay = () => {
		const nextDay = new Date(selectedDate)
		nextDay.setDate(nextDay.getDate() + 1)
		setSelectedDate(nextDay)
		sessionStorage.setItem('selectedDate', nextDay)
	}

	const handleToday = () => {
		const today = new Date()
		setSelectedDate(today)
		sessionStorage.setItem('selectedDate', today)
	}

	const formatDate = (date) => {
		const weekday = date.toLocaleString('default', { weekday: 'long' })
		const day = date.getDate()
		const month = date.toLocaleString('default', { month: 'long' })
		const year = date.getFullYear()
		return `${weekday} ${day} ${month} ${year}`
	}

	const DateShort = ({ date, selectedDate }) => {
		const day = date.getDate()
		const weekday = date.toLocaleString('default', { weekday: 'short' })

		const isThisDate =
			selectedDate.getDate() === date.getDate() &&
			selectedDate.getMonth() === date.getMonth() &&
			selectedDate.getFullYear() === date.getFullYear()

		const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)

		return (
			<button
				title={formatDate(date)}
				className={`flex min-w-[48px] flex-col items-center justify-center rounded p-1 font-semibold ${
					isThisDate
						? 'bg-gradient-to-br from-indigo-800 to-blue-700 text-white'
						: isToday
						? 'bg-gradient-to-br from-indigo-100 to-white ring-2 ring-inset ring-indigo-800 hover:from-white hover:to-white'
						: isPast(date)
						? 'bg-gradient-to-br from-gray-600 to-gray-500 text-white hover:from-gray-500 hover:to-gray-400'
						: 'bg-gradient-to-br from-indigo-100 to-white hover:from-white hover:to-white'
				}`}
				onClick={() => {
					setSelectedDate(date)
					sessionStorage.setItem('selectedDate', date)
				}}
			>
				<p className="text-sm">{weekday}</p>
				<p className="text-xl">{day}</p>
			</button>
		)
	}

	const isPast = (date) => {
		return new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
	}

	const handleChange = (event) => {
		setSelectedDate(new Date(event.target.value))
	}

	function generateDateRange(startDate, endDate) {
		const dates = []
		const currentDate = new Date(startDate)

		while (currentDate <= endDate) {
			dates.push(new Date(currentDate.getTime()))
			currentDate.setDate(currentDate.getDate() + 1)
		}

		return dates
	}

	function getPastAndNextDateRange() {
		const today = new Date()
		const pastDays = new Date(today)
		if (auth.role === 'admin') {
			pastDays.setDate(today.getDate() - 7)
		}

		const nextDays = new Date(today)
		nextDays.setDate(today.getDate() + 14)

		return generateDateRange(pastDays, nextDays)
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, false)
		return () => {
			document.removeEventListener('click', handleClickOutside, false)
		}
	}, [])

	const handleClickOutside = (event) => {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
			SetIsEditing(false)
		}
	}

	return (
		<div className="flex flex-col gap-4">
    {/* Date Navigation Bar */}
    <div className="relative flex items-center justify-between rounded-xl bg-gradient-to-br from-indigo-800 to-blue-700 p-3 text-white shadow-lg">
        {/* Previous Day Button */}
        {auth.role === 'admin' || !isPast(new Date().setDate(selectedDate.getDate() - 1)) ? (
            <button
                title="Go to yesterday"
                className="rounded-xl p-2 transition-all hover:scale-105 hover:bg-indigo-600"
                onClick={handlePrevDay}
            >
                <ChevronLeftIcon className="h-8 w-8 text-white" />
            </button>
        ) : (
            <div className="h-8 w-8"></div>
        )}

        {/* Date Display */}
        {isEditing ? (
            <div className="w-full text-center" ref={wrapperRef}>
                <input
                    type="date"
                    className="w-full rounded-lg border border-white bg-transparent p-2 text-center text-lg font-semibold text-white outline-none transition-all focus:ring-2 focus:ring-blue-300"
                    value={selectedDate.toLocaleDateString('en-CA')}
                    onChange={handleChange}
                />
            </div>
        ) : (
            <div
                className="cursor-pointer text-lg font-semibold transition-all hover:scale-105"
                onClick={() => SetIsEditing(true)}
            >
                {formatDate(selectedDate)}
            </div>
        )}

        {/* Next Day & Today Buttons */}
        <div className="flex gap-2">
            <button
                title="Go to tomorrow"
                className="rounded-xl p-2 transition-all hover:scale-105 hover:bg-indigo-600"
                onClick={handleNextDay}
            >
                <ChevronRightIcon className="h-8 w-8 text-white" />
            </button>
            <button
                title="Go to today"
                className="rounded-xl p-2 transition-all hover:scale-105 hover:bg-indigo-600"
                onClick={handleToday}
            >
                <ArrowPathIcon className="h-8 w-8 text-white" />
            </button>
        </div>
    </div>

    {/* Date Short Buttons */}
    <div className="flex gap-2 overflow-x-auto">
        {getPastAndNextDateRange().map((date, index) => (
            <button
                key={index}
                title={formatDate(date)}
                className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    selectedDate.getTime() === date.getTime()
                        ? 'bg-gradient-to-br from-indigo-700 to-blue-600 text-white shadow-md'
                        : isPast(date)
                        ? 'bg-gray-500 text-gray-300 hover:bg-gray-400'
                        : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                }`}
                onClick={() => {
                    setSelectedDate(date)
                    sessionStorage.setItem('selectedDate', date)
                }}
            >
                <p className="text-sm">{date.toLocaleString('default', { weekday: 'short' })}</p>
                <p className="text-xl">{date.getDate()}</p>
            </button>
        ))}
    </div>
</div>

	)
}

export default DateSelector
