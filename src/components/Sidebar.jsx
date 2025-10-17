import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaKey,
  FaUpload,
  FaFolderOpen,
  FaTimes,
} from "react-icons/fa";

const allLinks = [
  { name: "Dashboard", href: "/home", icon: <FaTachometerAlt />, permission: "view dashboard" },
  { name: "Users", href: "/users", icon: <FaUsers />, permission: "view users" },
  { name: "Roles", href: "/roles", icon: <FaUserShield />, permission: "view roles" },
  { name: "Permissions", href: "/permissions", icon: <FaKey />, permission: "view permissions" },
  { name: "Uploads", href: "/uploads", icon: <FaUpload />, permission: "view uploads" },
  { name: "Records", href: "/records", icon: <FaFolderOpen />, permission: "view records" },
];

export default function Sidebar({ isOpen, onClose }) {
  const [user, setUser] = useState({ name: "", role: "", permissions: [] });
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role === "Admin") {
        parsedUser.permissions = allLinks.map((l) => l.permission);
      }

      setUser(parsedUser);
    }
  }, []);

  const filteredLinks = allLinks.filter((link) =>
    user.permissions?.includes(link.permission)
  );

  return (
    <>
      {/* Sidebar */}
      <aside
  className={`fixed left-0 w-64 bg-gradient-to-b from-blue-700 to-blue-900 h-[calc(100vh-64px)] p-6 shadow-lg z-50 transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    top-24 md:top-0 md:translate-x-0 md:static`}
>


        {/* Logo Section */}
        <div className="mb-10 text-center text-white mt-6 md:mt-0">
          <h1 className="text-2xl font-bold tracking-wide">SANTIAGO</h1>
          <p className="text-blue-200 text-sm mt-1">Management System</p>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-4">
            {filteredLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-blue-100 hover:bg-blue-600 hover:text-white"
                    }`}
                    onClick={onClose} // close sidebar when link clicked on mobile
                  >
                    <span
                      className={`text-lg transition-colors duration-200 ${
                        isActive ? "text-white" : "text-blue-200 group-hover:text-white"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
