import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data;
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setRevenue(user.revenue_percentage);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage("❌ Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/users/${id}`,
        { name, email, role, revenue_percentage: revenue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ User updated successfully!");
      setTimeout(() => navigate("/users"), 1000);
    } catch (err) {
      console.error("Error updating user:", err);
      setMessage("❌ Failed to update user");
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
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaUserEdit /> Edit User
        </h1>

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

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Role</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Msimamizi">Msimamizi</option>
              <option value="Msaidizi">Msaidizi</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Revenue %</label>
            <input
              type="number"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              min={0}
              max={100}
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 justify-center w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
          >
            <FaUserEdit /> Update User
          </button>
        </form>
      </div>
    </Layout>
  );
}
