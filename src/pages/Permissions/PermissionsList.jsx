import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function PermissionsList() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/permissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermissions(res.data);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setMessage("❌ Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this permission?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/permissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(permissions.filter((p) => p.id !== id));
      setMessage("✅ Permission deleted successfully!");
    } catch (err) {
      console.error("Error deleting permission:", err);
      setMessage("❌ Failed to delete permission");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-gray-500">
          Loading permissions...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">Permissions</h1>
          <Link
            to="/permissions/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Permission
          </Link>
        </div>

        {message && (
          <p className={`mb-4 px-4 py-2 rounded ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </p>
        )}

        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {permissions.map((perm, index) => (
                <tr key={perm.id} className="hover:bg-gray-50 transition-colors duration-200 text-center">
                  <td className="px-4 py-3 text-left">{index + 1}</td>
                  <td className="px-4 py-3 text-left">{perm.name}</td>
                  <td className="px-4 py-3 space-x-2 flex justify-center">
                    <Link
                      to={`/permissions/edit/${perm.id}`}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(perm.id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {permissions.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                    No permissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
