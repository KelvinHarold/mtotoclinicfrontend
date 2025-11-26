import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const RelativesList = () => {
  const [relatives, setRelatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRelatives();
  }, []);

  const fetchRelatives = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/relatives');
      if (response.data.success) {
        setRelatives(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch relatives');
      console.error('Error fetching relatives:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRelative = async (id) => {
    if (window.confirm('Are you sure you want to delete this relative?')) {
      try {
        await axiosInstance.delete(`/relatives/${id}`);
        setRelatives(relatives.filter(relative => relative.id !== id));
      } catch (err) {
        setError('Failed to delete relative');
        console.error('Error deleting relative:', err);
      }
    }
  };

  if (loading) return <div className="text-center">Loading relatives...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Relatives List</h1>
        <Link
          to="/relatives/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Relative
        </Link>
      </div>

      {relatives.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No relatives found. <Link to="/relatives/create" className="text-blue-500 hover:underline">Add the first one</Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
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
              {relatives.map((relative) => (
                <tr key={relative.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {relative.first_name} {relative.second_name} {relative.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{relative.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {relative.relationship}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {relative.patient?.first_name} {relative.patient?.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/relatives/${relative.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/relatives/${relative.id}/edit`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteRelative(relative.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RelativesList;