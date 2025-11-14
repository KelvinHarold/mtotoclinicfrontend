import React, { useState, useEffect } from 'react';
import axios from '../../../../api/axios';

const ChildForm = ({ record, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    mother_id: '',
    gender: '',
    birth_weight: '',
    birth_height: '',
    mother_name: '',
    mother_phone: '',
    father_name: ''
  });
  const [patients, setPatients] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingMothers, setLoadingMothers] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        patient_id: record.patient_id || '',
        mother_id: record.mother_id || '',
        gender: record.gender || '',
        birth_weight: record.birth_weight || '',
        birth_height: record.birth_height || '',
        mother_name: record.mother_name || '',
        mother_phone: record.mother_phone || '',
        father_name: record.father_name || ''
      });
    }
    fetchChildPatients();
    fetchMothers();
  }, [record]);

  const fetchChildPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await axios.get('/patients?per_page=1000');
      console.log('Patients API Response:', response.data);
      
      const allPatients = response.data.data?.data || response.data.data || [];
      console.log('All patients:', allPatients);
      
      const childPatients = allPatients.filter(patient => 
        patient.patient_type === 'child'
      );
      console.log('Child patients:', childPatients);
      
      // 🔥 CHECK IN CHILDREN TABLE INSTEAD OF PATIENTS TABLE
      const patientsWithRecords = await getChildrenWithExistingRecords();
      console.log('Patients with existing children records:', patientsWithRecords);
      
      const availablePatients = childPatients.filter(patient => 
        !patientsWithRecords.includes(parseInt(patient.id))
      );
      
      console.log('Available patients:', availablePatients);
      setPatients(availablePatients);
    } catch (error) {
      console.error('Error fetching child patients:', error);
      alert('Failed to load child patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchMothers = async () => {
    try {
      setLoadingMothers(true);
      const response = await axios.get('/patients?per_page=1000');
      console.log('Mothers API Response:', response.data);
      
      const allPatients = response.data.data?.data || response.data.data || [];
      
      // Mothers are patients of type 'pregnant' or 'breastfeeding' (women)
      const motherPatients = allPatients.filter(patient => 
        patient.patient_type === 'pregnant' || patient.patient_type === 'breastfeeding'
      );
      console.log('Mother patients:', motherPatients);
      setMothers(motherPatients);
    } catch (error) {
      console.error('Error fetching mothers:', error);
      alert('Failed to load mothers list');
    } finally {
      setLoadingMothers(false);
    }
  };

  const getChildrenWithExistingRecords = async () => {
    try {
      // 🔥 CHECK IN CHILDREN TABLE FOR EXISTING RECORDS
      const response = await axios.get('/children?per_page=1000');
      console.log('Existing children records:', response.data);
      
      // Handle different response structures
      const existingRecords = response.data.data?.data || response.data.data || response.data || [];
      console.log('Processed existing records:', existingRecords);
      
      // Extract patient_ids from children records
      const patientIds = existingRecords
        .map(record => record.patient_id)
        .filter(id => id != null)
        .map(id => parseInt(id));
      
      console.log('Patient IDs with existing children records:', patientIds);
      return patientIds;
    } catch (error) {
      console.error('Error fetching existing children records:', error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMotherSelect = (e) => {
    const motherId = e.target.value;
    console.log('Selected mother ID:', motherId);
    
    if (motherId) {
      const selectedMother = mothers.find(mother => mother.id == motherId);
      console.log('Selected mother:', selectedMother);
      
      if (selectedMother) {
        setFormData(prev => ({
          ...prev,
          mother_id: motherId,
          mother_name: `${selectedMother.first_name} ${selectedMother.last_name}`.trim(),
          mother_phone: selectedMother.phone_number || ''
        }));
      }
    } else {
      // Clear mother fields if "Select mother" is chosen
      setFormData(prev => ({
        ...prev,
        mother_id: '',
        mother_name: '',
        mother_phone: ''
      }));
    }
  };

  const handlePatientSelect = (e) => {
    const patientId = e.target.value;
    console.log('Selected patient ID:', patientId);
    
    if (patientId) {
      const selectedPatient = patients.find(patient => patient.id == patientId);
      console.log('Selected patient:', selectedPatient);
      
      setFormData(prev => ({
        ...prev,
        patient_id: patientId
      }));
    }
  };

  const calculateAge = async (birthDate) => {
    if (!birthDate) return;
    
    try {
      setCalculating(true);
      const response = await axios.get(`/patients/children/calculate-age?birth_date=${birthDate}`);
      console.log('Age calculation response:', response.data);
      
      const { age_description, developmental_stage } = response.data.data;
      
      alert(`Age calculated: ${age_description} - ${developmental_stage}`);
    } catch (error) {
      console.error('Error calculating age:', error);
      alert('Failed to calculate age');
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!record && !formData.patient_id) {
      alert('Please select a child patient');
      return;
    }
    
    if (!formData.gender) {
      alert('Please select gender');
      return;
    }
    
    if (!formData.mother_name) {
      alert('Please enter mother\'s name');
      return;
    }
    
    if (!formData.mother_phone) {
      alert('Please enter mother\'s phone number');
      return;
    }

    // Prevent submission if no patients available (for new records)
    if (!record && patients.length === 0) {
      alert('No available child patients for registration');
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      patient_id: formData.patient_id || record?.patient_id,
      // Ensure numeric values are properly formatted
      birth_weight: formData.birth_weight ? parseFloat(formData.birth_weight) : null,
      birth_height: formData.birth_height ? parseFloat(formData.birth_height) : null,
      mother_id: formData.mother_id || null // Ensure mother_id is null if empty
    };

    console.log('Submitting data:', submitData);
    onSubmit(submitData);
  };

  // Get selected patient for age calculation
  const selectedPatient = patients.find(p => p.id == formData.patient_id) || record?.patient;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Selection - Only show when creating new record */}
        {!record && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child Patient *
            </label>
            {loadingPatients ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading available child patients...</p>
              </div>
            ) : (
              <>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handlePatientSelect}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a child patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.phone_number} 
                      {patient.date_of_birth && ` - DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}`}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Showing {patients.length} child patient(s) available for registration</p>
                  {patients.length === 0 && (
                    <p className="text-red-600 mt-1">
                      No available child patients. Please register a patient with type "child" first.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Mother Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Mother (Optional)
          </label>
          {loadingMothers ? (
            <div className="p-3 border border-gray-300 rounded-lg text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-1 text-xs text-gray-600">Loading mothers...</p>
            </div>
          ) : (
            <select
              value={formData.mother_id}
              onChange={handleMotherSelect}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select mother from patients</option>
              {mothers.map(mother => (
                <option key={mother.id} value={mother.id}>
                  {mother.first_name} {mother.last_name} - {mother.phone_number}
                  {mother.patient_type && ` (${mother.patient_type})`}
                </option>
              ))}
            </select>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Selecting a mother will auto-fill name and phone
          </p>
        </div>

        {/* Birth Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Weight (kg)
          </label>
          <input
            type="number"
            name="birth_weight"
            value={formData.birth_weight}
            onChange={handleChange}
            min="0.5"
            max="10"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 3.2"
          />
        </div>

        {/* Birth Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Height (cm)
          </label>
          <input
            type="number"
            name="birth_height"
            value={formData.birth_height}
            onChange={handleChange}
            min="20"
            max="100"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 50.5"
          />
        </div>

        {/* Mother's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Name *
          </label>
          <input
            type="text"
            name="mother_name"
            value={formData.mother_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter mother's full name"
          />
        </div>

        {/* Mother's Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Phone *
          </label>
          <input
            type="tel"
            name="mother_phone"
            value={formData.mother_phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter mother's phone number"
          />
        </div>

        {/* Father's Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name (Optional)
          </label>
          <input
            type="text"
            name="father_name"
            value={formData.father_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter father's full name"
          />
        </div>
      </div>

      {/* Age Calculator */}
      {selectedPatient?.date_of_birth && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Age Information</h3>
          <p className="text-sm text-blue-700">
            Child's Date of Birth: {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
          </p>
          <button
            type="button"
            onClick={() => calculateAge(selectedPatient.date_of_birth)}
            disabled={calculating}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {calculating ? 'Calculating...' : 'Calculate Current Age'}
          </button>
        </div>
      )}

      {/* Debug Info (remove in production) */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Debug Info</h3>
        <p className="text-xs text-gray-600">
          Patients: {patients.length} | Mothers: {mothers.length} | Selected Patient: {formData.patient_id} | Selected Mother: {formData.mother_id}
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || (patients.length === 0 && !record)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : (record ? 'Update Child Record' : 'Create Child Record')}
        </button>
      </div>
    </form>
  );
};

export default ChildForm;
