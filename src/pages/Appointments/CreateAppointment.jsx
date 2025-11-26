import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaCalendarAlt, FaUser, FaUserMd } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const CreateAppointment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_id: '',
    requested_doctor_id: '',
    preferred_date: '',
    preferred_time: '',
    reason: '',
    status: 'pending'
  });
  
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      setDropdownLoading(true);
      setSubmitError('');
      
      console.log('=== START FETCHING DROPDOWN DATA ===');
      
      // Fetch patients
      console.log('Fetching patients...');
      const patientsResponse = await axiosInstance.get('/patients');
      console.log('Patients API Response:', patientsResponse.data);
      
      let patientsData = [];
      if (patientsResponse.data && patientsResponse.data.success) {
        patientsData = patientsResponse.data.data?.data || patientsResponse.data.data || patientsResponse.data || [];
      }
      console.log('Processed patients data:', patientsData);
      setPatients(patientsData);

      // Fetch doctors
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
      console.log('=== START FETCHING DOCTORS ===');
      
      // Option 1: Try dedicated doctors endpoint first
      try {
        console.log('Trying dedicated doctors endpoint...');
        const doctorsResponse = await axiosInstance.get('/admin/doctors');
        console.log('Doctors endpoint response:', doctorsResponse.data);
        
        if (doctorsResponse.data && doctorsResponse.data.success) {
          const doctorsData = doctorsResponse.data.data || [];
          console.log('✅ Doctors from dedicated endpoint:', doctorsData);
          setDoctors(doctorsData);
          return;
        }
      } catch (endpointError) {
        console.log('❌ Dedicated doctors endpoint not available:', endpointError.message);
      }

      // Option 2: Fallback to filtering from users
      console.log('Falling back to users endpoint...');
      const usersResponse = await axiosInstance.get('/admin/users');
      console.log('Users API response:', usersResponse.data);
      
      if (usersResponse.data && usersResponse.data.success) {
        const allUsers = usersResponse.data.data?.data || usersResponse.data.data || usersResponse.data || [];
        console.log('All users raw data:', allUsers);
        
        // Debug: Log each user's structure
        allUsers.forEach((user, index) => {
          console.log(`User ${index + 1}:`, {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            department: user.department,
            roles: user.roles,
            hasRoles: !!user.roles,
            rolesIsArray: Array.isArray(user.roles),
            roleNames: user.roles ? user.roles.map(r => r.name) : 'No roles'
          });
        });

        // Multiple ways to identify doctors
        const doctorsData = allUsers.filter(user => {
          // Method 1: Check roles array
          if (user.roles && Array.isArray(user.roles)) {
            const hasDoctorRole = user.roles.some(role => {
              const roleName = role.name ? role.name.toLowerCase() : '';
              return roleName === 'doctor' || roleName.includes('doctor');
            });
            if (hasDoctorRole) {
              console.log(`✅ ${user.first_name} ${user.last_name} - Has doctor role`);
              return true;
            }
          }
          
          // Method 2: Check department
          if (user.department) {
            const department = user.department.toLowerCase();
            const isDoctorDepartment = department === 'doctor' || 
                                     department.includes('doctor') ||
                                     department === 'daktari' ||
                                     department.includes('daktari');
            if (isDoctorDepartment) {
              console.log(`✅ ${user.first_name} ${user.last_name} - Has doctor department: ${user.department}`);
              return true;
            }
          }
          
          console.log(`❌ ${user.first_name} ${user.last_name} - Not a doctor`);
          return false;
        });
        
        console.log('Final filtered doctors:', doctorsData);
        
        if (doctorsData.length === 0) {
          console.log('⚠️ No doctors found. Showing all users as fallback...');
          // Fallback: Show all users if no doctors found
          setDoctors(allUsers.map(user => ({
            ...user,
            is_doctor: false // Mark as not doctor for display
          })));
        } else {
          setDoctors(doctorsData);
        }
      } else {
        console.log('❌ Users API did not return success');
        setDoctors([]);
      }
    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      setDoctors([]);
      setSubmitError('Failed to load doctors list: ' + (err.message || 'Unknown error'));
    } finally {
      console.log('=== FINISHED FETCHING DOCTORS ===');
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

    console.log('=== START SUBMITTING APPOINTMENT ===');
    console.log('Form data:', formData);

    // Combine date and time
    const preferredDateTime = `${formData.preferred_date}T${formData.preferred_time}`;

    const requiredFields = ['patient_id', 'preferred_date', 'preferred_time'];
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
        preferred_date: preferredDateTime,
        reason: formData.reason.trim(),
        status: formData.status
      };

      if (formData.requested_doctor_id && formData.requested_doctor_id !== '') {
        submissionData.requested_doctor_id = formData.requested_doctor_id.toString();
      }

      console.log('Submitting appointment data:', submissionData);

      const response = await axiosInstance.post('/appointments', submissionData);
      console.log('Appointment creation response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Appointment created successfully!');
        navigate('/appointments', { 
          state: { 
            message: 'Appointment created successfully!',
            type: 'success'
          } 
        });
      } else {
        throw new Error(response.data.message || 'Failed to create appointment');
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
        setSubmitError('Failed to create appointment. Please try again.');
      }
    } finally {
      setLoading(false);
      console.log('=== FINISHED SUBMITTING APPOINTMENT ===');
    }
  };

  const safePatients = Array.isArray(patients) ? patients : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  // Helper function to display doctor information
  const getDoctorDisplayText = (doctor) => {
    const name = `Dr. ${doctor.first_name} ${doctor.last_name}`;
    const department = doctor.department ? ` - ${doctor.department}` : '';
    const specialization = doctor.specialization ? ` (${doctor.specialization})` : '';
    const notDoctor = doctor.is_doctor === false ? ' [Not Doctor]' : '';
    
    return `${name}${department}${specialization}${notDoctor}`;
  };

  const handleRetryLoadData = () => {
    fetchDropdownData();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/appointments"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Appointments
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaCalendarAlt className="inline mr-2 mb-1" />
          Schedule New Appointment
        </h1>
        <p className="text-gray-600 mt-2">Schedule a new appointment for a patient</p>
      </div>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <div>
              <strong>Error:</strong> {submitError}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleRetryLoadData}
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
                    No patients found. Please add patients first.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <FaUserMd className="inline mr-1" />
                    Requested Doctor (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleRetryLoadData}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Refresh List
                  </button>
                </div>
                <select
                  name="requested_doctor_id"
                  value={formData.requested_doctor_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.requested_doctor_id ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                    No doctors found in the system. The appointment will be assigned to any available doctor.
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
                  />
                  {errors.preferred_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.preferred_time[0]}</p>
                  )}
                </div>
              </div>

              <div>
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
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm mt-1">{errors.reason[0]}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {safePatients.length} patients available • {safeDoctors.length} doctors available
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/appointments"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || safePatients.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Schedule Appointment
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

export default CreateAppointment;