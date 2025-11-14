// pages/admin/Roles/RoleDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../../api/axios';

const RoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRole();
  }, [id]);

  const fetchRole = async () => {
    try {
      const response = await axios.get(`/admin/roles/${id}`);
      if (response.data.success) {
        setRole(response.data.data.role);
      }
    } catch (err) {
      alert('Failed to fetch role details');
      navigate('/admin/roles');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionBadgeColor = (index) => {
    const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-yellow-100 text-yellow-800'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading role details...</div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Role not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Role Details</h1>
          <p className="text-gray-600 mt-2">View detailed information about the role</p>
        </div>
        <div className="space-x-3">
          <Link
            to="/admin/roles"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to List
          </Link>
          <Link
            to={`/admin/roles/edit/${role.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Edit Role
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
              {role.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{role.name}</h2>
              <p className="text-blue-100">Guard: {role.guard_name}</p>
              <p className="text-blue-100 text-sm mt-1">
                Created: {new Date(role.created_at).toLocaleDateString()}
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
                  <dt className="text-sm font-medium text-gray-500">Role Name</dt>
                  <dd className="text-sm text-gray-900">{role.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Guard Name</dt>
                  <dd className="text-sm text-gray-900">{role.guard_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(role.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(role.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Permissions ({role.permissions?.length || 0})
              </h3>
              {role.permissions && role.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, index) => (
                    <span
                      key={permission.id}
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getPermissionBadgeColor(index)}`}
                    >
                      {permission.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No permissions assigned to this role.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetails;