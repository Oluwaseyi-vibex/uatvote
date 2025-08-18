"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Settings,
  Plus,
  Users,
  Calendar,
  Trophy,
  UserPlus,
  Vote,
  LogOut,
  AlertCircle,
  CheckCircle,
  Loader,
  User,
  FileText,
  Crown,
} from "lucide-react";

// Custom hook for fetching elections
const useElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    } catch (error) {
      toast.error("Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
    console.log(localStorage.getItem("userEmail"));
  }, []);

  return { elections, setElections, loading, refetch: fetchElections };
};

export default function Admin() {
  const { elections, setElections, loading, refetch } = useElections();
  const [selectedElection, setSelectedElection] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    position: "",
  });
  const [newElectionData, setNewElectionData] = useState({
    name: "",
    description: "",
    date: "",
  });
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [addingCandidate, setAddingCandidate] = useState(false);
  const [creatingElection, setCreatingElection] = useState(false);
  const router = useRouter();

  // Get admin info
  useEffect(() => {
    const name = localStorage.getItem("name") || "Admin";
    const email = localStorage.getItem("userEmail") || "";
    setAdminName(name);
    setAdminEmail(email);
  }, []);

  // Check if admin is logged in
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "admin") {
      toast.error("Access denied");
      router.push("/dashboard");
    }
  }, [router]);

  // Handle form changes dynamically for candidate
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form changes dynamically for new election
  const handleElectionChange = (e) => {
    const { name, value } = e.target;
    setNewElectionData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for adding candidate
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const { name, party, position } = formData;

    if (!selectedElection) {
      return toast.error("Please select an election");
    }

    setAddingCandidate(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections/add-candidate`,
        {
          name,
          party,
          position,
          electionId: selectedElection,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Candidate added successfully");
      setFormData({ name: "", party: "", position: "" }); // Reset form
      refetch(); // Refresh elections to reflect new candidate
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding candidate");
    } finally {
      setAddingCandidate(false);
    }
  };

  // Handle form submission for creating new election
  const handleCreateElection = async (e) => {
    e.preventDefault();
    const { name, description, date } = newElectionData;

    if (!name || !description || !date) {
      return toast.error("All fields are required for creating an election.");
    }

    setCreatingElection(true);
    try {
      const token = localStorage.getItem("token");
      const newElection = { name, description }; // Backend doesn't use date yet, but you can add it if needed
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections/create`,
        newElection,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Election created successfully");
      setNewElectionData({ name: "", description: "", date: "" }); // Reset form
      refetch(); // Refresh elections list
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating election");
    } finally {
      setCreatingElection(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Admin Panel
        </h2>
        <p className="text-gray-600">
          Please wait while we set up your administrative tools...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Control Panel
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Manage elections, candidates, and voting systems
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" />
                {adminName} ({adminEmail})
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
        <div className="bg-white border border-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Elections
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {elections.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Vote className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-2xl p-6">
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
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
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
                {elections.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Election Form */}
        <div className="bg-white border border-green-100 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create Election
              </h2>
              <p className="text-gray-600">Set up a new voting election</p>
            </div>
          </div>

          <form onSubmit={handleCreateElection} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Election Name *
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-green-50 transition-all duration-300 focus:outline-none"
                name="name"
                placeholder="e.g., General Student Election 2025"
                value={newElectionData.name}
                onChange={handleElectionChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-green-50 transition-all duration-300 focus:outline-none"
                name="description"
                placeholder="Brief description of the election purpose"
                value={newElectionData.description}
                onChange={handleElectionChange}
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Election Date *
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-green-50 transition-all duration-300 focus:outline-none"
                name="date"
                type="date"
                value={newElectionData.date}
                onChange={handleElectionChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={creatingElection}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
            >
              {creatingElection ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating Election...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Election
                </>
              )}
            </button>
          </form>
        </div>

        {/* Add Candidate Form */}
        <div className="bg-white border border-green-100 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Add Candidate
              </h2>
              <p className="text-gray-600">
                Register a new candidate for election
              </p>
            </div>
          </div>

          <form onSubmit={handleAddCandidate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Election *
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-green-50 transition-all duration-300 focus:outline-none"
                name="election"
                value={selectedElection}
                onChange={(e) => setSelectedElection(e.target.value)}
                required
              >
                <option value="">Choose an election...</option>
                {elections.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              {elections.length === 0 && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  No elections available. Create an election first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Name *
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-green-50 transition-all duration-300 focus:outline-none"
                name="name"
                placeholder="Full name of the candidate"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party/Affiliation *
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-green-50 transition-all duration-300 focus:outline-none"
                name="party"
                placeholder="Political party or group"
                value={formData.party}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:bg-green-50 transition-all duration-300 focus:outline-none"
                name="position"
                placeholder="e.g., President, Secretary, Treasurer"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={elections.length === 0 || addingCandidate}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
            >
              {addingCandidate ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Adding Candidate...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add Candidate
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Elections Overview */}
      {elections.length > 0 && (
        <div className="bg-white border border-green-100 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Elections Overview
              </h2>
              <p className="text-gray-600">
                Manage existing elections and candidates
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {elections.map((election) => (
              <div
                key={election.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-green-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {election.name}
                  </h3>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{election.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {election.candidates?.length || 0} candidates registered
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <Settings className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-2">
              Administrative Guidelines
            </h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Create elections before adding candidates to them</li>
              <li>
                • Ensure all candidate information is accurate before submission
              </li>
              <li>
                • Monitor election progress through the statistics dashboard
              </li>
              <li>• Contact technical support for any system-related issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
