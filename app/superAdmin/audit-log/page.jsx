// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";

// export default function AuditLogsPage() {
//   const [logs, setLogs] = useState([]);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [actionFilter, setActionFilter] = useState("");
//   const [entityFilter, setEntityFilter] = useState("");

//   const router = useRouter();

//   // Restrict access
//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     const token = localStorage.getItem("token");
//     if (token && !["OBSERVER", "SUPER_ADMIN", "ADMIN"].includes(role)) {
//       toast.error("Access denied");
//       router.push("/dashboard");
//     }
//   }, [router]);

//   const fetchLogs = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/admin/audit-logs`,
//         {
//           params: {
//             page,
//             limit: 10,
//             search,
//             action: actionFilter,
//             entityType: entityFilter,
//           },
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setLogs(res.data.logs);
//       setTotal(res.data.total);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch logs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLogs();
//   }, [page, search, actionFilter, entityFilter]);

//   const handleExportCSV = () => {
//     const headers = [
//       "ID",
//       "User",
//       "Email",
//       "Action",
//       "Entity",
//       "Entity ID",
//       "Date",
//     ];
//     const rows = logs.map((log) => [
//       log.id,
//       log.user?.name || "N/A",
//       log.user?.email || "N/A",
//       log.action,
//       log.entityType,
//       log.entityId,
//       new Date(log.createdAt).toLocaleString(),
//     ]);

//     const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.setAttribute("download", `audit-logs-page-${page}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-semibold text-gray-800">📜 Audit Logs</h1>
//         <button onClick={handleExportCSV} className="btn btn-primary btn-sm">
//           Export CSV
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <input
//           type="text"
//           placeholder="🔍 Search by user/email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="input input-bordered w-full"
//         />
//         <select
//           className="select select-bordered w-full"
//           value={actionFilter}
//           onChange={(e) => setActionFilter(e.target.value)}
//         >
//           <option value="">All Actions</option>
//           <option value="CREATE_ELECTION">Create Election</option>
//           <option value="ADD_CANDIDATE">Add Candidate</option>
//           <option value="CAST_VOTE">Cast Vote</option>
//           <option value="DELETE_CANDIDATE">Delete Candidate</option>
//         </select>
//         <select
//           className="select select-bordered w-full"
//           value={entityFilter}
//           onChange={(e) => setEntityFilter(e.target.value)}
//         >
//           <option value="">All Entities</option>
//           <option value="User">User</option>
//           <option value="Election">Election</option>
//           <option value="Candidate">Candidate</option>
//           <option value="Vote">Vote</option>
//         </select>
//       </div>

//       {loading ? (
//         <div className="text-center py-10">⏳ Loading...</div>
//       ) : logs.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">No logs found</div>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//           <table className="table w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th>ID</th>
//                 <th>User</th>
//                 <th>Email</th>
//                 <th>Action</th>
//                 <th>Entity</th>
//                 <th>Entity ID</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log) => (
//                 <tr key={log.id} className="hover">
//                   <td>{log.id}</td>
//                   <td>{log.user?.name || "N/A"}</td>
//                   <td>{log.user?.email || "N/A"}</td>
//                   <td>
//                     <span className="badge badge-outline badge-info">
//                       {log.action}
//                     </span>
//                   </td>
//                   <td>{log.entityType}</td>
//                   <td>{log.entityId}</td>
//                   <td>{new Date(log.createdAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           className="btn btn-outline btn-sm"
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//         >
//           ◀ Prev
//         </button>
//         <span className="text-gray-600">
//           Page {page} / {Math.ceil(total / 10) || 1}
//         </span>
//         <button
//           className="btn btn-outline btn-sm"
//           onClick={() => setPage((p) => p + 1)}
//           disabled={page * 10 >= total}
//         >
//           Next ▶
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  const router = useRouter();

  // Restrict access
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (token && !["OBSERVER", "SUPER_ADMIN", "ADMIN"].includes(role)) {
      toast.error("Access denied");
      router.push("/dashboard");
    }
  }, [router]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/audit-logs`,
        {
          params: {
            page,
            limit: 10,
            search,
            action: actionFilter,
            entityType: entityFilter,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, actionFilter, entityFilter]);

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "User",
      "Email",
      "Action",
      "Entity",
      "Entity ID",
      "Date",
    ];
    const rows = logs.map((log) => [
      log.id,
      log.user?.name || "N/A",
      log.user?.email || "N/A",
      log.action,
      log.entityType,
      log.entityId,
      new Date(log.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `audit-logs-page-${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      CREATE_ELECTION: "bg-green-100 text-green-800 border-green-200",
      ADD_CANDIDATE: "bg-blue-100 text-blue-800 border-blue-200",
      CAST_VOTE: "bg-purple-100 text-purple-800 border-purple-200",
      DELETE_CANDIDATE: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[action] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getEntityIcon = (entityType) => {
    const icons = {
      User: "👤",
      Election: "🗳️",
      Candidate: "👔",
      Vote: "✅",
    };
    return icons[entityType] || "📄";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Audit Logs
              </h1>
              <p className="text-gray-600">
                Track and monitor all system activities and changes
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🔍 Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Search by user or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="CREATE_ELECTION">Create Election</option>
              <option value="ADD_CANDIDATE">Add Candidate</option>
              <option value="CAST_VOTE">Cast Vote</option>
              <option value="DELETE_CANDIDATE">Delete Candidate</option>
            </select>

            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="">All Entities</option>
              <option value="User">👤 User</option>
              <option value="Election">🗳️ Election</option>
              <option value="Candidate">👔 Candidate</option>
              <option value="Vote">✅ Vote</option>
            </select>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Results Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Activity Log
              </h3>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {total} total entries
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading audit logs...</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No logs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log, index) => (
                    <tr
                      key={log.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        #{log.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {log.user?.name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.user?.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getEntityIcon(log.entityType)}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {log.entityType}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              ID: {log.entityId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing</span>
            <span className="font-semibold text-gray-900">
              {Math.min((page - 1) * 10 + 1, total)}
            </span>
            <span>to</span>
            <span className="font-semibold text-gray-900">
              {Math.min(page * 10, total)}
            </span>
            <span>of</span>
            <span className="font-semibold text-gray-900">{total}</span>
            <span>results</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, Math.ceil(total / 10)) },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 10 >= total}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
