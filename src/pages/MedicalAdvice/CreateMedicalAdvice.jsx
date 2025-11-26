import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaStethoscope, FaUser, FaUserMd } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const CreateMedicalAdvice = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_id: '',
    visit_id: '',
    advice_given: '',
    doctor_id: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUserFromLocalStorage();
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (formData.patient_id) {
      const patientVisits = visits.filter(visit => 
        visit.patient_id == formData.patient_id
      );
      setFilteredVisits(patientVisits);
      setFormData(prev => ({ ...prev, visit_id: '' }));
    } else {
      setFilteredVisits([]);
    }
  }, [formData.patient_id, visits]);

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
      const patientsResponse = await axiosInstance.get('/patients');
      let patientsData = [];
      if (patientsResponse.data && patientsResponse.data.success) {
        patientsData = patientsResponse.data.data?.data || patientsResponse.data.data || patientsResponse.data || [];
      }
      setPatients(patientsData);

      const visitsResponse = await axiosInstance.get('/patient-visits');
      let visitsData = [];
      if (visitsResponse.data && visitsResponse.data.success) {
        visitsData = visitsResponse.data.data?.data || visitsResponse.data.data || visitsResponse.data || [];
      }
      setVisits(visitsData);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setSubmitError('Failed to load dropdown data');
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    setErrors({});

    const requiredFields = ['patient_id', 'advice_given', 'doctor_id'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setErrors({
        general: [`Please fill in all required fields: ${missingFields.join(', ')}`]
      });
      setLoading(false);
      return;
    }

    try {
      const submissionData = {
        patient_id: formData.patient_id.toString(),
        advice_given: formData.advice_given.trim(),
        doctor_id: formData.doctor_id.toString()
      };

      if (formData.visit_id && formData.visit_id !== '') {
        submissionData.visit_id = formData.visit_id.toString();
      }

      const response = await axiosInstance.post('/medical-advice', submissionData);
      
      navigate('/medical-advice', { 
        state: { message: 'Medical advice recorded successfully!' } 
      });

    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        setErrors(validationErrors);
        const firstError = Object.values(validationErrors)[0]?.[0];
        setSubmitError(firstError || 'Please check the form for errors');
      } else if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError('Failed to record medical advice. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const safePatients = Array.isArray(patients) ? patients : [];

  const getCurrentDoctorName = () => {
    if (!currentUser) return 'Loading...';
    const fullName = [
      currentUser.first_name,
      currentUser.second_name,
      currentUser.last_name
    ].filter(Boolean).join(' ');
    return `${fullName} ${currentUser.department ? `- ${currentUser.department}` : ''}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/medical-advice"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Medical Advice
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaStethoscope className="inline mr-2 mb-1" />
          Record Medical Advice
        </h1>
        <p className="text-gray-600 mt-2">Provide medical advice and guidance to patient</p>
      </div>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{submitError}</span>
            <button onClick={() => setSubmitError('')} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{errors.general[0]}</span>
            <button onClick={() => setErrors(prev => ({...prev, general: null}))} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {dropdownLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2">Loading dropdown data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Patient and Visit Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-1" />
                  Patient *
                </label>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.patient_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Patient</option>
                  {safePatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} 
                      {patient.date_of_birth && ` (DOB: ${new Date(patient.date_of_birth).toLocaleDateString()})`}
                    </option>
                  ))}
                </select>
                {errors.patient_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.patient_id[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-1" />
                  Visit (Optional)
                </label>
                <select
                  name="visit_id"
                  value={formData.visit_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.visit_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.patient_id}
                >
                  <option value="">-- No Visit Selected --</option>
                  {filteredVisits.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      Visit #{visit.id} - {new Date(visit.visit_date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {errors.visit_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.visit_id[0]}</p>
                )}
              </div>
            </div>

            {/* Medical Advice Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Medical Advice
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advice Given *
                </label>
                <textarea
                  name="advice_given"
                  value={formData.advice_given}
                  onChange={handleChange}
                  rows="8"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.advice_given ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter detailed medical advice, instructions, recommendations..."
                  required
                />
                {errors.advice_given && (
                  <p className="text-red-500 text-sm mt-1">{errors.advice_given[0]}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Provide clear and comprehensive medical guidance for the patient
                </p>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Healthcare Provider
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaUserMd className="text-green-600 mr-3 text-xl" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {getCurrentDoctorName()}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      You are providing this medical advice
                    </p>
                  </div>
                </div>
              </div>
              <input type="hidden" name="doctor_id" value={formData.doctor_id} />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Recording new medical advice
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/medical-advice"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Recording...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Record Advice
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateMedicalAdvice;