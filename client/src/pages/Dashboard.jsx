import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FaFilm, FaTicketAlt, FaUsers, FaVideo, FaChartBar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    cinemas: 0,
    bookings: 0,
    users: 0,
    movies: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const navigate = useNavigate();

  const COLORS = ['#4F46E5', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get stats
        const statsResponse = await axios.get("/movie/stats", {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        
        // Transform the data into the format we need
        const statsData = {
          cinemas: statsResponse.data.data.cinemaCount || 0,
          movies: statsResponse.data.data.movieCount || 0,
          users: statsResponse.data.data.userCount || 0,
          bookings: statsResponse.data.data.ticketCount || 0
        };
        
        setStats(statsData);
        
        // Get weekly booking data
        const weeklyResponse = await axios.get("/movie/weekly-bookings", {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        
        // Format weekly data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyBookings = Array(7).fill(0).map((_, i) => ({
          name: days[i],
          bookings: weeklyResponse.data.data[i] || 0
        }));
        
        setWeeklyData(weeklyBookings);
        
        // Get top movies data
        const topMoviesResponse = await axios.get("/movie/top", {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        
        setTopMovies(topMoviesResponse.data.data.slice(0, 5).map(movie => ({
          name: movie.name,
          value: movie.ticketCount || 0
        })));

        // Calculate revenue distribution data (mocked for now)
        setRevenueData([
          { name: "Tickets", value: statsData.bookings * 120 },
          { name: "Concessions", value: statsData.bookings * 45 },
          { name: "Promotions", value: statsData.bookings * 20 }
        ]);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error fetching dashboard data", {
          position: 'top-center',
          autoClose: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth.token]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-900 to-blue-500">
        <Navbar />
        <div className="flex h-[80vh] items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      <Navbar />
      
      <div className="mx-4 flex flex-col gap-4 rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:gap-6 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cinemas</p>
                <p className="text-3xl font-bold text-indigo-700">{stats.cinemas}</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <FaFilm className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{stats.bookings}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <FaTicketAlt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-purple-600">{stats.users}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <FaUsers className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Movies Available</p>
                <p className="text-3xl font-bold text-blue-500">{stats.movies}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <FaVideo className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Weekly Bookings */}
          <div className="flex flex-col rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Weekly Bookings</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} bookings`, 'Bookings']}
                    contentStyle={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top Movies */}
          <div className="flex flex-col rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Top Movies</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topMovies}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    animationDuration={1500}
                  >
                    {topMovies.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} tickets`, 'Tickets Sold']}
                    contentStyle={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Quick Actions & Revenue Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white p-6 shadow-md lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/movie')}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 font-medium text-white hover:from-indigo-500 hover:to-blue-400 transition-all"
              >
                <FaVideo className="h-5 w-5" />
                Manage Movies
              </button>
              <button
                onClick={() => navigate('/search')}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 px-5 py-3 font-medium text-white hover:from-gray-600 hover:to-gray-500 transition-all"
              >
                <FaChartBar className="h-5 w-5" />
                View Showtimes
              </button>
              <button
                onClick={() => navigate('/user')}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 font-medium text-white hover:from-indigo-500 hover:to-blue-400 transition-all"
              >
                <FaUsers className="h-5 w-5" />
                Manage Users
              </button>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-medium text-gray-800">Recent System Activity</h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">New movie added: {topMovies[0]?.name || 'Interstellar'}</p>
                  <p className="text-gray-600">2 hours ago</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-3 text-sm">
                  <p className="font-medium text-gray-900">{stats.bookings > 0 ? stats.bookings : 5} new bookings today</p>
                  <p className="text-gray-600">Revenue increased by {((stats.bookings || 5) * 100*20).toLocaleString()} Rs.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Stats */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Revenue Distribution</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4338ca', '#818cf8', '#a5b4fc'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${(value*20).toLocaleString()} Rs.`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
