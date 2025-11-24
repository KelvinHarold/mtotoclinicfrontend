import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaExchangeAlt, FaSave, FaTimes, FaArrowLeft, FaSync } from 'react-icons/fa';
import api from '../../api/axios';

const VisitRoutingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    patient_visit_id: '',
    from_department: '',
    to_department: '',
    routing_notes: '',
    routed_by: ''
  });

  useEffect(() => {
    fetchRoutingAndData();
  }, [id]);

  const fetchRoutingAndData = async () => {
    try {
      setFetchLoading(true);
      
      // Fetch routing data
      const routingResponse = await api.get(`/visit-routings/${id}`);
      if (routingResponse.data.success) {
        const routing = routingResponse.data.data;
        setFormData({
          patient_visit_id: routing.patient_visit_id,
          from_department: routing.from_department,
          to_department: routing.to_department,
          routing_notes: routing.routing_notes || '',
          routed_by: routing.routed_by
        });
      }

      // Fetch dropdown data (dummy data for example)
      setDepartments(['Reception', 'Laboratory', 'Pharmacy', 'Radiology', 'Consultation']);
      setUsers([{ id: 1, name: 'Dr. John Doe' }, { id: 2, name: 'Nurse Jane Smith' }]);

    } catch (err) {
      setError('Failed to fetch visit routing data');
      console.error('Error fetching data:', err);
    } finally {
      setFetchLoading(false);
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
      const response = await api.put(`/visit-routings/${id}`, formData);
      
      if (response.data.success) {
        setSuccess('Visit routing updated successfully!');
        setTimeout(() => {
          navigate(`/visit-routings/${id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update visit routing');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link
          to={`/visit-routings/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          <FaExchangeAlt className="inline mr-2 mb-1" />
          Edit Visit Routing
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Visit ID *
              </label>
              <input
                type="number"
                name="patient_visit_id"
                value={formData.patient_visit_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                required
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Patient Visit ID cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routed By *
              </label>
              <select
                name="routed_by"
                value={formData.routed_by}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Department *
              </label>
              <select
                name="from_department"
                value={formData.from_department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Department *
              </label>
              <select
                name="to_department"
                value={formData.to_department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Routing Notes
            </label>
            <textarea
              name="routing_notes"
              value={formData.routing_notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any notes or instructions for this routing..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to={`/visit-routings/${id}`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSync className="mr-2" />
                  Update Routing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitRoutingEdit;