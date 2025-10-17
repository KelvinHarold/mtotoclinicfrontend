import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import Register from './pages/Register';

export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login', { email, password });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('roles', JSON.stringify(user.roles));
      localStorage.setItem('permissions', JSON.stringify(user.permissions));

      setTimeout(() => {
        navigate('/home');
      }, 0);
    } catch (error) {
      console.error(error);
      alert('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 via-blue-300 to-blue-600">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl backdrop-blur-lg bg-opacity-90">
          <Register />
          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <span
              onClick={() => setShowRegister(false)}
              className="text-blue-700 font-semibold cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 via-blue-300 to-blue-600">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl relative transition-transform duration-300 hover:scale-[1.01] backdrop-blur-md bg-opacity-95">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-20 w-20 object-cover rounded-full border-4 border-blue-200 shadow-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-6">
          <span className="text-blue-700">Santiago</span>{' '}
          <span className="text-gray-800">Bernabeu</span>
        </h1>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center my-6">
            <BeatLoader color="#2563eb" size={15} />
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:border-blue-500">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent outline-none text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:border-blue-500">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent outline-none text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-md font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Login
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6 text-gray-600 font-medium">
          SantiagoBernabeu RMS
        </p>

        <p className="text-center text-xs text-gray-500 mt-1">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </div>
  );
}
