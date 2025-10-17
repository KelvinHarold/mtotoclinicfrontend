import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

export default function UserCreate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(res.data);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };
    fetchRoles();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/users",
        {
          name,
          email,
          password,
          role,
          revenue_percentage: revenue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ User created successfully!");
      setTimeout(() => navigate("/users"), 1000);
    } catch (err) {
      console.error("Error creating user:", err);
      setMessage("❌ Failed to create user");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaUserPlus /> Add New User
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
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {roles.map((r, index) => (
                <option key={index} value={r.name}>
                  {r.name}
                </option>
              ))}
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
            className="flex items-center gap-2 justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <FaUserPlus /> Create User
          </button>
        </form>
      </div>
    </Layout>
  );
}
