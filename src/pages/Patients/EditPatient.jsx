import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import PatientForm from './components/PatientForm';

const EditPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await axios.get(`/patients/${id}`);
      setPatient(response.data.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      alert('Failed to fetch patient details');
      navigate('/patients');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await axios.put(`/patients/${id}`, formData);
      alert('Patient updated successfully!');
      navigate('/patients');
    } catch (error) {
      console.error('Error updating patient:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update patient';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow border p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Patient</h1>
          <PatientForm patient={patient} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default EditPatient;