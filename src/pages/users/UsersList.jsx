import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaUser } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setMessage("❌ Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
      setMessage("✅ User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      setMessage("❌ Failed to delete user");
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
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaUser /> Users
          </h1>
          <button
            onClick={() => navigate("/users/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <FaPlus /> Add User
          </button>
        </div>

        {/* Message */}
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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Revenue %</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-700 font-semibold">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {user.revenue_percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 py-6"
                  >
                    No users found.
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
