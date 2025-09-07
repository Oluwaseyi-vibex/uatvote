"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function UpdateUserRole() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    // Fetch all users (Super Admin only)
    const fetchUsers = async () => {
      setLoading(true);
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
        setMessageType("error");
      } finally {
        setLoading(false);
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
        setMessageType("error");
        return;
      }

      console.log("Token exists:", !!token); // Debug log

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/update/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "Role updated successfully!");
      setMessageType("success");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      console.error("Full error:", err);
      setMessage("Failed to update role. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      STUDENT: "bg-blue-100 text-blue-800 border-blue-200",
      ADMIN: "bg-green-100 text-green-800 border-green-200",
      OBSERVER: "bg-purple-100 text-purple-800 border-purple-200",
      SUPER_ADMIN: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRoleIcon = (role) => {
    const icons = {
      STUDENT: "🎓",
      ADMIN: "👨‍💼",
      OBSERVER: "👀",
      SUPER_ADMIN: "⚡",
    };
    return icons[role] || "👤";
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🔑 User Role Management
              </h1>
              <p className="text-gray-600">
                Manage user permissions and access levels across the system
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/superAdmin/audit-log"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Audit Log
              </Link>
            </div>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`p-4 rounded-lg border mb-6 flex items-center gap-3 ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : messageType === "error"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              <div className="flex-shrink-0">
                {messageType === "success" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {messageType === "error" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {messageType === "info" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <span className="font-medium">{message}</span>
            </div>
          )}
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🔍 Search & Filter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="STUDENT">🎓 Student</option>
              <option value="ADMIN">👨‍💼 Admin</option>
              <option value="OBSERVER">👀 Observer</option>
              <option value="SUPER_ADMIN">⚡ Super Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                User Management
              </h3>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {filteredUsers.length} users found
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          <span className="text-sm">
                            {getRoleIcon(user.role)}
                          </span>
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          value={user.role}
                          onChange={(e) =>
                            handleRoleUpdate(user.id, e.target.value, user.role)
                          }
                          disabled={loading}
                        >
                          <option value="STUDENT">🎓 Student</option>
                          <option value="ADMIN">👨‍💼 Admin</option>
                          <option value="OBSERVER">👀 Observer</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter((u) => u.role === "STUDENT").length}
                </p>
              </div>
              <div className="text-2xl">🎓</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
              </div>
              <div className="text-2xl">👨‍💼</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Observers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.role === "OBSERVER").length}
                </p>
              </div>
              <div className="text-2xl">👀</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
