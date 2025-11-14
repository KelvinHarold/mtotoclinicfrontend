// pages/admin/Permissions/EditPermission.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../api/axios';

const EditPermission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web'
  });

  useEffect(() => {
    fetchPermission();
  }, [id]);

  const fetchPermission = async () => {
    try {
      const response = await axios.get(`/admin/permissions/${id}`);
      if (response.data.success) {
        const permission = response.data.data.permission;
        setFormData({
          name: permission.name,
          guard_name: permission.guard_name
        });
      }
    } catch (err) {
      alert('Failed to fetch permission details');
      navigate('/admin/permissions');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.put(`/admin/permissions/${id}`, formData);
      
      if (response.data.success) {
        alert('Permission updated successfully!');
        navigate('/admin/permissions');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Failed to update permission');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading permission details...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Permission</h1>
        <p className="text-gray-600 mt-2">Update permission information</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Permission Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Use dot notation: resource.action (e.g., users.read, settings.update)
            </p>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Guard Name
            </label>
            <select
              name="guard_name"
              value={formData.guard_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="web">Web</option>
              <option value="api">API</option>
            </select>
            {errors.guard_name && <p className="text-red-500 text-xs mt-1">{errors.guard_name}</p>}
          </div>

          {/* Permission Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Permission Preview</h4>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {formData.guard_name}
              </span>
              <span className="text-sm text-gray-900 font-mono">{formData.name}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/permissions')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Permission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPermission;