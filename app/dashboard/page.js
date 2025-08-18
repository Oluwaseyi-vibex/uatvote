"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { debounce } from "lodash";
import {
  Vote,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Shield,
  User,
  Trophy,
  AlertCircle,
  Loader,
} from "lucide-react";

export default function VoterDashboard() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [loadingElection, setLoadingElection] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votes, setVotes] = useState({});
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const recaptchaRef = useRef(null);
  const [votingCandidateId, setVotingCandidateId] = useState(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || null;
    const name = localStorage.getItem("name") || "User";
    setEmail(userEmail);
    setUserName(name);
  }, []);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/elections`
        );
        setElections(res.data || []);
      } catch (err) {
        toast.error("Failed to load elections. Please try again later.");
      }
    };
    fetchElections();
  }, []);

  const handleElectionClick = async (electionId) => {
    setLoadingElection(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections/${electionId}`
      );
      setSelectedElection(res.data);

      // Fetch user votes from backend
      const voteRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/vote/user`,
        {
          params: { email },
        }
      );

      const votedCandidateIds = voteRes.data.votedCandidates;

      // Map candidateId to position
      const positionMap = {};
      for (const candidate of res.data.candidates) {
        if (votedCandidateIds.includes(candidate.id)) {
          positionMap[candidate.position] = candidate.id;
        }
      }

      setVotes(positionMap); // Format: { "President": 3, "Secretary": 7 }
    } catch (err) {
      toast.error("Failed to fetch election details or user votes.");
    } finally {
      setLoadingElection(false);
    }
  };

  const voteForCandidate = debounce(async (candidateId, position) => {
    if (!email) {
      toast.error("You are not logged in.");
      return;
    }

    if (votes[position]) {
      toast.error(`You have already voted for ${position}.`);
      return;
    }

    if (!captchaValue) {
      toast.error("Please complete the CAPTCHA to vote.");
      return;
    }

    setVotingCandidateId(candidateId);
    setVoting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/vote`, {
        electionId: selectedElection.id,
        candidateId,
        email,
        captchaValue,
      });

      toast.success("Vote submitted successfully!");

      // Refresh votes from backend after vote
      await handleElectionClick(selectedElection.id);

      setCaptchaValue(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to submit vote. Please try again."
      );
    } finally {
      setVoting(false);
      setVotingCandidateId(null);
    }
  }, 1000);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userName}!
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Ready to make your voice heard? Cast your vote in the available
              elections below.
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <User className="w-4 h-4 mr-1" />
              {email || "Loading..."}
            </div>
          </div>
        </div>
      </div>

      {/* Elections Grid */}
      <div>
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Available Elections
          </h2>
        </div>

        {elections.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
            <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Elections Available
            </h3>
            <p className="text-gray-500">
              There are currently no active elections. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <div
                key={election.id}
                className="bg-white border border-green-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-green-200 hover:scale-105 group"
                onClick={() => handleElectionClick(election.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-green-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                  {election.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Click to view candidates and cast your vote
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loadingElection && (
        <div className="bg-white border border-green-100 rounded-2xl p-8 text-center">
          <Loader className="w-8 h-8 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg font-semibold text-gray-700">
            Loading election details...
          </p>
          <p className="text-gray-500">
            Please wait while we fetch the candidates
          </p>
        </div>
      )}

      {/* Selected Election */}
      {selectedElection && (
        <div className="bg-white border border-green-100 rounded-2xl p-8">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedElection.name}
              </h2>
              <p className="text-gray-600 text-lg">
                Select your preferred candidates for each position
              </p>
            </div>
          </div>

          {/* CAPTCHA */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Security Verification
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Please complete the CAPTCHA below to verify you're human before
              voting.
            </p>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(value) => setCaptchaValue(value)}
              ref={recaptchaRef}
            />
          </div>

          {/* Positions and Candidates */}
          <div className="space-y-8">
            {Object.entries(
              selectedElection.candidates.reduce((acc, candidate) => {
                acc[candidate.position] ||= [];
                acc[candidate.position].push(candidate);
                return acc;
              }, {})
            ).map(([position, candidates]) => (
              <div
                key={position}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {position}
                    </h3>
                    <p className="text-gray-600">
                      Choose your preferred candidate
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {candidates.map((candidate) => {
                    const hasVoted = votes[position] === candidate.id;
                    const isVoting = votingCandidateId === candidate.id;

                    return (
                      <div
                        key={candidate.id}
                        className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                          hasVoted
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 hover:border-green-200 hover:bg-green-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                hasVoted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {hasVoted ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <User className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">
                                {candidate.name}
                              </h4>
                              <p className="text-gray-600 font-medium">
                                {candidate.party}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              voteForCandidate(candidate.id, position)
                            }
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                              hasVoted
                                ? "bg-green-500 text-white cursor-default"
                                : isVoting
                                ? "bg-gray-400 text-white cursor-wait"
                                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-md"
                            }`}
                            disabled={hasVoted || isVoting}
                          >
                            {hasVoted ? (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Voted</span>
                              </>
                            ) : isVoting ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>Voting...</span>
                              </>
                            ) : (
                              <>
                                <Vote className="w-5 h-5" />
                                <span>Vote</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Voting Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  Voting Instructions
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>
                    • Complete the CAPTCHA verification above before voting
                  </li>
                  <li>• You can vote for one candidate per position</li>
                  <li>• Your vote cannot be changed once submitted</li>
                  <li>• All votes are encrypted and stored securely</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
