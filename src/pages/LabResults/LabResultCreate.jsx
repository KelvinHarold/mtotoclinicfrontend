import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaFlask } from 'react-icons/fa';
import api from '../../api/axios';

const LabResultCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [labTests, setLabTests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    lab_test_id: '',
    result: '',
    interpretation: '',
    doctor_id: ''
  });

  useEffect(() => {
    setCurrentUserFromLocalStorage();
    fetchDropdownData();
  }, []);

  const setCurrentUserFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setFormData(prev => ({
          ...prev,
          doctor_id: user.id
        }));
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      setDropdownLoading(true);
      setError('');

      // Fetch lab tests without results
      const testsResponse = await api.get('/lab-tests');
      let testsData = [];
      if (testsResponse.data && testsResponse.data.success) {
        testsData = testsResponse.data.data || [];
        
        // Filter tests that don't have results yet
        const testsWithoutResults = testsData.filter(test => !test.lab_result);
        setLabTests(testsWithoutResults);
      }

      // Fetch doctors
      try {
        const usersResponse = await api.get('admin/users');
        let usersData = [];
        if (usersResponse.data && usersResponse.data.success) {
          usersData = usersResponse.data.data || usersResponse.data || [];
        }
        setDoctors(usersData);
      } catch (usersErr) {
        console.warn('Error fetching users:', usersErr);
        if (currentUser) {
          setDoctors([currentUser]);
        }
      }

    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError('Failed to load dropdown data');
    } finally {
      setDropdownLoading(false);
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
    if (!formData.lab_test_id || !formData.result || !formData.doctor_id) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting lab result:', formData);
      
      const response = await api.post('/lab-results', formData);
      
      if (response.data.success) {
        setSuccess('Lab result created successfully!');
        setTimeout(() => {
          navigate('/lab-results');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to create lab result');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create lab result. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const safeLabTests = Array.isArray(labTests) ? labTests : [];
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/lab-results"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to List
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaFlask className="inline mr-2 mb-1" />
          Create New Lab Result
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
        {dropdownLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading dropdown data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Lab Test Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lab Test *
                </label>
                <select
                  name="lab_test_id"
                  value={formData.lab_test_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Lab Test</option>
                  {safeLabTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.test_name} - 
                      {test.patient ? ` ${test.patient.first_name} ${test.patient.last_name}` : ` Patient #${test.patient_id}`}
                      {test.test_date && ` (${new Date(test.test_date).toLocaleDateString()})`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only tests without existing results are shown
                </p>
              </div>

              {/* Result */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result *
                </label>
                <textarea
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  rows={4}
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter interpretation of the results..."
                />
              </div>

              {/* Doctor - READ ONLY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporting Doctor *
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {getCurrentDoctorName()}
                </div>
                <input
                  type="hidden"
                  name="doctor_id"
                  value={formData.doctor_id}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This field is automatically set to your account
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                to="/lab-results"
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
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Create Lab Result
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LabResultCreate;