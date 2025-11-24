import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaFlask } from 'react-icons/fa';
import api from '../../api/axios';

const LabTestEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient_id: '',
    visit_id: '',
    test_name: '',
    test_date: '',
    test_notes: '',
    doctor_id: ''
  });

  useEffect(() => {
    fetchDropdownData();
    fetchLabTest();
  }, [id]);

  const fetchLabTest = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lab-tests/${id}`);
      if (response.data.success) {
        const labTest = response.data.data;
        setFormData({
          patient_id: labTest.patient_id,
          visit_id: labTest.visit_id || '',
          test_name: labTest.test_name,
          test_date: labTest.test_date.split('T')[0],
          test_notes: labTest.test_notes || '',
          doctor_id: labTest.doctor_id
        });
      } else {
        setError('Lab test not found');
      }
    } catch (err) {
      setError('Failed to fetch lab test');
      console.error('Error fetching lab test:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      setDropdownLoading(true);

      // Fetch patients
      const patientsResponse = await api.get('/patients');
      let patientsData = [];
      if (patientsResponse.data && patientsResponse.data.success) {
        patientsData = patientsResponse.data.data?.data || patientsResponse.data.data || patientsResponse.data || [];
      }
      setPatients(patientsData);

      // Fetch patient visits
      const visitsResponse = await api.get('/patient-visits');
      let visitsData = [];
      if (visitsResponse.data && visitsResponse.data.success) {
        visitsData = visitsResponse.data.data?.data || visitsResponse.data.data || visitsResponse.data || [];
      }
      setVisits(visitsData);

      // Fetch doctors
      const doctorsResponse = await api.get('/users/doctors');
      let doctorsData = [];
      if (doctorsResponse.data && doctorsResponse.data.success) {
        doctorsData = doctorsResponse.data.data || doctorsResponse.data || [];
      } else {
        const usersResponse = await api.get('/users');
        if (usersResponse.data && usersResponse.data.success) {
          doctorsData = usersResponse.data.data || usersResponse.data || [];
        }
      }
      setDoctors(doctorsData);

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

    // Basic validation
    if (!formData.patient_id || !formData.test_name || !formData.test_date || !formData.doctor_id) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.put(`/lab-tests/${id}`, formData);
      
      if (response.data.success) {
        setSuccess('Lab test updated successfully!');
        setTimeout(() => {
          navigate('/lab-tests');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update lab test');
      }
    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update lab test. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const safePatients = Array.isArray(patients) ? patients : [];
  const safeVisits = Array.isArray(visits) ? visits : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  if (loading && !formData.test_name) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading lab test...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/lab-tests"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to List
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaFlask className="inline mr-2 mb-1" />
          Edit Lab Test
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient *
                </label>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Patient</option>
                  {safePatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visit (Optional)
                </label>
                <select
                  name="visit_id"
                  value={formData.visit_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Visit</option>
                  {safeVisits.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      {visit.visit_number || `Visit #${visit.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Name *
                </label>
                <input
                  type="text"
                  name="test_name"
                  value={formData.test_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date *
                </label>
                <input
                  type="date"
                  name="test_date"
                  value={formData.test_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requesting Doctor *
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
                      {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Test Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Notes
              </label>
              <textarea
                name="test_notes"
                value={formData.test_notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any notes or instructions for this test..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                to="/lab-tests"
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
                    Update Lab Test
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

export default LabTestEdit;