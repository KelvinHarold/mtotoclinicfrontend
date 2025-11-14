// pages/admin/Permissions/CreatePermission.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const CreatePermission = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web'
  });

  const commonPermissions = [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'roles.create', 'roles.read', 'roles.update', 'roles.delete',
    'permissions.create', 'permissions.read', 'permissions.update', 'permissions.delete',
    'settings.read', 'settings.update',
    'reports.generate', 'reports.view',
    'audit-logs.read'
  ];

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

  const handleSelectCommonPermission = (permission) => {
    setFormData({
      ...formData,
      name: permission
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/admin/permissions', formData);
      
      if (response.data.success) {
        alert('Permission created successfully!');
        navigate('/admin/permissions');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Failed to create permission');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Permission</h1>
        <p className="text-gray-600 mt-2">Add a new permission to the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Select Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Common Permissions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Click on a common permission to quickly select it.
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {commonPermissions.map((permission) => (
                <button
                  key={permission}
                  type="button"
                  onClick={() => handleSelectCommonPermission(permission)}
                  className={`w-full text-left p-3 rounded border text-sm transition-colors ${
                    formData.name === permission
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {permission}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
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
                  placeholder="e.g., users.create, reports.view"
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
              {formData.name && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permission Preview</h4>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formData.guard_name}
                    </span>
                    <span className="text-sm text-gray-900 font-mono">{formData.name}</span>
                  </div>
                </div>
              )}

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
                  {loading ? 'Creating...' : 'Create Permission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePermission;