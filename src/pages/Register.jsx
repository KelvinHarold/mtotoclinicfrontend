import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match!');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/register', { name, email, password,password_confirmation: confirmPassword, });
      setMessage('✅ Registration successful!');
    } catch (error) {
      setMessage('❌ Registration failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-5">Create an Account</h2>

      <form onSubmit={handleRegister} className="space-y-3">
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <FaUser className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <FaEnvelope className="text-gray-500 mr-2" />
          <input
            type="email"
            placeholder="Email"
            className="w-full outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <FaLock className="text-gray-500 mr-2" />
          <input
            type="password"
            placeholder="Password"
            className="w-full outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <FaLock className="text-gray-500 mr-2" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-gray-700 mt-3">{message}</p>
      )}
    </div>
  );
}
