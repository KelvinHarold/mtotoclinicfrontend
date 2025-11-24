import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaFlask } from 'react-icons/fa';
import api from '../../api/axios';

const LabResultEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    result: '',
    interpretation: '',
    doctor_id: ''
  });

  useEffect(() => {
    setCurrentUserFromLocalStorage();
    fetchLabResult();
    fetchDoctors();
  }, [id]);

  const setCurrentUserFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  };

  const fetchLabResult = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get(`/lab-results/${id}`);
      if (response.data.success) {
        const result = response.data.data;
        setFormData({
          result: result.result || '',
          interpretation: result.interpretation || '',
          doctor_id: result.doctor_id || ''
        });
      } else {
        setError('Lab result not found');
      }
    } catch (err) {
      setError('Failed to fetch lab result');
      console.error('Error fetching lab result:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const usersResponse = await api.get('admin/users');
      if (usersResponse.data && usersResponse.data.success) {
        setDoctors(usersResponse.data.data || usersResponse.data || []);
      }
    } catch (usersErr) {
      console.warn('Error fetching doctors:', usersErr);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.result || !formData.doctor_id) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Updating lab result:', formData);
      
      const response = await api.put(`/lab-results/${id}`, formData);
      
      if (response.data.success) {
        setSuccess('Lab result updated successfully!');
        setTimeout(() => {
          navigate(`/lab-results/${id}`);
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update lab result');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update lab result. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  const getCurrentDoctorName = () => {
    if (!currentUser) return 'Loading...';
    
    const currentDoctor = safeDoctors.find(doctor => doctor.id === currentUser.id);
    if (currentDoctor) {
      const fullName = [
        currentDoctor.first_name,
        currentDoctor.second_name, 
        currentDoctor.last_name
      ].filter(Boolean).join(' ');
      
      return `${fullName} ${currentDoctor.department ? `- ${currentDoctor.department}` : ''}`;
    }
    
    const userFullName = [
      currentUser.first_name,
      currentUser.second_name,
      currentUser.last_name
    ].filter(Boolean).join(' ');
    
    return `${userFullName} (You)`;
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading lab result...</span>
      </div>
    );
  }

  if (error && !formData.result) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          to="/lab-results"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to Lab Results
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link
          to={`/lab-results/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaFlask className="inline mr-2 mb-1" />
          Edit Lab Result
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Result */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result *
              </label>
              <textarea
                name="result"
                value={formData.result}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the test results..."
                required
              />
            </div>

            {/* Interpretation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interpretation
              </label>
              <textarea
                name="interpretation"
                value={formData.interpretation}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter interpretation of the results..."
              />
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reporting Doctor *
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Doctor</option>
                {safeDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.first_name} {doctor.second_name ? doctor.second_name + ' ' : ''}{doctor.last_name}
                    {doctor.department && ` - ${doctor.department}`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current user: {getCurrentDoctorName()}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to={`/lab-results/${id}`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Update Lab Result
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabResultEdit;