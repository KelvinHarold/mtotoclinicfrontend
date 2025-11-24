import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft, FaFlask, FaPlus, FaTrash } from 'react-icons/fa';
import api from '../../api/axios';

const LabTestCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Start with one empty test field
  const [formData, setFormData] = useState({
    patient_id: '',
    visit_id: '',
    test_date: new Date().toISOString().split('T')[0],
    doctor_id: '',
    general_notes: ''
  });

  const [tests, setTests] = useState([
    {
      id: 1,
      test_name: '',
      test_notes: ''
    }
  ]);

  useEffect(() => {
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
      
      // Auto-select the first active visit if exists
      if (patientVisits.length > 0 && !formData.visit_id) {
        const activeVisit = patientVisits.find(visit => visit.status === 'active') || patientVisits[0];
        setFormData(prev => ({
          ...prev,
          visit_id: activeVisit.id
        }));
      }
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

  // Add new test field
  const addTestField = () => {
    const newTest = {
      id: Date.now(), // Unique ID
      test_name: '',
      test_notes: ''
    };
    setTests(prev => [...prev, newTest]);
  };

  // Remove test field
  const removeTestField = (id) => {
    if (tests.length > 1) {
      setTests(prev => prev.filter(test => test.id !== id));
    }
  };

  // Handle test field changes
  const handleTestChange = (id, field, value) => {
    setTests(prev => 
      prev.map(test => 
        test.id === id ? { ...test, [field]: value } : test
      )
    );
  };

  // Handle general form changes
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
    if (!formData.patient_id || !formData.visit_id || !formData.test_date || !formData.doctor_id) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Filter out empty tests
    const validTests = tests.filter(test => test.test_name.trim() !== '');
    
    // Check if at least one test has a name
    if (validTests.length === 0) {
      setError('Please add at least one test name');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting lab tests:', { ...formData, tests: validTests });
      
      // Use bulk endpoint if available, otherwise use individual creation
      let createdTests = [];
      
      try {
        // Try bulk creation first
        const bulkData = {
          patient_id: formData.patient_id,
          visit_id: formData.visit_id,
          test_date: formData.test_date,
          doctor_id: formData.doctor_id,
          tests: validTests,
          general_notes: formData.general_notes
        };
        
        const response = await api.post('/lab-tests/bulk', bulkData);
        if (response.data.success) {
          createdTests = response.data.data || [];
        }
      } catch (bulkError) {
        console.log('Bulk creation failed, falling back to individual creation:', bulkError);
        // Fallback to individual creation
        createdTests = await createTestsIndividually(validTests);
      }

      if (createdTests.length > 0) {
        const message = createdTests.length === 1 
          ? 'Lab test created successfully!' 
          : `${createdTests.length} lab tests created successfully!`;
        
        setSuccess(message);
        setTimeout(() => {
          navigate('/lab-tests');
        }, 2000);
      } else {
        setError('Failed to create any lab tests. Please try again.');
      }
    } catch (err) {
      console.error('General API Error:', err);
      
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create lab tests. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Individual creation fallback
  const createTestsIndividually = async (validTests) => {
    const createdTests = [];
    
    for (const test of validTests) {
      const testData = {
        patient_id: formData.patient_id,
        visit_id: formData.visit_id,
        test_date: formData.test_date,
        doctor_id: formData.doctor_id,
        test_name: test.test_name,
        test_notes: test.test_notes || ''
      };

      // Add general notes to the first test if provided
      if (formData.general_notes && createdTests.length === 0) {
        testData.test_notes = formData.general_notes + 
          (testData.test_notes ? '\n\n' + testData.test_notes : '');
      }

      try {
        const response = await api.post('/lab-tests', testData);
        if (response.data.success) {
          createdTests.push(response.data.data);
        }
      } catch (err) {
        console.error(`Failed to create test: ${test.test_name}`, err);
        // Continue with other tests even if one fails
      }
    }
    
    return createdTests;
  };

  const safePatients = Array.isArray(patients) ? patients : [];
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

  // Count tests with names
  const testsWithNames = tests.filter(test => test.test_name.trim() !== '').length;

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
          Create Lab Test(s)
        </h1>
        <p className="text-gray-600 mt-2">
          Add one or multiple lab tests. Click "Add Another Test" for more tests.
        </p>
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                      {patient.date_of_birth && ` (DOB: ${new Date(patient.date_of_birth).toLocaleDateString()})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visit *
                </label>
                <select
                  name="visit_id"
                  value={formData.visit_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.patient_id}
                >
                  <option value="">
                    {formData.patient_id ? 'Select Visit' : 'First select a patient'}
                  </option>
                  {filteredVisits.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      Visit #{visit.id} - 
                      {visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : 'No date'}
                      {visit.current_department && ` - ${visit.current_department}`}
                      {visit.status && ` (${visit.status})`}
                    </option>
                  ))}
                </select>
                {!formData.patient_id && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select a patient first to see their visits
                  </p>
                )}
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requesting Doctor *
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
                  Automatically set to your account
                </p>
              </div>
            </div>

            {/* Dynamic Test Fields */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Lab Tests 
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({testsWithNames} of {tests.length} with names)
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={addTestField}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                >
                  <FaPlus className="mr-2" />
                  Add Another Test
                </button>
              </div>

              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">
                        {tests.length === 1 ? 'Test Details' : `Test #${index + 1}`}
                      </h4>
                      {tests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestField(test.id)}
                          className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition duration-200"
                          title="Remove this test"
                        >
                          <FaTrash className="mr-1" size={12} />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Name *
                        </label>
                        <input
                          type="text"
                          value={test.test_name}
                          onChange={(e) => handleTestChange(test.id, 'test_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Blood Count, Urinalysis, Malaria Test"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Notes
                        </label>
                        <textarea
                          value={test.test_notes}
                          onChange={(e) => handleTestChange(test.id, 'test_notes', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Specific instructions for this test..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {tests.length > 1 && (
                <p className="text-sm text-gray-500 mt-3">
                  💡 <strong>Tip:</strong> Empty test fields will be automatically ignored when submitting.
                </p>
              )}
            </div>

            {/* General Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Notes (Optional)
              </label>
              <textarea
                name="general_notes"
                value={formData.general_notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any general instructions or notes for all tests..."
              />
              <p className="text-xs text-gray-500 mt-1">
                These notes will be added to the first test only
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {tests.length} test field(s) • {testsWithNames} with names
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/lab-tests"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || testsWithNames === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {testsWithNames === 1 ? 'Creating...' : `Creating ${testsWithNames} Tests...`}
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      {testsWithNames === 1 ? 'Create Lab Test' : `Create ${testsWithNames} Tests`}
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

export default LabTestCreate;