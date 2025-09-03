"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UpdateUserRole() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch all users (Super Admin only)
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT from login
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/update/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId, newRole, currentRole) => {
    const confirmChange = window.confirm(
      `Are you sure you want to change this user's role from ${currentRole} to ${newRole}?`
    );

    if (!confirmChange) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      // Add token validation
      if (!token) {
        setMessage("Authentication token not found. Please log in again.");
        // Redirect to login or handle accordingly
        return;
      }

      console.log("Token exists:", !!token); // Debug log

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/update/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "Role updated successfully ✅");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Full error:", err); // More detailed error logging

      // if (err.response?.status === 401) {
      //   setMessage("Authentication failed. Please log in again.");
      //   // Clear invalid token
      //   localStorage.removeItem("token");
      //   // Redirect to login
      // } else {
      //   setMessage("Failed to update role ❌");
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔑 Manage User Roles</h1>

      {message && (
        <div className="alert alert-info mb-4">
          <span>{message}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Update Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-neutral">{user.role}</span>
                </td>
                <td>
                  <select
                    className="select select-bordered"
                    value={user.role}
                    onChange={(e) =>
                      handleRoleUpdate(user.id, e.target.value, user.role)
                    }
                    disabled={loading}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OBSERVER">Observer</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
