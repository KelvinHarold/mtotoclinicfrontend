// pages/dashboards/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Welcome</h3>
          <p className="text-gray-600">
            {user.first_name} {user.last_name}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Department</h3>
          <p className="text-gray-600">{user.department}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Role</h3>
          <p className="text-gray-600">Administrator</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
            Manage Users
          </button>
          <button className="bg-green-500 text-white p-4 rounded hover:bg-green-600">
            View Reports
          </button>
          <button className="bg-purple-500 text-white p-4 rounded hover:bg-purple-600">
            Settings
          </button>
          <button className="bg-orange-500 text-white p-4 rounded hover:bg-orange-600">
            Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;