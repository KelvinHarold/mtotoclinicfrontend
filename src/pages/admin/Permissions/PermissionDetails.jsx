// pages/admin/Permissions/PermissionDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../../api/axios';

const PermissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermission();
  }, [id]);

  const fetchPermission = async () => {
    try {
      const response = await axios.get(`/admin/permissions/${id}`);
      if (response.data.success) {
        setPermission(response.data.data.permission);
      }
    } catch (err) {
      alert('Failed to fetch permission details');
      navigate('/admin/permissions');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionTypeColor = (permissionName) => {
    if (permissionName.includes('create')) return 'bg-green-100 text-green-800';
    if (permissionName.includes('read')) return 'bg-blue-100 text-blue-800';
    if (permissionName.includes('update')) return 'bg-yellow-100 text-yellow-800';
    if (permissionName.includes('delete')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPermissionType = (permissionName) => {
    if (permissionName.includes('create')) return 'Create';
    if (permissionName.includes('read')) return 'Read';
    if (permissionName.includes('update')) return 'Update';
    if (permissionName.includes('delete')) return 'Delete';
    return 'General';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading permission details...</div>
      </div>
    );
  }

  if (!permission) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Permission not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Permission Details</h1>
          <p className="text-gray-600 mt-2">View detailed information about the permission</p>
        </div>
        <div className="space-x-3">
          <Link
            to="/admin/permissions"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to List
          </Link>
          <Link
            to={`/admin/permissions/edit/${permission.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Edit Permission
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
              {getPermissionType(permission.name).charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-mono">{permission.name}</h2>
              <p className="text-purple-100">Guard: {permission.guard_name}</p>
              <p className="text-purple-100 text-sm mt-1">
                Created: {new Date(permission.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Permission Name</dt>
                  <dd className="text-sm text-gray-900 font-mono">{permission.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Guard Name</dt>
                  <dd className="text-sm text-gray-900">{permission.guard_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Permission Type</dt>
                  <dd className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPermissionTypeColor(permission.name)}`}>
                      {getPermissionType(permission.name)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">System Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(permission.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(permission.updated_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Permission ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{permission.id}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Permission Analysis */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Permission Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Resource</div>
                <div className="text-lg font-bold text-gray-900">
                  {permission.name.split('.')[0] || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Action</div>
                <div className="text-lg font-bold text-gray-900 capitalize">
                  {permission.name.split('.')[1] || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Security Level</div>
                <div className="text-lg font-bold text-gray-900">
                  {permission.name.includes('delete') ? 'High' : 
                   permission.name.includes('create') || permission.name.includes('update') ? 'Medium' : 'Low'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionDetails;