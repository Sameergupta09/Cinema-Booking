import { Fragment, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const Payment = () => {
  const [cardDetails, setCardDetails] = useState({
    fullName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  const ticketPrice = 250; // Fixed ticket price
  const [numTickets, setNumTickets] = useState(1);
  const gstRate = 0.18; // 18% GST
  const subTotal = numTickets * ticketPrice;
  const gstAmount = subTotal * gstRate;
  const totalPrice = subTotal + gstAmount;
 
  const navigate = useNavigate(); 
 

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    alert(`Processing Payment of ₹${totalPrice.toFixed(2)}...`);
    
  };

    const { auth } = useContext(AuthContext)
    const { id } = useParams()
    const [showtime, setShowtime] = useState({})
    const [selectedSeats, setSelectedSeats] = useState([])
    const [filterRow, setFilterRow] = useState(null)
    const [filterColumn, setFilterColumn] = useState(null)
    const sortedSelectedSeat = selectedSeats.sort((a, b) => {
      const [rowA, numberA] = a.match(/([A-Za-z]+)(\d+)/).slice(1)
      const [rowB, numberB] = b.match(/([A-Za-z]+)(\d+)/).slice(1)
      if (rowA === rowB) {
        if (parseInt(numberA) > parseInt(numberB)) {
          return 1
        } else {
          return -1
        }
      } else if (rowA.length > rowB.length) {
        return 1
      } else if (rowA.length < rowB.length) {
        return -1
      } else if (rowA > rowB) {
        return 1
      }
      return -1
    });

  return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
  <div className="bg-white/40 backdrop-blur-lg py-8 px-6 max-w-3xl mx-auto flex flex-col lg:flex-row gap-8 shadow-xl rounded-xl border border-black/20">
    {/* Payment Form */}
    <div className="w-full lg:w-2/3">
      <h2 className="text-xl font-semibold text-black">Credit Card Payment</h2>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">Number of Tickets</label>
          <input
            type="number"
            min="1"
            value={numTickets}
            onChange={(e) => setNumTickets(Number(e.target.value))}
            className="block w-full mt-2 p-2 border border-black/30 rounded-lg bg-white/50 backdrop-blur-md text-black placeholder-black/70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={cardDetails.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="block w-full mt-2 p-2 border border-black/30 rounded-lg bg-white/50 backdrop-blur-md text-black placeholder-black/70"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleChange}
            placeholder="xxxx-xxxx-xxxx-xxxx"
            className="block w-full mt-2 p-2 border border-black/30 rounded-lg bg-white/50 backdrop-blur-md text-black placeholder-black/70"
            required
          />
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-black">Expiry Date</label>
            <input
              type="text"
              name="expiry"
              value={cardDetails.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="block w-full mt-2 p-2 border border-black/30 rounded-lg bg-white/50 backdrop-blur-md text-black placeholder-black/70"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">CVV</label>
            <input
              type="text"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleChange}
              placeholder="•••"
              className="block w-full mt-2 p-2 border border-black/30 rounded-lg bg-white/50 backdrop-blur-md text-black placeholder-black/70"
              required
            />
          </div>
        </div>

        <button
            type="button"
            onClick={() => {
              handlePayment();
              if (auth?.role) {
                navigate(`/purchase/${id}`, {
                  state: { selectedSeats: sortedSelectedSeat, showtime },
                });
              } else {
                navigate('/login');
              }
            }}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Pay ₹{totalPrice.toFixed(2)} Now
          </button>

      </form>
    </div>

    {/* Invoice Summary */}
    <div className="w-full lg:w-1/3 border border-black/30 rounded-lg p-6 bg-white/40 backdrop-blur-lg text-black">
      <h3 className="text-lg font-semibold">Invoice</h3>
      <div className="mt-4 space-y-2">
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
</div>



  );
};

export default Payment;
