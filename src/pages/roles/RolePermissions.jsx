
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function RolePermissions() {
  const { id } = useParams();
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // fetch all permissions
    const fetchPermissions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/permissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermissions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    // fetch role's permissions
    const fetchRolePermissions = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/roles/${id}/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRolePermissions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPermissions();
    fetchRolePermissions();
  }, [id, token]);

  const handleToggle = (permissionName) => {
    setRolePermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/roles/${id}/permissions`,
        { permissions: rolePermissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Permissions updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update permissions");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold">Assign Permissions</h1>
        {message && <p className="p-2 rounded bg-green-100 text-green-700">{message}</p>}

        <div className="space-y-2">
          {permissions.map((perm) => (
            <div key={perm.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rolePermissions.includes(perm.name)}
                onChange={() => handleToggle(perm.name)}
                className="w-5 h-5"
              />
              <label>{perm.name}</label>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Permissions
        </button>
      </div>
    </Layout>
  );
}
