import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

export default function PermissionsEdit() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/permissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
      } catch (err) {
        console.error("Error fetching permission:", err);
        setMessage("❌ Failed to fetch permission data");
      } finally {
        setLoading(false);
      }
    };
    fetchPermission();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/permissions/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Permission updated successfully!");
      setTimeout(() => navigate("/permissions"), 1000);
    } catch (err) {
      console.error("Error updating permission:", err);
      setMessage("❌ Failed to update permission");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-gray-500">
          Loading permission...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FaEdit /> Edit Permission
        </h1>

        {message && (
          <p className={`mb-4 px-4 py-2 rounded ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Permission Name</label>
            <input
              type="text"
              placeholder="Enter permission name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button type="submit" className="flex items-center gap-2 justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
            <FaEdit /> Update Permission
          </button>
        </form>
      </div>
    </Layout>
  );
}
