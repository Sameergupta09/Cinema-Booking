import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaFilm, FaTicketAlt, FaUsers, FaVideo } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';




export default function Dashboard() {
  const [stats, setStats] = useState({
    cinemas: 0,
    bookings: 0,
    users: 0,
    movies: 0,
  });
  const navigate = useNavigate();

  const weeklyData = [
    { name: "Mon", bookings: 50 },
    { name: "Tue", bookings: 80 },
    { name: "Wed", bookings: 65 },
    { name: "Thu", bookings: 90 },
    { name: "Fri", bookings: 120 },
    { name: "Sat", bookings: 150 },
    { name: "Sun", bookings: 130 },
  ];

  useEffect(() => {
    // Fetch data from your backend API
    axios.get("http://localhost:5000/api/dashboard-stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
  <Navbar />

  {/* Logo */}
  <div className="p-8 flex items-center justify-between bg-white shadow-md rounded-b-2xl">
    <h1 className="text-4xl font-bold text-blue-700">🎬 Cinema Booking Dashboard</h1>
  </div>

  <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* Stats */}
    <div className="col-span-1 lg:col-span-3 p-8 bg-white shadow-lg rounded-3xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      <div className="hover:bg-gray-50 p-6 rounded-2xl transition duration-300 shadow-sm">
        <FaFilm className="text-blue-600 text-4xl mx-auto mb-4" />
        <p className="font-medium text-lg">Total Cinemas</p>
        <p className="text-3xl font-bold text-gray-900">{stats.cinemas}</p>
      </div>
      <div className="hover:bg-gray-50 p-6 rounded-2xl transition duration-300 shadow-sm">
        <FaTicketAlt className="text-green-600 text-4xl mx-auto mb-4" />
        <p className="font-medium text-lg">Total Bookings</p>
        <p className="text-3xl font-bold text-gray-900">{stats.bookings}</p>
      </div>
      <div className="hover:bg-gray-50 p-6 rounded-2xl transition duration-300 shadow-sm">
        <FaUsers className="text-purple-600 text-4xl mx-auto mb-4" />
        <p className="font-medium text-lg">Users</p>
        <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
      </div>
      <div className="hover:bg-gray-50 p-6 rounded-2xl transition duration-300 shadow-sm">
        <FaVideo className="text-yellow-600 text-4xl mx-auto mb-4" />
        <p className="font-medium text-lg">Total Movies</p>
        <p className="text-3xl font-bold text-gray-900">{stats.movies}</p>
      </div>
    </div>

    {/* Weekly Bookings Bar Chart */}
    <div className="col-span-1 lg:col-span-2 bg-white shadow-lg rounded-3xl p-8">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">📊 Weekly Bookings</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={weeklyData}>
          <XAxis dataKey="name" stroke="#4b5563" />
          <YAxis stroke="#4b5563" />
          <Tooltip />
          <Bar dataKey="bookings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Report Section */}
    <div className="bg-white shadow-lg rounded-3xl p-8">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">📝 Latest Report</h2>
      <div className="space-y-5 text-gray-700">
        <div className="p-5 bg-gray-100 rounded-xl shadow-sm">🎥 <span className="font-semibold">Top Movie:</span> Dune: Part Two</div>
        <div className="p-5 bg-gray-100 rounded-xl shadow-sm">👥 <span className="font-semibold">Peak Day:</span> Friday</div>
        <div className="p-5 bg-gray-100 rounded-xl shadow-sm">🏆 <span className="font-semibold">Top Cinema:</span> PVR Phoenix</div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="col-span-1 lg:col-span-3 bg-white shadow-lg rounded-3xl p-8">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">⚡ Quick Actions</h2>
      <div className="flex flex-wrap gap-6">
        <button
          onClick={() => navigate('/movie')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl shadow-md transition duration-300"
        >
          🎬 Add New Movie
        </button>
        <button
          className="border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 px-8 py-4 rounded-xl shadow-md transition duration-300"
        >
          📄 View All Bookings
        </button>
        <button
          onClick={() => navigate('/user')}
          className="border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 px-8 py-4 rounded-xl shadow-md transition duration-300"
        >
          👥 Manage Users
        </button>
      </div>
    </div>
  </div>
</div>

  );
}
