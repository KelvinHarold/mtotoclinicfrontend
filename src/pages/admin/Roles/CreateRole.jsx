// pages/admin/Roles/CreateRole.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const CreateRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingPermissions, setFetchingPermissions] = useState(true);
  const [errors, setErrors] = useState({});
  const [permissions, setPermissions] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web',
    permissions: []
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/admin/roles/permissions');
      if (response.data.success) {
        setPermissions(response.data.data.permissions);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
      alert('Failed to load permissions');
    } finally {
      setFetchingPermissions(false);
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

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    let updatedPermissions = [...formData.permissions];
    
    if (checked) {
      updatedPermissions.push(value);
    } else {
      updatedPermissions = updatedPermissions.filter(perm => perm !== value);
    }
    
    setFormData({
      ...formData,
      permissions: updatedPermissions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('/admin/roles', formData);
      
      if (response.data.success) {
        alert('Role created successfully!');
        navigate('/admin/roles');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Failed to create role');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Role</h1>
        <p className="text-gray-600 mt-2">Add a new role to the system</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., editor, moderator"
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Guard Name</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions {fetchingPermissions && '(Loading...)'}
            </label>
            {fetchingPermissions ? (
              <div className="text-gray-500">Loading permissions...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      value={permission.name}
                      checked={formData.permissions.includes(permission.name)}
                      onChange={handlePermissionChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`permission-${permission.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {permission.name}
                    </label>
                  </div>
                ))}
                {permissions.length === 0 && (
                  <div className="text-gray-500 col-span-full">No permissions available</div>
                )}
              </div>
            )}
            {errors.permissions && <p className="text-red-500 text-xs mt-1">{errors.permissions}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/roles')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetchingPermissions}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;