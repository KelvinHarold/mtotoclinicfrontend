import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const RelativeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [relative, setRelative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRelative();
  }, [id]);

  const fetchRelative = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/relatives/${id}`);
      if (response.data.success) {
        setRelative(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch relative details');
      console.error('Error fetching relative:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRelative = async () => {
    if (window.confirm('Are you sure you want to delete this relative?')) {
      try {
        await axiosInstance.delete(`/relatives/${id}`);
        navigate('/relatives');
      } catch (err) {
        setError('Failed to delete relative');
        console.error('Error deleting relative:', err);
      }
    }
  };

  if (loading) return <div className="text-center">Loading relative details...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!relative) return <div className="text-center">Relative not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Relative Details</h1>
        <div className="space-x-2">
          <Link
            to="/relatives"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back to List
          </Link>
          <Link
            to={`/relatives/${id}/edit`}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </Link>
          <button
            onClick={deleteRelative}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-lg text-gray-900">
                {relative.first_name} {relative.second_name} {relative.last_name}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-lg text-gray-900">{relative.phone_number}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Relationship</h3>
              <p className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {relative.relationship}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient</h3>
              <p className="mt-1 text-lg text-gray-900">
                {relative.patient ? (
                  <Link 
                    to={`/patients/${relative.patient.id}`}
                    className="text-blue-600 hover:text-blue-900 hover:underline"
                  >
                    {relative.patient.first_name} {relative.patient.last_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(relative.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(relative.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelativeDetails;