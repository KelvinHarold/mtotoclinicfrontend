import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaExchangeAlt } from 'react-icons/fa';
import api from '../../api/axios';

const VisitRoutingIndex = () => {
  const navigate = useNavigate();
  const [routings, setRoutings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, routingId: null });

  useEffect(() => {
    fetchRoutings();
  }, []);

  const fetchRoutings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/visit-routings');
      if (response.data.success) {
        setRoutings(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch visit routings');
      console.error('Error fetching routings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (routingId) => {
    try {
      await api.delete(`/visit-routings/${routingId}`);
      setRoutings(routings.filter(routing => routing.id !== routingId));
      setDeleteDialog({ open: false, routingId: null });
    } catch (err) {
      setError('Failed to delete visit routing');
      console.error('Error deleting routing:', err);
    }
  };

  const openDeleteDialog = (routingId) => {
    setDeleteDialog({ open: true, routingId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, routingId: null });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          <FaExchangeAlt className="inline mr-2 mb-1" />
          Visit Routings
        </h1>
        <Link
          to="/visit-routings/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaPlus className="mr-2" />
          New Routing
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Routed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routings.map((routing) => (
                <tr key={routing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{routing.patient_visit_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                      {routing.from_department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                      {routing.to_department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {routing.routed_by?.name || `User #${routing.routed_by}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(routing.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/visit-routings/${routing.id}`}
                        className="text-blue-600 hover:text-blue-900 transition duration-200"
                      >
                        <FaEye className="inline" />
                      </Link>
                      <Link
                        to={`/visit-routings/${routing.id}/edit`}
                        className="text-green-600 hover:text-green-900 transition duration-200"
                      >
                        <FaEdit className="inline" />
                      </Link>
                      <button
                        onClick={() => openDeleteDialog(routing.id)}
                        className="text-red-600 hover:text-red-900 transition duration-200"
                      >
                        <FaTrash className="inline" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {routings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-4">No visit routings found</p>
            <Link
              to="/visit-routings/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition duration-200"
            >
              <FaPlus className="mr-2" />
              Create First Routing
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this visit routing? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteDialog.routingId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitRoutingIndex;