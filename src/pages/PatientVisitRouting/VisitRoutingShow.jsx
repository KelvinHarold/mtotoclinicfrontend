import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaEdit, FaArrowLeft, FaUser, FaCalendar, FaStickyNote } from 'react-icons/fa';
import api from '../../api/axios';

const VisitRoutingShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routing, setRouting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRouting();
  }, [id]);

  const fetchRouting = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/visit-routings/${id}`);
      if (response.data.success) {
        setRouting(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch visit routing details');
      console.error('Error fetching routing:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/visit-routings')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to List
        </button>
      </div>
    );
  }

  if (!routing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Visit routing not found.
        </div>
        <button
          onClick={() => navigate('/visit-routings')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          <FaExchangeAlt className="inline mr-2 mb-1" />
          Visit Routing Details
        </h1>
        <Link
          to={`/visit-routings/${id}/edit`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaEdit className="mr-2" />
          Edit Routing
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Routing Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  From Department
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                  {routing.from_department}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  To Department
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                  {routing.to_department}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Patient Visit ID
                </label>
                <p className="text-lg font-semibold text-gray-900">#{routing.patient_visit_id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Routed By
                </label>
                <div className="flex items-center text-gray-900">
                  <FaUser className="mr-2 text-gray-400" />
                  {routing.routed_by?.name || `User #${routing.routed_by}`}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created Date
                </label>
                <div className="flex items-center text-gray-900">
                  <FaCalendar className="mr-2 text-gray-400" />
                  {new Date(routing.created_at).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Last Updated
                </label>
                <div className="flex items-center text-gray-900">
                  <FaCalendar className="mr-2 text-gray-400" />
                  {new Date(routing.updated_at).toLocaleString()}
                </div>
              </div>
            </div>

            {routing.routing_notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
                  <FaStickyNote className="mr-2" />
                  Routing Notes
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{routing.routing_notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/visit-routings')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center justify-center transition duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to List
              </button>
              <Link
                to={`/visit-routings/${id}/edit`}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center transition duration-200"
              >
                <FaEdit className="mr-2" />
                Edit Routing
              </Link>
              <Link
                to={`/patient-visits/${routing.patient_visit_id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center transition duration-200"
              >
                View Patient Visit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitRoutingShow;