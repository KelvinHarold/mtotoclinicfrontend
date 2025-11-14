import React, { useState, useEffect } from 'react';
import axios from '../../../../api/axios';

const PregnantWomanForm = ({ record, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    last_menstrual_period: '',
    expected_delivery_date: '',
    parity: 0,
    gravida: 1,
    husband_name: '',
    husband_phone: ''
  });
  const [patients, setPatients] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    if (record) {
      setFormData({
        patient_id: record.patient_id || '',
        last_menstrual_period: record.last_menstrual_period || '',
        expected_delivery_date: record.expected_delivery_date || '',
        parity: record.parity || 0,
        gravida: record.gravida || 1,
        husband_name: record.husband_name || '',
        husband_phone: record.husband_phone || ''
      });
    }
    fetchPregnantPatients();
  }, [record]);

  const fetchPregnantPatients = async () => {
    try {
      setLoadingPatients(true);
      // Tumia direct patients API na filter manually
      const response = await axios.get('/patients');
      const allPatients = response.data.data.data;
      const pregnantPatients = allPatients.filter(patient => 
        patient.patient_type === 'pregnant'
      );
      
      // Filter out patients who already have pregnant woman records
      const patientsWithRecords = await getPatientsWithExistingRecords();
      const availablePatients = pregnantPatients.filter(patient => 
        !patientsWithRecords.includes(patient.id)
      );
      
      setPatients(availablePatients);
    } catch (error) {
      console.error('Error fetching pregnant patients:', error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const getPatientsWithExistingRecords = async () => {
    try {
      const response = await axios.get('/pregnant-women');
      const existingRecords = response.data.data.data;
      return existingRecords.map(record => record.patient_id);
    } catch (error) {
      console.error('Error fetching existing records:', error);
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

  const calculateEDD = async (lmp) => {
    if (!lmp) return;
    
    try {
      setCalculating(true);
      const response = await axios.get(`/pregnant-women/calculate-edd?last_menstrual_period=${lmp}`);
      const { expected_delivery_date, gestational_age_weeks } = response.data.data;
      
      setFormData(prev => ({
        ...prev,
        expected_delivery_date,
        last_menstrual_period: lmp
      }));
      
      alert(`EDD calculated: ${new Date(expected_delivery_date).toLocaleDateString()} (${gestational_age_weeks} weeks gestation)`);
    } catch (error) {
      console.error('Error calculating EDD:', error);
      alert('Failed to calculate EDD');
    } finally {
      setCalculating(false);
    }
  };

  const handleLMPChange = (e) => {
    const lmp = e.target.value;
    setFormData(prev => ({ ...prev, last_menstrual_period: lmp }));
    
    if (lmp) {
      calculateEDD(lmp);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that a patient is selected when creating new record
    if (!record && !formData.patient_id) {
      alert('Please select a patient');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Selection */}
        {!record && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            {loadingPatients ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading available patients...</p>
              </div>
            ) : (
              <>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a pregnant patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.phone_number}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Showing {patients.length} pregnant patient(s) available for registration</p>
                  {patients.length === 0 && (
                    <p className="text-red-600 mt-1">
                      No available pregnant patients. Please register a patient with type "pregnant" first.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Last Menstrual Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Menstrual Period (LMP) *
          </label>
          <input
            type="date"
            name="last_menstrual_period"
            value={formData.last_menstrual_period}
            onChange={handleLMPChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {calculating && (
            <p className="mt-1 text-sm text-blue-600">Calculating EDD...</p>
          )}
        </div>

        {/* Expected Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Delivery Date (EDD) *
          </label>
          <input
            type="date"
            name="expected_delivery_date"
            value={formData.expected_delivery_date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Gravida */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gravida (Number of pregnancies) *
          </label>
          <input
            type="number"
            name="gravida"
            value={formData.gravida}
            onChange={handleChange}
            min="1"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Parity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parity (Number of live births) *
          </label>
          <input
            type="number"
            name="parity"
            value={formData.parity}
            onChange={handleChange}
            min="0"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Husband Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Husband/Partner Name
          </label>
          <input
            type="text"
            name="husband_name"
            value={formData.husband_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Husband Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Husband/Partner Phone
          </label>
          <input
            type="tel"
            name="husband_phone"
            value={formData.husband_phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="255712345678"
          />
        </div>
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
          {loading ? 'Saving...' : (record ? 'Update Record' : 'Create Record')}
        </button>
      </div>
    </form>
  );
};

export default PregnantWomanForm;