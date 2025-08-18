"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  History,
  Vote,
  User,
  Calendar,
  Trophy,
  RefreshCw,
  CheckCircle,
  Users,
  Award,
  Clock,
  Loader,
  FileText,
} from "lucide-react";

// Custom hook for fetching vote history
const useVoteHistory = () => {
  const [voteHistory, setVoteHistory] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVoteHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");

      if (!token || !email) {
        throw new Error("Not authenticated");
      }

      // Fetch user's votes
      const votesRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/vote/user`,
        {
          params: { email },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch all elections to map candidate IDs to details
      const electionsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Map votes to detailed history
      const votes = votesRes.data.votedCandidates || [];
      const electionData = electionsRes.data || [];
      const history = votes
        .map((candidateId) => {
          for (const election of electionData) {
            const candidate = election.candidates.find(
              (c) => c.id === candidateId
            );
            if (candidate) {
              return {
                electionId: election.id,
                electionName: election.name,
                candidateName: candidate.name,
                party: candidate.party,
                position: candidate.position,
              };
            }
          }
          return null; // If candidate not found (edge case)
        })
        .filter(Boolean); // Remove null entries

      setVoteHistory(history);
      setElections(electionData);
    } catch (error) {
      toast.error(error.message || "Failed to load vote history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteHistory();
  }, []);

  return { voteHistory, elections, loading, refetch: fetchVoteHistory };
};

export default function VoteHistory() {
  const { voteHistory, elections, loading, refetch } = useVoteHistory();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Check if user is authenticated and not an admin/observer
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view your vote history");
      router.push("/login");
    }
  }, [router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    toast.success("Vote history refreshed!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Your Vote History
        </h2>
        <p className="text-gray-600">
          Please wait while we fetch your voting records...
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
              <History className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Your Vote History
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Track all your voting activity and election participation
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Votes Cast
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {voteHistory.length}
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
                Elections Participated
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {
                  elections.filter((e) =>
                    voteHistory.some((v) => v.electionId === e.id)
                  ).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Participation Rate
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {elections.length > 0
                  ? Math.round(
                      (elections.filter((e) =>
                        voteHistory.some((v) => v.electionId === e.id)
                      ).length /
                        elections.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Vote History Content */}
      {voteHistory.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Voting History Yet
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            You haven't participated in any elections yet. When you cast your
            first vote, it will appear here.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            View Available Elections
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              Election History
            </h2>
          </div>

          {elections.map((election) => {
            const votesInElection = voteHistory.filter(
              (vote) => vote.electionId === election.id
            );
            if (votesInElection.length === 0) return null;

            return (
              <div
                key={election.id}
                className="bg-white border border-green-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Election Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {election.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {election.description ||
                          "Election description not available"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Voted</span>
                  </div>
                </div>

                {/* Votes Cast */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    Your Votes ({votesInElection.length})
                  </h4>

                  <div className="grid gap-4">
                    {votesInElection.map((vote) => (
                      <div
                        key={`${vote.electionId}-${vote.position}`}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="text-xl font-bold text-gray-900">
                                {vote.candidateName}
                              </h5>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-gray-600 font-medium">
                                  {vote.party}
                                </span>
                                <span className="text-green-600 font-semibold">
                                  {vote.position}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Voted</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Note */}
      {voteHistory.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <Clock className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">
                Vote History Notes
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>
                  • Your vote history is permanently recorded and cannot be
                  modified
                </li>
                <li>
                  • All votes are anonymous and your personal information is
                  protected
                </li>
                <li>
                  • This history shows only elections where you have cast votes
                </li>
                <li>
                  • Contact support if you notice any discrepancies in your
                  voting records
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
