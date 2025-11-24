import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaSyringe, FaUser, FaCalendarAlt, FaStethoscope, FaUserMd } from 'react-icons/fa';
import axiosInstance from '../../api/axios';

const EditVaccination = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    patient_id: '',
    visit_id: '',
    vaccine_name: '',
    dose: '',
    vaccination_date: '',
    next_due_date: '',
    doctor_id: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchVaccination();
    setCurrentUserFromLocalStorage();
    fetchDropdownData();
  }, [id]);

  useEffect(() => {
    if (formData.patient_id) {
      const patientVisits = visits.filter(visit => 
        visit.patient_id == formData.patient_id
      );
      setFilteredVisits(patientVisits);
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

  const fetchVaccination = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/vaccinations/${id}`);
      const vaccinationData = response.data.data;
      
      const formattedData = {
        ...vaccinationData,
        vaccination_date: vaccinationData.vaccination_date ? vaccinationData.vaccination_date.split('T')[0] : '',
        next_due_date: vaccinationData.next_due_date ? vaccinationData.next_due_date.split('T')[0] : ''
      };
      
      setFormData(formattedData);
    } catch (err) {
      setSubmitError('Failed to fetch vaccination details');
      console.error('Error fetching vaccination:', err);
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

    const requiredFields = ['patient_id', 'vaccine_name', 'dose', 'vaccination_date', 'doctor_id'];
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
        vaccine_name: formData.vaccine_name.trim(),
        dose: formData.dose.trim(),
        vaccination_date: formData.vaccination_date,
        next_due_date: formData.next_due_date || null,
        doctor_id: formData.doctor_id.toString()
      };

      if (formData.visit_id && formData.visit_id !== '') {
        submissionData.visit_id = formData.visit_id.toString();
      }

      const response = await axiosInstance.put(`/vaccinations/${id}`, submissionData);
      
      // Success - redirect to detail page
      navigate(`/vaccinations/${id}`, { 
        state: { message: 'Vaccination record updated successfully!' } 
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
        setSubmitError('Failed to update vaccination record. Please try again.');
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading vaccination details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to={`/vaccinations/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Vaccination Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaSyringe className="inline mr-2 mb-1" />
          Edit Vaccination
        </h1>
        <p className="text-gray-600 mt-2">Update vaccination record information</p>
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
                      Visit #{visit.id} - {new Date(visit.visit_date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {errors.visit_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.visit_id[0]}</p>
                )}
              </div>
            </div>

            {/* Vaccination Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Vaccination Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaccine Name *
                  </label>
                  <input
                    type="text"
                    name="vaccine_name"
                    value={formData.vaccine_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vaccine_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., BCG, Polio, Measles"
                    required
                  />
                  {errors.vaccine_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.vaccine_name[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dose *
                  </label>
                  <input
                    type="text"
                    name="dose"
                    value={formData.dose}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dose ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 1st dose, 2nd dose, Booster"
                    required
                  />
                  {errors.dose && (
                    <p className="text-red-500 text-sm mt-1">{errors.dose[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Vaccination Date *
                  </label>
                  <input
                    type="date"
                    name="vaccination_date"
                    value={formData.vaccination_date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vaccination_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.vaccination_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.vaccination_date[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    name="next_due_date"
                    value={formData.next_due_date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.next_due_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.next_due_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.next_due_date[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Healthcare Provider
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaUserMd className="text-blue-600 mr-3 text-xl" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {getCurrentDoctorName()}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      You are updating this vaccination record
                    </p>
                  </div>
                </div>
              </div>
              <input type="hidden" name="doctor_id" value={formData.doctor_id} />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Updating vaccination record #{id}
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/vaccinations/${id}`}
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
                      Update Vaccination
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

export default EditVaccination;