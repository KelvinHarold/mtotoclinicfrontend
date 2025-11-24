import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaPills, FaUser, FaStethoscope, FaUserMd } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const MedicationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    patient_id: '',
    visit_id: '',
    medicine_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
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
    if (isEdit) {
      fetchMedication();
    }
    setCurrentUserFromLocalStorage();
    fetchDropdownData();
  }, []);

  // Filter visits when patient changes
  useEffect(() => {
    if (formData.patient_id) {
      const patientVisits = visits.filter(visit => 
        visit.patient_id == formData.patient_id
      );
      setFilteredVisits(patientVisits);
      
      // Reset visit_id when patient changes
      setFormData(prev => ({
        ...prev,
        visit_id: ''
      }));
    } else {
      setFilteredVisits([]);
      setFormData(prev => ({ ...prev, visit_id: '' }));
    }
  }, [formData.patient_id, visits]);

  const setCurrentUserFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        // Auto-set doctor_id to current user
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

      // Fetch patients
      const patientsResponse = await axiosInstance.get('/patients');
      let patientsData = [];
      if (patientsResponse.data && patientsResponse.data.success) {
        patientsData = patientsResponse.data.data?.data || patientsResponse.data.data || patientsResponse.data || [];
      }
      setPatients(patientsData);

      // Fetch patient visits
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

  const fetchMedication = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/medications/${id}`);
      const medicationData = response.data.data;
      setFormData(medicationData);
    } catch (err) {
      setSubmitError('Failed to fetch medication details');
      console.error('Error fetching medication:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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

    

    // Validate required fields
    const requiredFields = ['patient_id', 'medicine_name', 'dosage', 'frequency', 'duration', 'doctor_id'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setErrors({
        general: [`Please fill in all required fields: ${missingFields.join(', ')}`]
      });
      setLoading(false);
      return;
    }

    try {
      // Prepare data for submission - COMPLETELY REMOVE VISIT_ID IF NOT SELECTED
      const submissionData = {
        patient_id: formData.patient_id.toString(),
        medicine_name: formData.medicine_name.trim(),
        dosage: formData.dosage.trim(),
        frequency: formData.frequency.trim(),
        duration: formData.duration.trim(),
        instructions: formData.instructions ? formData.instructions.trim() : '',
        doctor_id: formData.doctor_id.toString()
      };

      // ONLY include visit_id if it's explicitly selected and not empty
      if (formData.visit_id && formData.visit_id !== '') {
        submissionData.visit_id = formData.visit_id.toString();
      }
      // If visit_id is empty or not selected, DON'T include it in the submission

      console.log('Submitting medication data:', submissionData);

      let response;
      if (isEdit) {
        response = await axiosInstance.put(`/medications/${id}`, submissionData);
      } else {
        response = await axiosInstance.post('/medications', submissionData);
      }

      console.log('Medication saved successfully:', response.data);
      navigate('/medications');

    } catch (err) {
      console.error('API Error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 422) {
        // Validation errors from Laravel
        const validationErrors = err.response.data.errors;
        console.error('Full validation errors object:', validationErrors);
        setErrors(validationErrors);
        
        // Show first validation error as general message
        const firstError = Object.values(validationErrors)[0]?.[0];
        setSubmitError(firstError || 'Please check the form for errors');
      } else if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError('Failed to save medication. Please try again.');
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

  if (loading && isEdit) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading medication details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/medications"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Medications
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaPills className="inline mr-2 mb-1" />
          {isEdit ? 'Edit Medication' : 'Add New Medication'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? 'Update medication information' : 'Prescribe new medication to patient'}
        </p>
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  <FaStethoscope className="inline mr-1" />
                  Visit (Optional)
                </label>
                <select
                  name="visit_id"
                  value={formData.visit_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.visit_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.patient_id}
                >
                  <option value="">-- No Visit Selected --</option>
                  {filteredVisits.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      Visit #{visit.id} - 
                      {visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : 'No date'}
                      {visit.current_department && ` - ${visit.current_department}`}
                      {visit.status && ` (${visit.status})`}
                    </option>
                  ))}
                </select>
                {errors.visit_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.visit_id[0]}</p>
                )}
                {!formData.patient_id && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select a patient first to see their visits
                  </p>
                )}
                {formData.patient_id && filteredVisits.length === 0 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    No visits found for this patient
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  💡 Leave this empty if not associated with a specific visit
                </p>
              </div>
            </div>

            {/* Medication Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Medication Details
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="medicine_name"
                  value={formData.medicine_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.medicine_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Paracetamol, Amoxicillin, etc."
                  required
                />
                {errors.medicine_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.medicine_name[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dosage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 500mg, 250mg/5ml"
                    required
                  />
                  {errors.dosage && (
                    <p className="text-red-500 text-sm mt-1">{errors.dosage[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <input
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.frequency ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 3 times daily, Once daily"
                    required
                  />
                  {errors.frequency && (
                    <p className="text-red-500 text-sm mt-1">{errors.frequency[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 5 days, 1 week, 10 days"
                    required
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration[0]}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.instructions ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Special instructions for taking the medication..."
                />
                {errors.instructions && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructions[0]}</p>
                )}
              </div>
            </div>

            {/* Doctor Information - READ ONLY */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Prescribing Doctor
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaUserMd className="text-blue-600 mr-3 text-xl" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {getCurrentDoctorName()}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      You are prescribing this medication as the attending healthcare provider
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      💡 This cannot be changed - you are automatically set as the prescribing doctor
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Hidden input for doctor_id */}
              <input
                type="hidden"
                name="doctor_id"
                value={formData.doctor_id}
              />
              {errors.doctor_id && (
                <p className="text-red-500 text-sm mt-1">{errors.doctor_id[0]}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {isEdit ? 'Updating existing medication' : 'Creating new medication prescription'}
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/medications"
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
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      {isEdit ? 'Update Medication' : 'Create Medication'}
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

export default MedicationForm;