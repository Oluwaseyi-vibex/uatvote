"use client";
import { useState } from "react";
import axios from "axios";

export default function SuperAdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");

  const createUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/super-admin-create-user`,
        { email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-xl rounded-xl">
      <h1 className="text-xl font-bold mb-4">Super Admin Dashboard</h1>

      <input
        type="email"
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border w-full p-2 mb-3 rounded"
      />

      <input
        type="password"
        placeholder="User Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border w-full p-2 mb-3 rounded"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border w-full p-2 mb-3 rounded"
      >
        <option value="ADMIN">Admin</option>
        <option value="OBSERVER">Observer</option>
      </select>

      <button
        onClick={createUser}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create User
      </button>
    </div>
  );
}
