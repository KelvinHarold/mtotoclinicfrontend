import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../api/axios';
import ChildForm from './components/ChildForm';

const EditChild = () => {
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
      const response = await axios.get(`/children/${id}`);
      setRecord(response.data.data);
    } catch (error) {
      console.error('Error fetching child record:', error);
      alert('Failed to fetch child details');
      navigate('/patients/children');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await axios.put(`/patients/children/${id}`, formData);
      alert('Child record updated successfully!');
      navigate('/patients/children');
    } catch (error) {
      console.error('Error updating child record:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update child record';
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
          <p className="mt-2 text-gray-600">Loading child details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow border p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Child Record</h1>
          <ChildForm record={record} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default EditChild;