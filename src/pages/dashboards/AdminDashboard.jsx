// pages/dashboards/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios'; // Import your axios instance
import {
  Users,
  UserPlus,
  Stethoscope,
  Calendar,
  FileText,
  PieChart,
  Activity,
  Bell,
  Search,
  Settings,
  LogOut,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_users: 0,
    total_patients: 0,
    total_visits: 0,
    total_vaccinations: 0,
    active_users: 0,
    appointments: {
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0
    },
    visit_trends: [],
    patient_types: [],
    recent_activities: []
  });
  const [realTimeStats, setRealTimeStats] = useState({
    today_visits: 0,
    today_appointments: 0,
    today_new_patients: 0,
    upcoming_appointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    console.log('User data from localStorage:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchDashboardData();
        fetchRealTimeStats();
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
        setError('Invalid user data format');
        setLoading(false);
      }
    } else {
      console.warn('No user data found in localStorage, redirecting to login');
      navigate('/');
    }
  }, [navigate, retryCount]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      console.log('Auth token exists:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching dashboard data from:', '/admin-dashboard/stats');
      
      const response = await axiosInstance.get('/admin-dashboard/stats');
      
      console.log('Dashboard API Response:', response);
      console.log('Dashboard API Response data:', response.data);
      
      if (response.data.success) {
        setStats(response.data.data);
        console.log('Stats updated successfully:', response.data.data);
      } else {
        console.error('API returned success: false', response.data);
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response);
        setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something else happened
        setError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      console.log('Fetching real-time stats from:', '/admin-dashboard/real-time-stats');
      
      const response = await axiosInstance.get('/admin-dashboard/real-time-stats');
      
      console.log('Real-time stats response:', response);
      
      if (response.data.success) {
        setRealTimeStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      // Don't set error for real-time stats to avoid blocking the main UI
    }
  };

  const fetchVisitTrends = async (period) => {
    try {
      console.log('Fetching visit trends for period:', period);
      
      const response = await axiosInstance.get(`/admin-dashboard/visit-trends?period=${period}`);
      
      console.log('Visit trends response:', response);
      
      if (response.data.success) {
        setStats(prev => ({
          ...prev,
          visit_trends: response.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching visit trends:', error);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    navigate('/');
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color, label }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  const VisitTrendChart = () => {
    if (!stats.visit_trends || stats.visit_trends.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          No visit data available
          <button 
            onClick={() => fetchVisitTrends(selectedPeriod)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>
      );
    }
    
    const maxVisits = Math.max(...stats.visit_trends.map(item => item.visits || item.count || 0));
    
    return (
      <div className="space-y-4">
        <div className="flex space-x-2 mb-4">
          {['7days', '30days', '12months'].map(period => (
            <button
              key={period}
              onClick={() => {
                setSelectedPeriod(period);
                fetchVisitTrends(period);
              }}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedPeriod === period 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === '7days' ? '7 Days' : period === '30days' ? '30 Days' : '12 Months'}
            </button>
          ))}
        </div>
        
        <div className="flex items-end justify-between h-32 space-x-2">
          {stats.visit_trends.map((trend, index) => {
            const visits = trend.visits || trend.count || 0;
            const date = trend.date ? new Date(trend.date) : new Date();
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">
                  {date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer"
                  style={{ 
                    height: `${maxVisits > 0 ? (visits / maxVisits) * 80 : 4}px`,
                    minHeight: '4px'
                  }}
                  title={`${visits} visits on ${trend.date}`}
                ></div>
                <div className="text-xs font-medium mt-1">{visits}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => {
                  // Clear storage and redirect to login
                  localStorage.removeItem('auth_token');
                  localStorage.removeItem('user_data');
                  navigate('/');
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <button
                onClick={handleRetry}
                className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  className="w-8 h-8 rounded-full bg-gray-200"
                  src={user?.profile_image || '/default-avatar.png'}
                  alt={`${user?.first_name} ${user?.last_name}`}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxN0MxOC4yMDkxIDE3IDIwIDE1LjIwOTEgMjAgMTNDMjAgMTAuNzkwOSAxOC4yMDkxIDkgMTYgOUMxMy43OTA5IDkgMTIgMTAuNzkwOSAxMiAxM0MxMiAxNS4yMDkxIDEzLjc5MDkgMTcgMTYgMTdaIiBmaWxsPSIjOEE5MEFBIi8+CjxwYXRoIGQ9Ik0xNiAxOEMxMS41ODIgMTggOCAyMS41ODIgOCAyNkgyNEMyNCAyMS41ODIgMjAuNDE4IDE4IDE2IDE4WiIgZmlsbD0iIzhBOUEBQSIvPgo8L3N2Zz4K';
                  }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.first_name}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening in your healthcare system today.
          </p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Today's Visits</p>
                <p className="text-2xl font-bold text-blue-900">
                  {realTimeStats.today_visits?.toLocaleString() || 0}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Today's Appointments</p>
                <p className="text-2xl font-bold text-green-900">
                  {realTimeStats.today_appointments?.toLocaleString() || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">New Patients Today</p>
                <p className="text-2xl font-bold text-purple-900">
                  {realTimeStats.today_new_patients?.toLocaleString() || 0}
                </p>
              </div>
              <UserPlus className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.total_users || 0}
            icon={Users}
            color="bg-blue-500"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Total Patients"
            value={stats.total_patients || 0}
            icon={UserPlus}
            color="bg-green-500"
            onClick={() => navigate('/patients')}
          />
          <StatCard
            title="Total Visits"
            value={stats.total_visits || 0}
            icon={Stethoscope}
            color="bg-purple-500"
            onClick={() => navigate('/patient-visits')}
          />
          <StatCard
            title="Vaccinations"
            value={stats.total_vaccinations || 0}
            icon={FileText}
            color="bg-orange-500"
            onClick={() => navigate('/vaccinations')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visit Trends Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Visit Trends</h3>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <VisitTrendChart />
            </div>

            {/* Appointments Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Appointments Overview</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.appointments?.completed || 0}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.appointments?.pending || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.appointments?.cancelled || 0}
                  </div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </div>
              </div>
              <ProgressBar 
                percentage={stats.appointments?.total ? 
                  Math.round(((stats.appointments.completed || 0) / stats.appointments.total) * 100) : 0
                }
                color="bg-green-500"
                label="Completion Rate"
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Active Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {stats.active_users || 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">Active in last 30 days</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {stats.recent_activities?.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.color === 'blue' ? 'bg-blue-500' :
                      activity.color === 'green' ? 'bg-green-500' :
                      activity.color === 'purple' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()} • 
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!stats.recent_activities || stats.recent_activities.length === 0) && (
                  <p className="text-gray-500 text-center py-2">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;