import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from './Loading'
const CinemaLists = ({
	cinemas,
	selectedCinemaIndex,
	setSelectedCinemaIndex,
	fetchCinemas,
	auth,
	isFetchingCinemas = false
}) => {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const [isAdding, SetIsAdding] = useState(false)

	const onAddCinema = async (data) => {
		try {
			SetIsAdding(true)
			const response = await axios.post('/cinema', data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			reset()
			fetchCinemas(data.name)
			toast.success('Add cinema successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsAdding(false)
		}
	}

	const CinemaLists = ({ cinemas }) => {
		const cinemasList = cinemas?.filter((cinema) =>
			cinema.name.toLowerCase().includes(watch('search')?.toLowerCase() || '')
		)

		return cinemasList.length ? (
			cinemasList.map((cinema, index) => {
				return cinemas[selectedCinemaIndex]?._id === cinema._id ? (
					<button
						className="w-fit rounded-md bg-gradient-to-br from-indigo-800 to-blue-700 px-2.5 py-1.5 text-lg font-medium text-white drop-shadow-xl hover:from-indigo-700 hover:to-blue-600"
						onClick={() => {
							setSelectedCinemaIndex(null)
							sessionStorage.setItem('selectedCinemaIndex', null)
						}}
						key={index}
					>
						{cinema.name}
					</button>
				) : (
					<button
						className="w-fit rounded-md bg-gradient-to-br from-indigo-800 to-blue-700 px-2 py-1 font-medium text-white drop-shadow-md hover:from-indigo-700 hover:to-blue-600"
						onClick={() => {
							setSelectedCinemaIndex(index)
							sessionStorage.setItem('selectedCinemaIndex', index)
						}}
						key={index}
					>
						{cinema.name}
					</button>
				)
			})
		) : (
			<div>No cinemas found</div>
		)
	}

	return (
		<>
			<div className="mx-4 flex h-fit flex-col gap-6 rounded-2xl bg-white/10 backdrop-blur-lg p-6 text-gray-900 shadow-2xl sm:mx-8 sm:p-8 border border-white/20">
    <form className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3" onSubmit={handleSubmit(onAddCinema)}>
        <h2 className="text-4xl font-extrabold text-white drop-shadow-md">Cinema Lists</h2>
        {auth.role === 'admin' && (
            <div className="flex w-fit grow sm:justify-end">
                <input
                    placeholder="Type a cinema name"
                    className="w-full grow rounded-l-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-300 sm:max-w-xs shadow-md"
                    required
                    {...register('name', { required: true })}
                />
                <button
                    disabled={isAdding}
                    className="flex items-center whitespace-nowrap rounded-r-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400 shadow-md"
                >
                    {isAdding ? 'Processing...' : 'ADD +'}
                </button>
            </div>
        )}
    </form>

    {/* Search bar */}
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <MagnifyingGlassIcon className="h-6 w-6 stroke-2 text-gray-500" />
        </div>
        <input
            type="search"
            className="block w-full rounded-lg border border-gray-300 bg-white/80 p-3 pl-12 text-gray-900 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search cinema"
            {...register('search')}
        />
    </div>

    {/* Cinema List */}
    {isFetchingCinemas ? (
        <Loading />
    ) : (
        <div className="flex flex-wrap items-center gap-4">
            {cinemas?.length ? (
                cinemas
                    .filter((cinema) =>
                        cinema.name.toLowerCase().includes(watch('search')?.toLowerCase() || '')
                    )
                    .map((cinema, index) => (
                        <button
                            key={index}
                            className={`w-fit rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 shadow-md ${
                                cinemas[selectedCinemaIndex]?._id === cinema._id
                                    ? 'bg-gradient-to-br from-indigo-800 to-blue-700 text-white drop-shadow-xl hover:scale-105'
                                    : 'bg-gradient-to-br from-gray-200 to-gray-100 text-gray-900 hover:from-gray-300 hover:to-gray-200'
                            }`}
                            onClick={() => {
                                setSelectedCinemaIndex(selectedCinemaIndex === index ? null : index);
                                sessionStorage.setItem('selectedCinemaIndex', index);
                            }}
                        >
                            {cinema.name}
                        </button>
                    ))
            ) : (
                <div className="text-lg font-medium text-gray-300">No cinemas found</div>
            )}
        </div>
    )}
</div>

		</>
	)
}

export default CinemaLists
