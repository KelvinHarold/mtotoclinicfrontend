import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import PregnantWomanForm from './components/PregnantWomanForm';

const EditPregnantWoman = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const response = await axios.get(`/pregnant-women/${id}`);
      setRecord(response.data.data);
    } catch (error) {
      console.error('Error fetching record:', error);
      alert('Failed to fetch record details');
      navigate('/patients/pregnant-women');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await axios.put(`/pregnant-women/${id}`, formData);
      alert('Record updated successfully!');
      navigate('/patients/pregnant-women');
    } catch (error) {
      console.error('Error updating record:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update record';
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
          <p className="mt-2 text-gray-600">Loading record details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow border p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Pregnant Woman Record</h1>
          <PregnantWomanForm record={record} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default EditPregnantWoman;