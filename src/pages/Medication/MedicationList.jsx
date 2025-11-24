import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const MedicationList = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    patient_id: '',
    visit_id: '',
    doctor_id: ''
  });

  useEffect(() => {
    fetchMedications();
  }, [filters]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.patient_id) params.append('patient_id', filters.patient_id);
      if (filters.visit_id) params.append('visit_id', filters.visit_id);
      if (filters.doctor_id) params.append('doctor_id', filters.doctor_id);

      const response = await axiosInstance.get(`/medications?${params}`);
      console.log('API Response:', response.data); // Debug log
      
      // Check the structure of the first medication
      if (response.data.data && response.data.data.length > 0) {
        console.log('First medication patient data:', response.data.data[0].patient);
        console.log('All patient data keys:', response.data.data[0].patient ? Object.keys(response.data.data[0].patient) : 'No patient data');
      }
      
      setMedications(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch medications');
      console.error('Error fetching medications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get patient name
  const getPatientName = (medication) => {
    console.log('Patient data for medication:', medication.id, medication.patient); // Debug
    
    if (!medication.patient) {
      return `Patient #${medication.patient_id}`;
    }
    
    // Try different possible name field structures
    if (medication.patient.first_name && medication.patient.last_name) {
      return `${medication.patient.first_name} ${medication.patient.last_name}`;
    }
    
    if (medication.patient.name) {
      return medication.patient.name;
    }
    
    if (medication.patient.full_name) {
      return medication.patient.full_name;
    }
    
    // If we have patient data but no clear name field
    return `Patient #${medication.patient_id}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await axiosInstance.delete(`/medications/${id}`);
        setMedications(medications.filter(med => med.id !== id));
      } catch (err) {
        setError('Failed to delete medication');
        console.error('Error deleting medication:', err);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      patient_id: '',
      visit_id: '',
      doctor_id: ''
    });
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading medications...</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medications</h1>
        <Link
          to="/medications/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Medication
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="patient_id"
            placeholder="Patient ID"
            value={filters.patient_id}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="visit_id"
            placeholder="Visit ID"
            value={filters.visit_id}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="doctor_id"
            placeholder="Doctor ID"
            value={filters.doctor_id}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medicine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medications.map((medication) => (
              <tr key={medication.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {medication.medicine_name}
                  </div>
                  {medication.instructions && (
                    <div className="text-xs text-gray-500 mt-1">
                      Instructions: {medication.instructions}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{medication.dosage}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{medication.frequency}</div>
                  <div className="text-xs text-gray-500">{medication.duration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getPatientName(medication)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {medication.patient_id}
                    {medication.visit_id && ` • Visit: ${medication.visit_id}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/medications/${medication.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </Link>
                  <Link
                    to={`/medications/${medication.id}/edit`}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(medication.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {medications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No medications found
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationList;