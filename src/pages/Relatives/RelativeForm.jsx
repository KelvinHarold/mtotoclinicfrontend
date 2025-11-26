import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const RelativeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    patient_id: searchParams.get('patientId') || '',
    first_name: '',
    second_name: '',
    last_name: '',
    phone_number: '',
    relationship: ''
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPatients();
    if (isEdit) {
      fetchRelative();
    }
  }, [isEdit, id]);

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      const response = await axiosInstance.get('/patients');
      
      // Use the same structure as your existing code
      const patientsData = response.data.data?.data || response.data.data || [];
      
      console.log('Patients data:', patientsData); // For debugging
      setPatients(patientsData);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients list');
      setPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchRelative = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/relatives/${id}`);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch relative details');
      console.error('Error fetching relative:', err);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEdit) {
        await axiosInstance.put(`/relatives/${id}`, formData);
        setSuccess('Relative updated successfully!');
      } else {
        await axiosInstance.post('/relatives', formData);
        setSuccess('Relative created successfully!');
      }
      
      setTimeout(() => {
        navigate('/relatives');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to save relative';
      setError(errorMessage);
      console.error('Error saving relative:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="text-center py-8">Loading relative details...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Relative' : 'Add New Relative'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patient_id">
            Patient *
          </label>
          <select
            id="patient_id"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            disabled={patientsLoading}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100"
          >
            <option value="">Select Patient</option>
            {patientsLoading ? (
              <option disabled>Loading patients...</option>
            ) : (
              Array.isArray(patients) && patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                  {patient.date_of_birth && ` (${new Date(patient.date_of_birth).getFullYear()})`}
                </option>
              ))
            )}
          </select>
          {!patientsLoading && (!Array.isArray(patients) || patients.length === 0) && (
            <p className="text-red-500 text-xs mt-1">No patients available. Please add patients first.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="second_name">
              Second Name
            </label>
            <input
              type="text"
              id="second_name"
              name="second_name"
              value={formData.second_name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            placeholder="255712345678"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="relationship">
            Relationship *
          </label>
          <select
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Husband">Husband</option>
            <option value="Wife">Wife</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Relative' : 'Create Relative')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/relatives')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RelativeForm;