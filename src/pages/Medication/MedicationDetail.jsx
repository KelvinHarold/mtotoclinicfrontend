import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const MedicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedication();
  }, [id]);

  const fetchMedication = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/medications/${id}`);
      setMedication(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch medication details');
      console.error('Error fetching medication:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await axiosInstance.delete(`/medications/${id}`);
        navigate('/medications');
      } catch (err) {
        setError('Failed to delete medication');
        console.error('Error deleting medication:', err);
      }
    }
  };

  if (loading) return <div className="text-center">Loading medication details...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!medication) return <div className="text-center">Medication not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medication Details</h1>
        <div className="space-x-3">
          <Link
            to="/medications"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back to List
          </Link>
          <Link
            to={`/medications/${id}/edit`}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Edit Medication
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {medication.medicine_name}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Medication Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Medicine Name</label>
                  <p className="mt-1 text-sm text-gray-900">{medication.medicine_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Dosage</label>
                  <p className="mt-1 text-sm text-gray-900">{medication.dosage}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Frequency</label>
                  <p className="mt-1 text-sm text-gray-900">{medication.frequency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Duration</label>
                  <p className="mt-1 text-sm text-gray-900">{medication.duration}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Related Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Patient</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {medication.patient?.name || `Patient #${medication.patient_id}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Visit</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {medication.visit ? `Visit #${medication.visit_id}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Doctor</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {medication.doctor?.name || `Doctor #${medication.doctor_id}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(medication.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {medication.instructions && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-500">Instructions</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                {medication.instructions}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;