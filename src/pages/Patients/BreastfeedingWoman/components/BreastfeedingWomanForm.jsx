import React, { useState, useEffect } from 'react';
import axios from '../../../../api/axios';

const BreastfeedingWomanForm = ({ record, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    delivery_date: '',
    baby_name: '',
    baby_age_months: ''
  });
  const [patients, setPatients] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    if (record) {
      setFormData({
        patient_id: record.patient_id || '',
        delivery_date: record.delivery_date || '',
        baby_name: record.baby_name || '',
        baby_age_months: record.baby_age_months || ''
      });
    }
    fetchBreastfeedingPatients();
  }, [record]);

  const fetchBreastfeedingPatients = async () => {
    try {
      setLoadingPatients(true);
      // Tumia direct patients API na filter manually
      const response = await axios.get('/patients');
      const allPatients = response.data.data.data;
      const breastfeedingPatients = allPatients.filter(patient => 
        patient.patient_type === 'breastfeeding'
      );
      
      // Filter out patients who already have breastfeeding records
      const patientsWithRecords = await getPatientsWithExistingRecords();
      const availablePatients = breastfeedingPatients.filter(patient => 
        !patientsWithRecords.includes(patient.id)
      );
      
      setPatients(availablePatients);
    } catch (error) {
      console.error('Error fetching breastfeeding patients:', error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const getPatientsWithExistingRecords = async () => {
    try {
      const response = await axios.get('/breastfeeding-women');
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

  const calculateBabyAge = async (deliveryDate) => {
    if (!deliveryDate) return;
    
    try {
      setCalculating(true);
      const response = await axios.get(`/breastfeeding-women/calculate-baby-age?delivery_date=${deliveryDate}`);
      const { baby_age_months, baby_age_days } = response.data.data;
      
      setFormData(prev => ({
        ...prev,
        baby_age_months: baby_age_months.toString(),
        delivery_date: deliveryDate
      }));
      
      alert(`Baby age calculated: ${baby_age_months} months (${baby_age_days} days)`);
    } catch (error) {
      console.error('Error calculating baby age:', error);
      alert('Failed to calculate baby age');
    } finally {
      setCalculating(false);
    }
  };

  const handleDeliveryDateChange = (e) => {
    const deliveryDate = e.target.value;
    setFormData(prev => ({ ...prev, delivery_date: deliveryDate }));
    
    if (deliveryDate) {
      calculateBabyAge(deliveryDate);
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
                  <option value="">Select a breastfeeding patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.phone_number}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Showing {patients.length} breastfeeding patient(s) available for registration</p>
                  {patients.length === 0 && (
                    <p className="text-red-600 mt-1">
                      No available breastfeeding patients. Please register a patient with type "breastfeeding" first.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Date *
          </label>
          <input
            type="date"
            name="delivery_date"
            value={formData.delivery_date}
            onChange={handleDeliveryDateChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {calculating && (
            <p className="mt-1 text-sm text-blue-600">Calculating baby age...</p>
          )}
        </div>

        {/* Baby Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baby Age (Months) *
          </label>
          <input
            type="number"
            name="baby_age_months"
            value={formData.baby_age_months}
            onChange={handleChange}
            min="0"
            max="24"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Age in months (0-24 months)
          </p>
        </div>

        {/* Baby Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baby Name
          </label>
          <input
            type="text"
            name="baby_name"
            value={formData.baby_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter baby's name (optional)"
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

export default BreastfeedingWomanForm;