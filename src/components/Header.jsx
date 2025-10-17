import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function Header({ onToggleSidebar }) {
  const [user, setUser] = useState({ name: "", role: "" });
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      setLoggingOut(true);
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between z-50">
      {/* Left: Logo + Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-10 h-10 object-cover rounded-full border-2 border-blue-500"
        />

        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-blue-600">Santiago</span>{" "}
          <span className="text-gray-900">Bernabeu</span>
        </h1>
      </div>

      {/* Right: User Info Block as Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-3 bg-transparent px-3 py-2 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-red-300 cursor-pointer"
      >
        {loggingOut ? (
          <div className="flex items-center gap-2">
            <BeatLoader size={8} color="#ef4444" />
            <span className="text-red-500 text-sm font-medium">Logging out...</span>
          </div>
        ) : (
          <>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || "User"
              )}&background=38bdf8&color=fff&size=64`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-blue-200"
            />
            <div className="text-right">
              <p className="text-gray-900 font-semibold text-sm">{user.name || "User"}</p>
              <p className="text-xs text-gray-500">{user.role || "Role"}</p>
            </div>
          </>
        )}
      </button>
    </header>
  );
}
