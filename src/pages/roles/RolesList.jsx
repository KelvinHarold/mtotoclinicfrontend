import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaKey } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(res.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setMessage("❌ Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(roles.filter((r) => r.id !== id));
      setMessage("✅ Role deleted successfully!");
    } catch (err) {
      console.error("Error deleting role:", err);
      setMessage("❌ Failed to delete role");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <BeatLoader color="#2563eb" size={15} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Roles
          </h1>
          <Link
            to="/roles/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Role
          </Link>
        </div>

        {/* Feedback */}
        {message && (
          <p
            className={`mb-4 px-4 py-2 rounded ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        {/* Roles Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-200">
  {roles.length > 0 ? (
    roles.map((role, index) => (
      <tr
        key={role.id ?? `role-${index}`} // key salama kila wakati
        className="hover:bg-gray-50 transition-colors duration-200 text-center"
      >
        <td className="px-4 py-3 text-left">{index + 1}</td>
        <td className="px-4 py-3 text-left">{role.name}</td>
        <td className="px-4 py-3 space-x-2 flex justify-center">
          <Link
            to={`/roles/edit/${role.id}`}
            className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
          >
            <FaEdit /> Edit
          </Link>
          <Link
            to={`/roles/${role.id}/permissions`}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            <FaKey /> Assign Permissions
          </Link>
          <button
            onClick={() => handleDelete(role.id)}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            <FaTrash /> Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr key="no-roles">
      <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
        No roles found.
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
