import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaExchangeAlt, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';

// Departments constant
const DEPARTMENTS = [
  'reception',
  'Lab', 
  'pharmacy',
  'doctor',
  'vaccination',
  'maternity'
];

const VisitRoutingCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patientVisits, setPatientVisits] = useState([]); // Kubadilisha kutoka patients kwenda patientVisits
  const [selectedPatientVisit, setSelectedPatientVisit] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    patient_visit_id: '',
    from_department: '',
    to_department: '',
    routing_notes: '',
    routed_by: ''
  });

  useEffect(() => {
    setCurrentUserFromLocalStorage();
    fetchDropdownData();
  }, []);

  const setCurrentUserFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      console.log('User data from localStorage:', userData);
      
      if (userData) {
        const user = JSON.parse(userData);
        console.log('Parsed user:', user);
        setCurrentUser(user);
        
        // Set the routed_by field automatically
        setFormData(prev => ({
          ...prev,
          routed_by: user.id
        }));
      } else {
        console.warn('No user data found in localStorage');
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      setDropdownLoading(true);
      setError('');

      // Fetch patient visits - HII NI MUHIMU KWA CONTROLLER
      const visitsResponse = await api.get('/patient-visits');
      console.log('Patient visits response:', visitsResponse.data);
      
      let visitsData = [];
      
      if (visitsResponse.data && visitsResponse.data.success) {
        if (Array.isArray(visitsResponse.data.data?.data)) {
          visitsData = visitsResponse.data.data.data;
        } else if (Array.isArray(visitsResponse.data.data)) {
          visitsData = visitsResponse.data.data;
        } else if (Array.isArray(visitsResponse.data)) {
          visitsData = visitsResponse.data;
        }
      }
      
      console.log('Processed patient visits data:', visitsData);
      setPatientVisits(visitsData);

    } catch (err) {
      console.error('Error fetching patient visits:', err);
      setPatientVisits([]);
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

    // If patient visit is selected, find and set the patient visit details
    if (name === 'patient_visit_id') {
      handlePatientVisitSelection(value);
    }
  };

  const handlePatientVisitSelection = (patientVisitId) => {
    if (!patientVisitId) {
      setSelectedPatientVisit(null);
      return;
    }

    const selected = patientVisits.find(visit => visit.id == patientVisitId);
    setSelectedPatientVisit(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Log the data being sent for debugging
    console.log('Submitting form data:', formData);

    // Validate that from and to departments are different
    if (formData.from_department === formData.to_department) {
      setError('From department and To department cannot be the same');
      setLoading(false);
      return;
    }

    // Validate that routed_by is set
    if (!formData.routed_by) {
      setError('User authentication required. Please login again.');
      setLoading(false);
      return;
    }

    // Validate that patient_visit_id is set
    if (!formData.patient_visit_id) {
      setError('Please select a patient visit');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/visit-routings', formData);
      
      if (response.data.success) {
  setSuccess('Visit routing created successfully! Patient current department and status have been updated.');
  setTimeout(() => {
    navigate('/visit-routings');
  }, 1500);
} else {
        setError(response.data.message || 'Failed to create visit routing');
      }
    } catch (err) {
      console.error('API Error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.data?.errors) {
        // Display validation errors
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create visit routing. Please check if the patient visit exists.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Ensure patientVisits is always array
  const safePatientVisits = Array.isArray(patientVisits) ? patientVisits : [];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/visit-routings"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to List
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaExchangeAlt className="inline mr-2 mb-1" />
          Create New Visit Routing
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
            {/* Current User Display */}
            {currentUser && (
              <div className="mb-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  👤 Routing Created By: {currentUser.name}
                </h3>
                <p className="text-sm text-blue-700">
                  User ID: {currentUser.id} | This routing will be automatically assigned to you
                </p>
              </div>
            )}

            {!currentUser && (
              <div className="mb-6 p-4 border border-red-300 rounded-lg bg-red-50">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  ⚠️ User Not Detected
                </h3>
                <p className="text-sm text-red-700">
                  Please make sure you are logged in. The system could not detect your user information.
                </p>
              </div>
            )}

            {/* Patient Visit Details Display */}
            {selectedPatientVisit && (
              <div className="mb-6 p-4 border border-green-300 rounded-lg bg-green-50">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  📋 Selected Patient Visit
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-green-700">Visit Number</label>
                    <p className="text-sm font-semibold">{selectedPatientVisit.visit_number || `Visit #${selectedPatientVisit.id}`}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">Patient</label>
                    <p className="text-sm">
                      {selectedPatientVisit.patient ? 
                        `${selectedPatientVisit.patient.first_name} ${selectedPatientVisit.patient.last_name}` : 
                        `Patient ID: ${selectedPatientVisit.patient_id}`
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">Current Department</label>
                    <p className="text-sm capitalize">{selectedPatientVisit.current_department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">Status</label>
                    <p className="text-sm capitalize">{selectedPatientVisit.status || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">Visit Date</label>
                    <p className="text-sm">{selectedPatientVisit.visit_date || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Visit *
                </label>
                <select
                  name="patient_visit_id"
                  value={formData.patient_visit_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={safePatientVisits.length === 0}
                >
                  <option value="">Select Patient Visit</option>
                  {safePatientVisits.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      {visit.visit_number || `Visit #${visit.id}`} - 
                      {visit.patient ? 
                        ` ${visit.patient.first_name} ${visit.patient.last_name}` : 
                        ` Patient ID: ${visit.patient_id}`
                      }
                    </option>
                  ))}
                </select>
                {safePatientVisits.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    No patient visits available. Please create a patient visit first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routed By
                </label>
                <input
                  type="text"
                  value={currentUser ? `${currentUser.name} (Automatically assigned - ID: ${currentUser.id})` : 'User not detected - Please login'}
                  disabled
                  className={`w-full px-3 py-2 border rounded-md ${
                    currentUser 
                      ? 'border-gray-300 bg-gray-100 text-gray-700' 
                      : 'border-red-300 bg-red-50 text-red-700'
                  }`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This field is automatically set to the current logged-in user
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Department *
                </label>
                <select
                  name="from_department"
                  value={formData.from_department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Department *
                </label>
                <select
                  name="to_department"
                  value={formData.to_department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Notes
              </label>
              <textarea
                name="routing_notes"
                value={formData.routing_notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any notes or instructions for this routing..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                to="/visit-routings"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center"
              >
                <FaTimes className="mr-2" />
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !currentUser || safePatientVisits.length === 0}
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
                    Create Routing
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

export default VisitRoutingCreate;