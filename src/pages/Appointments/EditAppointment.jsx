import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FaSave, 
  FaTimes, 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUser, 
  FaUserMd, 
  FaStethoscope,
  FaExclamationTriangle 
} from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const EditAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    patient_id: '',
    requested_doctor_id: '',
    preferred_date: '',
    preferred_time: '',
    reason: '',
    status: 'pending',
    doctor_feedback: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchAppointment();
    fetchDropdownData();
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      setDropdownLoading(true);
      console.log('=== FETCHING DROPDOWN DATA ===');
      
      // Fetch patients
      const patientsResponse = await axiosInstance.get('/patients');
      console.log('Patients response:', patientsResponse.data);
      
      let patientsData = [];
      if (patientsResponse.data && patientsResponse.data.success) {
        patientsData = patientsResponse.data.data?.data || patientsResponse.data.data || patientsResponse.data || [];
      }
      setPatients(patientsData);
      console.log('Processed patients:', patientsData);

      // Fetch doctors with better filtering
      await fetchDoctors();
      
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setSubmitError('Failed to load dropdown data: ' + (err.message || 'Unknown error'));
    } finally {
      setDropdownLoading(false);
      console.log('=== FINISHED FETCHING DROPDOWN DATA ===');
    }
  };

  const fetchDoctors = async () => {
    try {
      console.log('=== FETCHING DOCTORS ===');
      
      // Try dedicated doctors endpoint first
      try {
        const doctorsResponse = await axiosInstance.get('/admin/doctors');
        console.log('Doctors endpoint response:', doctorsResponse.data);
        
        if (doctorsResponse.data && doctorsResponse.data.success) {
          const doctorsData = doctorsResponse.data.data || [];
          console.log('Doctors from dedicated endpoint:', doctorsData);
          setDoctors(doctorsData);
          return;
        }
      } catch (endpointError) {
        console.log('Dedicated doctors endpoint not available, using fallback');
      }

      // Fallback: Get all users and filter
      const usersResponse = await axiosInstance.get('/admin/users');
      console.log('Users API response:', usersResponse.data);
      
      if (usersResponse.data && usersResponse.data.success) {
        const allUsers = usersResponse.data.data?.data || usersResponse.data.data || usersResponse.data || [];
        console.log('All users for filtering:', allUsers);
        
        // Multiple ways to identify doctors
        const doctorsData = allUsers.filter(user => {
          // Check roles array
          if (user.roles && Array.isArray(user.roles)) {
            const hasDoctorRole = user.roles.some(role => 
              role.name && role.name.toLowerCase() === 'doctor'
            );
            if (hasDoctorRole) return true;
          }
          
          // Check department
          if (user.department) {
            const department = user.department.toLowerCase();
            if (department === 'doctor' || department.includes('doctor')) {
              return true;
            }
          }
          
          return false;
        });
        
        console.log('Filtered doctors:', doctorsData);
        setDoctors(doctorsData);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctors([]);
    }
  };

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      console.log(`=== FETCHING APPOINTMENT ${id} ===`);
      
      const response = await axiosInstance.get(`/appointments/${id}`);
      console.log('Appointment response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch appointment');
      }

      const appointmentData = response.data.data;
      setOriginalData(appointmentData);
      
      // Split datetime into date and time
      const preferredDate = new Date(appointmentData.preferred_date);
      const dateStr = preferredDate.toISOString().split('T')[0];
      const timeStr = preferredDate.toTimeString().slice(0, 5);
      
      const formattedData = {
        ...appointmentData,
        preferred_date: dateStr,
        preferred_time: timeStr,
        requested_doctor_id: appointmentData.requested_doctor_id || '',
        doctor_feedback: appointmentData.doctor_feedback || ''
      };
      
      setFormData(formattedData);
      console.log('Formatted appointment data:', formattedData);
      
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setSubmitError('Failed to fetch appointment details: ' + (err.message || 'Unknown error'));
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
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general errors when user makes any change
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError('');
    setErrors({});

    console.log('=== SUBMITTING APPOINTMENT UPDATE ===');
    console.log('Form data:', formData);

    // Validation
    const requiredFields = ['patient_id', 'preferred_date', 'preferred_time'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setErrors({
        general: [`Please fill in all required fields: ${missingFields.join(', ')}`]
      });
      setSaving(false);
      return;
    }

    // Check if date is in the past for pending/approved appointments
    const appointmentDateTime = new Date(`${formData.preferred_date}T${formData.preferred_time}`);
    const now = new Date();
    
    if ((formData.status === 'pending' || formData.status === 'approved') && appointmentDateTime < now) {
      setErrors({
        general: ['Cannot set appointment date/time in the past for pending or approved appointments']
      });
      setSaving(false);
      return;
    }

    try {
      // Combine date and time
      const preferredDateTime = `${formData.preferred_date}T${formData.preferred_time}`;

      const submissionData = {
        patient_id: formData.patient_id.toString(),
        preferred_date: preferredDateTime,
        reason: formData.reason?.trim() || '',
        status: formData.status,
        doctor_feedback: formData.doctor_feedback?.trim() || ''
      };

      if (formData.requested_doctor_id && formData.requested_doctor_id !== '') {
        submissionData.requested_doctor_id = formData.requested_doctor_id.toString();
      }

      console.log('Submitting update data:', submissionData);

      const response = await axiosInstance.put(`/appointments/${id}`, submissionData);
      
      if (response.data.success) {
        console.log('✅ Appointment updated successfully!');
        navigate(`/appointments/${id}`, { 
          state: { 
            message: 'Appointment updated successfully!',
            type: 'success'
          } 
        });
      } else {
        throw new Error(response.data.message || 'Failed to update appointment');
      }

    } catch (err) {
      console.error('❌ API Error:', err);
      
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        console.log('Validation errors:', validationErrors);
        setErrors(validationErrors);
        const firstError = Object.values(validationErrors)[0]?.[0];
        setSubmitError(firstError || 'Please check the form for errors');
      } else if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else if (err.request) {
        setSubmitError('No response from server. Please check your internet connection.');
      } else {
        setSubmitError('Failed to update appointment. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setSubmitError('');
    fetchAppointment();
    fetchDropdownData();
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    const currentDateTime = new Date(`${formData.preferred_date}T${formData.preferred_time}`);
    const originalDateTime = new Date(originalData.preferred_date);
    
    return (
      formData.patient_id !== originalData.patient_id ||
      currentDateTime.getTime() !== originalDateTime.getTime() ||
      formData.requested_doctor_id !== (originalData.requested_doctor_id || '') ||
      formData.reason !== (originalData.reason || '') ||
      formData.status !== originalData.status ||
      formData.doctor_feedback !== (originalData.doctor_feedback || '')
    );
  };

  const safePatients = Array.isArray(patients) ? patients : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  const getDoctorDisplayText = (doctor) => {
    const name = `Dr. ${doctor.first_name} ${doctor.last_name}`;
    const department = doctor.department ? ` - ${doctor.department}` : '';
    const specialization = doctor.specialization ? ` (${doctor.specialization})` : '';
    
    return `${name}${department}${specialization}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12 flex-col">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-gray-600">Loading appointment details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/appointments/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Appointment Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaCalendarAlt className="inline mr-2 mb-1" />
          Edit Appointment
        </h1>
        <p className="text-gray-600 mt-2">Update appointment information and doctor feedback</p>
      </div>

      {/* Error Display */}
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <span>{submitError}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleRetry}
                className="text-red-700 hover:text-red-900 text-sm underline"
              >
                Retry
              </button>
              <button 
                onClick={() => setSubmitError('')} 
                className="text-red-700 hover:text-red-900"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <span>{errors.general[0]}</span>
            </div>
            <button 
              onClick={() => setErrors(prev => ({...prev, general: null}))} 
              className="text-red-700 hover:text-red-900"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {dropdownLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading dropdown data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Patient and Doctor Information */}
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
                  disabled={saving}
                >
                  <option value="">Select Patient</option>
                  {safePatients.length === 0 ? (
                    <option value="" disabled>No patients available</option>
                  ) : (
                    safePatients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} 
                        {patient.date_of_birth && ` (DOB: ${new Date(patient.date_of_birth).toLocaleDateString()})`}
                      </option>
                    ))
                  )}
                </select>
                {errors.patient_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.patient_id[0]}</p>
                )}
                {safePatients.length === 0 && !dropdownLoading && (
                  <p className="text-yellow-600 text-sm mt-1">
                    No patients found in the system.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserMd className="inline mr-1" />
                  Requested Doctor (Optional)
                </label>
                <select
                  name="requested_doctor_id"
                  value={formData.requested_doctor_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.requested_doctor_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={saving}
                >
                  <option value="">Any Available Doctor</option>
                  {safeDoctors.length === 0 ? (
                    <option value="" disabled>No doctors available</option>
                  ) : (
                    safeDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {getDoctorDisplayText(doctor)}
                      </option>
                    ))
                  )}
                </select>
                {errors.requested_doctor_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.requested_doctor_id[0]}</p>
                )}
                {safeDoctors.length === 0 && !dropdownLoading && (
                  <p className="text-yellow-600 text-sm mt-1">
                    No doctors found. Appointment will be assigned to any available doctor.
                  </p>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Appointment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.preferred_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={saving}
                  />
                  {errors.preferred_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.preferred_date[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.preferred_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    disabled={saving}
                  />
                  {errors.preferred_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.preferred_time[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Appointment
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief reason for the appointment (e.g., routine checkup, specific symptoms, follow-up visit)..."
                  disabled={saving}
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm mt-1">{errors.reason[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaStethoscope className="inline mr-1" />
                  Doctor Feedback & Notes
                </label>
                <textarea
                  name="doctor_feedback"
                  value={formData.doctor_feedback}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.doctor_feedback ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter doctor's feedback, medical notes, observations, or treatment recommendations..."
                  disabled={saving}
                />
                {errors.doctor_feedback && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctor_feedback[0]}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  This feedback will be visible to other medical staff and can be used for treatment follow-up.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {safePatients.length} patients available • {safeDoctors.length} doctors available
                {hasChanges() && (
                  <span className="ml-2 text-blue-600 font-medium">• Unsaved changes</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/appointments/${id}`}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving || !hasChanges()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Update Appointment
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

export default EditAppointment;