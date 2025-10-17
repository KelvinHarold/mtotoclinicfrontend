import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

export default function RoleEdit() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/roles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
      } catch (err) {
        console.error("Error fetching role:", err);
        setMessage("❌ Failed to fetch role data");
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/roles/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Role updated successfully!");
      setTimeout(() => navigate("/roles"), 1000);
    } catch (err) {
      console.error("Error updating role:", err);
      setMessage("❌ Failed to update role");
    }
  };

  // Loader while fetching role
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
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaEdit /> Edit Role
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              placeholder="Enter role name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <FaEdit /> Update Role
          </button>
        </form>
      </div>
    </Layout>
  );
}
