import { TicketIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Purchase = () => {
	const navigate = useNavigate()
	const { auth } = useContext(AuthContext)
	const location = useLocation()
	const showtime = location.state?.showtime
	const selectedSeats = location.state?.selectedSeats || []
	const [isPurchasing, setIsPurchasing] = useState(false)
	const [paymentMethod, setPaymentMethod] = useState('')
	const [cardDetails, setCardDetails] = useState({
		fullName: '',
		cardNumber: '',
		expiry: '',
		cvv: ''
	})

	// Calculate Prices
	const seatPrice = 150 // Assuming each seat costs ₹150
	const subTotal = selectedSeats.length * seatPrice
	const gstAmount = subTotal * 0.18
	const totalPrice = subTotal + gstAmount

	const handleChange = (e) => {
		const { name, value } = e.target
		setCardDetails((prev) => ({ ...prev, [name]: value }))
	}

	const onPurchase = async () => {
		if (!paymentMethod) {
			toast.warn('Please select a payment method!', { position: 'top-center', autoClose: 2000 })
			return
		}

		if (paymentMethod === 'Credit Card' && (!cardDetails.fullName || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv)) {
			toast.warn('Please fill in all credit card details!', { position: 'top-center', autoClose: 2000 })
			return
		}

		setIsPurchasing(true)
		try {
			await axios.post(
				`/showtime/${showtime._id}`,
				{ seats: selectedSeats, paymentMethod },
				{ headers: { Authorization: `Bearer ${auth.token}` } }
			)
			toast.success('Purchase successful!', { position: 'top-center', autoClose: 2000 })
			navigate('/cinema')
		} catch (error) {
			console.error(error)
			toast.error(error.response?.data?.message || 'Something went wrong', { position: 'top-center', autoClose: 2000 })
		} finally {
			setIsPurchasing(false)
		}
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
			<Navbar />
			<div className="mx-4 h-fit rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<ShowtimeDetails showtime={showtime} />

				<div className="flex flex-col md:flex-row gap-8 mt-6">
					{/* Left Side - Payment Options */}
					<div className="w-full md:w-2/3 p-4 bg-white shadow-md rounded-lg">
						<h2 className="text-xl font-semibold mb-2">Select Payment Method:</h2>
						<div className="flex flex-col sm:flex-row gap-4">
							<label
								className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${
									paymentMethod === 'UPI' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
								}`}
								onClick={() => setPaymentMethod('UPI')}
							>
								<input type="radio" name="payment" value="UPI" className="hidden" />
								<span className="text-lg font-medium">UPI</span>
							</label>

							<label
								className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${
									paymentMethod === 'Credit Card' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
								}`}
								onClick={() => setPaymentMethod('Credit Card')}
							>
								<input type="radio" name="payment" value="Credit Card" className="hidden" />
								<span className="text-lg font-medium">Credit Card</span>
							</label>
						</div>

						{/* UPI Payment Form */}
						{paymentMethod === 'UPI' && (
							<div className="w-full lg:w-2/3 flex justify-center pt-6">
								<div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg w-full max-w-md relative text-white">
									<h2 className="text-xl font-semibold">UPI Payment</h2>
									
									<form className="mt-6 space-y-4">
										{/* UPI ID Input */}
										<div>
											<label className="block text-sm font-medium">UPI ID</label>
											<input
												type="text"
												name="upiId"
												value={cardDetails.upiId || ''}
												onChange={handleChange}
												placeholder="yourname@upi"
												className="block w-full mt-2 p-2 border border-gray-500 rounded-lg bg-transparent text-white placeholder-gray-400"
												required
											/>
										</div>
									</form>
								</div>
							</div>
						)}

						{/* Credit Card Payment Form */}
						{paymentMethod === 'Credit Card' && (
  <div className="w-full lg:w-2/3 flex justify-center pt-6">
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg w-full max-w-md relative text-white">
      <h2 className="text-xl font-semibold">Credit Card Payment</h2>

      <form className="mt-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={cardDetails.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="block w-full mt-2 p-2 border border-gray-500 rounded-lg bg-transparent text-white placeholder-gray-400 tracking-wide"
            required
          />
          {!/^[a-zA-Z\s]+$/.test(cardDetails.fullName) && cardDetails.fullName.length > 0 && (
            <p className="text-red-400 text-xs mt-1">Enter a valid name.</p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX XXXX"
            className="block w-full mt-2 p-2 border border-gray-500 rounded-lg bg-transparent text-white placeholder-gray-400 tracking-wider"
            required
          />
          {!/^\d{16}$/.test(cardDetails.cardNumber) && cardDetails.cardNumber.length > 0 && (
            <p className="text-red-400 text-xs mt-1">Card number must be 16 digits.</p>
          )}
        </div>

				{/* Expiry Date & CVV */}
				<div className="flex space-x-4">
				<div>
					<label className="block text-sm font-medium">Expiry Date</label>
					<input
					type="text"
					name="expiry"
					value={cardDetails.expiry}
					onChange={handleChange}
					placeholder="MM/YY"
					className="block w-full mt-2 p-2 border border-gray-500 rounded-lg bg-transparent text-white placeholder-gray-400"
					required
					/>
					{!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry) && cardDetails.expiry.length > 0 && (
					<p className="text-red-400 text-xs mt-1">Enter a valid expiry date (MM/YY).</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium">CVV</label>
					<input
					type="text"
					name="cvv"
					value={cardDetails.cvv}
					onChange={handleChange}
					placeholder="•••"
					className="block w-full mt-2 p-2 border border-gray-500 rounded-lg bg-transparent text-white placeholder-gray-400"
					required
					/>
					{!/^\d{3}$/.test(cardDetails.cvv) && cardDetails.cvv.length > 0 && (
					<p className="text-red-400 text-xs mt-1">CVV must be 3 digits.</p>
					)}
				</div>
				</div>
			</form>

			{/* Card Design Elements */}
			<div className="absolute top-4 right-4">
				<span className="text-xs font-semibold">VISA / Mastercard</span>
			</div>
			</div>
		</div>
		)}

						

						
	</div>

					{/* Right Side - Invoice */}
					<div className="w-full md:w-1/3 p-6 bg-white rounded-lg shadow-md">
						<h3 className="text-lg font-semibold">Invoice</h3>
						<div className="mt-4 space-y-2">
							<div className="flex justify-between">
								<span>Selected Seats</span>
								<span>{selectedSeats.join(', ')}</span>
							</div>
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>₹{subTotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>GST (18%)</span>
								<span>₹{gstAmount.toFixed(2)}</span>
							</div>
							<div className="border-t border-black/20 pt-2 flex justify-between font-bold">
								<span>Total</span>
								<span>₹{totalPrice.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Confirm Purchase Button */}
				<div className="mt-4 flex justify-center">
					<button
						onClick={onPurchase}
						className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-6 py-2 font-semibold text-white hover:from-indigo-500 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-300"
						disabled={isPurchasing || !paymentMethod || (paymentMethod === 'Credit Card' && (!cardDetails.fullName || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv))}
					>
						{isPurchasing ? 'Processing...' : (
							<>
								<p>Confirm Purchase - ₹{totalPrice.toFixed(2)}</p>
								<TicketIcon className="h-7 w-7 text-white" />
							</>
						)}
					</button>
				</div>

			</div>
		</div>
	)
}

export default Purchase
