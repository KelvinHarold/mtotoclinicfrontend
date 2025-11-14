// pages/admin/Permissions/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';

const PermissionsList = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/permissions');
      if (response.data.success) {
        setPermissions(response.data.data.permissions);
      }
    } catch (err) {
      setError('Failed to fetch permissions');
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (permissionId) => {
    navigate(`/admin/permissions/edit/${permissionId}`);
  };

  const handleView = (permissionId) => {
    navigate(`/admin/permissions/${permissionId}`);
  };

  const handleDelete = async (permissionId) => {
    if (!window.confirm('Are you sure you want to delete this permission?')) {
      return;
    }

    try {
      await axios.delete(`/admin/permissions/${permissionId}`);
      setPermissions(permissions.filter(permission => permission.id !== permissionId));
      alert('Permission deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete permission');
      console.error('Error deleting permission:', err);
    }
  };

  const getPermissionTypeColor = (permissionName) => {
    if (permissionName.includes('create')) return 'bg-green-100 text-green-800';
    if (permissionName.includes('read')) return 'bg-blue-100 text-blue-800';
    if (permissionName.includes('update')) return 'bg-yellow-100 text-yellow-800';
    if (permissionName.includes('delete')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading permissions...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Permission Management</h1>
        <button
          onClick={() => navigate('/admin/permissions/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Permission
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {permissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No permissions found.</p>
            <button
              onClick={() => navigate('/admin/permissions/create')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create First Permission
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guard Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{permission.guard_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPermissionTypeColor(permission.name)}`}>
                        {permission.name.split('.')[1] || 'general'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(permission.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(permission.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(permission.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(permission.id)}
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

      {/* Statistics Card */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Total Permissions</div>
          <div className="text-2xl font-bold text-gray-900">{permissions.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Create Permissions</div>
          <div className="text-2xl font-bold text-green-600">
            {permissions.filter(p => p.name.includes('create')).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Read Permissions</div>
          <div className="text-2xl font-bold text-blue-600">
            {permissions.filter(p => p.name.includes('read')).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Web Guard</div>
          <div className="text-2xl font-bold text-purple-600">
            {permissions.filter(p => p.guard_name === 'web').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsList;