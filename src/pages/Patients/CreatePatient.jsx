import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import PatientForm from './components/PatientForm';

const CreatePatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await axios.post('/patients', formData);
      alert('Patient created successfully!');
      navigate('/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create patient';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow border p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Patient</h1>
          <PatientForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;