"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import {
  Eye,
  Download,
  FileText,
  Users,
  Calendar,
  Trophy,
  Search,
  Filter,
  LogOut,
  BarChart3,
  Vote,
  User,
  SortAsc,
  FileSpreadsheet,
  Loader,
  TrendingUp,
  CheckCircle,
  SquarePercentIcon,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";

export default function ObserverDashboard() {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [filter, setFilter] = useState({ type: "", date: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [observerName, setObserverName] = useState("");
  const [observerEmail, setObserverEmail] = useState("");
  const router = useRouter();
  const [role, setRole] = useState("");

  // Get observer info
  useEffect(() => {
    const name = localStorage.getItem("name") || "Observer";
    const email = localStorage.getItem("userEmail") || "";
    const role = localStorage.getItem("role");

    setRole(role);
    setObserverName(name);
    setObserverEmail(email);
  }, []);

  // Restrict access
  // useEffect(() => {
  //   const role = localStorage.getItem("role");
  //   const token = localStorage.getItem("token");
  //   if (token && role !== "OBSERVER" && role !== "SUPER_ADMIN") {
  //     toast.error("Access denied");
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  // Fetch elections from database
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/elections`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setElections(response.data || []);
        setFilteredElections(response.data || []);
      } catch (error) {
        toast.error("Failed to load elections");
        console.error("Error fetching elections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  // Filter elections
  useEffect(() => {
    let filtered = elections;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((election) =>
        election.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter if needed (elections from database don't have date field in current schema)
    if (filter.date) {
      filtered = filtered.filter((e) => {
        const electionDate = new Date(e.createdAt).toDateString();
        const filterDate = new Date(filter.date).toDateString();
        return electionDate === filterDate;
      });
    }

    setFilteredElections(filtered);
  }, [filter, elections, searchTerm]);

  const handleElectionClick = async (electionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections/${electionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedElection(response.data);
    } catch (error) {
      toast.error("Failed to load election details");
      console.error("Error fetching election details:", error);
    }
  };

  // Sorting
  const getSortedCandidates = (candidates) => {
    if (sortOption === "name") {
      return [...candidates].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "party") {
      return [...candidates].sort((a, b) => a.party.localeCompare(b.party));
    } else if (sortOption === "leading") {
      return [...candidates].sort((a, b) => b.votesCount - a.votesCount);
    }
    return candidates;
  };

  const exportToPDF = () => {
    if (!selectedElection) return;

    const doc = new jsPDF();
    doc.text(`Election: ${selectedElection.name}`, 10, 10);
    doc.text(`Description: ${selectedElection.description || "N/A"}`, 10, 20);
    doc.text(
      `Created: ${new Date(selectedElection.createdAt).toDateString()}`,
      10,
      30
    );

    const rows = selectedElection.candidates.map((c) => [
      c.name,
      c.party,
      c.position,
      c.votesCount.toString(),
    ]);

    autoTable(doc, {
      head: [["Name", "Party", "Position", "Votes"]],
      body: rows,
      startY: 40,
    });

    doc.save(`${selectedElection.name.replace(/\s+/g, "_")}_results.pdf`);
    toast.success("PDF exported successfully");
  };

  const exportToExcel = () => {
    if (!selectedElection) return;

    const rows = selectedElection.candidates.map((c) => ({
      Name: c.name,
      Party: c.party,
      Position: c.position,
      Votes: c.votesCount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(
      workbook,
      `${selectedElection.name.replace(/\s+/g, "_")}_results.xlsx`
    );
    toast.success("Excel file exported successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getTotalVotes = (candidates) => {
    return candidates.reduce(
      (total, candidate) => total + (candidate.votesCount || 0),
      0
    );
  };

  const getLeadingCandidate = (candidates) => {
    return candidates.reduce(
      (leading, candidate) =>
        (candidate.votesCount || 0) > (leading.votesCount || 0)
          ? candidate
          : leading,
      candidates[0] || {}
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Observer Dashboard
        </h2>
        <p className="text-gray-600">
          Please wait while we fetch election data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        {role === "SUPER_ADMIN" && (
          <Link
            href="/superAdmin"
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <SquarePercentIcon />
            SUPER_ADMIN
          </Link>
        )}

        <Link
          href="/observers"
          className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <EyeIcon />
          OBSERVE
        </Link>

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
      </div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Observer Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Monitor elections, analyze results, and export reports
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" />
                {observerName} ({observerEmail})
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-blue-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Elections
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {elections.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Vote className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Candidates
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {elections.reduce(
                  (total, election) =>
                    total + (election.candidates?.length || 0),
                  0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Elections
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredElections.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
            <Filter className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Filter Elections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search elections by name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 focus:outline-none"
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              title="Filter by creation date"
            />
          </div>

          <div>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 focus:outline-none"
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              disabled
              title="Election type filtering not available in current schema"
            >
              <option value="">All Elections</option>
            </select>
          </div>
        </div>
      </div>

      {/* Elections Grid */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Available Elections
          </h2>
        </div>

        {filteredElections.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Vote className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Elections Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElections.map((e) => (
              <div
                key={e.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => handleElectionClick(e.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{e.name}</h3>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created: {new Date(e.createdAt).toDateString()}
                  </div>
                  {e.description && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {e.description}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {e.candidates?.length || 0} candidates
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Election Details */}
      {selectedElection && (
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedElection.name}
                </h2>
                <p className="text-gray-600">Election Results & Analytics</p>
              </div>
            </div>
          </div>

          {/* Election Statistics */}
          {selectedElection.candidates &&
            selectedElection.candidates.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Total Votes
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {getTotalVotes(selectedElection.candidates)}
                      </p>
                    </div>
                    <Vote className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Candidates
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedElection.candidates.length}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Leading
                      </p>
                      <p className="text-lg font-bold text-purple-900 truncate">
                        {getLeadingCandidate(selectedElection.candidates)
                          .name || "N/A"}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            )}

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <SortAsc className="w-5 h-5 text-gray-600" />
              <select
                className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50 transition-all duration-300 focus:outline-none"
                onChange={(e) => setSortOption(e.target.value)}
                value={sortOption}
              >
                <option value="">Sort Candidates</option>
                <option value="name">By Name</option>
                <option value="party">By Party</option>
                <option value="leading">By Most Votes</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={exportToPDF}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Candidates List */}
          <div className="space-y-4">
            {selectedElection.candidates &&
            selectedElection.candidates.length > 0 ? (
              getSortedCandidates(selectedElection.candidates).map(
                (candidate, index) => (
                  <div
                    key={candidate.id}
                    className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-700">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {candidate.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {candidate.party} • {candidate.position}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {candidate.votesCount || 0}
                        </div>
                        <div className="text-sm text-gray-500">votes</div>
                      </div>
                    </div>

                    {/* Vote Progress Bar */}
                    <div className="mt-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              getTotalVotes(selectedElection.candidates) > 0
                                ? ((candidate.votesCount || 0) /
                                    getTotalVotes(
                                      selectedElection.candidates
                                    )) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {getTotalVotes(selectedElection.candidates) > 0
                            ? (
                                ((candidate.votesCount || 0) /
                                  getTotalVotes(selectedElection.candidates)) *
                                100
                              ).toFixed(1)
                            : 0}
                          % of total votes
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Candidates
                </h3>
                <p className="text-gray-600">
                  This election doesnt have any candidates yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
