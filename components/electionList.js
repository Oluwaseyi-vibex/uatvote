"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ElectionList() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all elections on mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/elections`
        );
        setElections(res.data || []);
      } catch (err) {
        toast.error("Failed to load elections");
      }
    };
    fetchElections();
  }, []);

  // Fetch a single election and its candidates
  const handleElectionClick = async (electionId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/elections/${electionId}`
      );
      setSelectedElection(res.data);
    } catch (err) {
      toast.error("Could not load election details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Elections</h1>
      <ul className="space-y-2 mb-6">
        {elections.map((election) => (
          <li
            key={election.id}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
            onClick={() => handleElectionClick(election.id)}
          >
            {election.name}
          </li>
        ))}
      </ul>

      {loading && <p>Loading candidates...</p>}

      {selectedElection && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {selectedElection.name}
          </h2>
          <p className="mb-2 text-gray-600">
            {selectedElection.description || "No description provided"}
          </p>
          <h3 className="font-semibold mb-2">Candidates:</h3>
          <ul className="space-y-2">
            {selectedElection.candidates?.length > 0 ? (
              selectedElection.candidates.map((candidate) => (
                <li
                  key={candidate.id}
                  className="p-2 bg-white border rounded shadow"
                >
                  <p>
                    <strong>Name:</strong> {candidate.name}
                  </p>
                  <p>
                    <strong>Party:</strong> {candidate.party}
                  </p>
                  <p>
                    <strong>Position:</strong> {candidate.position}
                  </p>
                  <p>
                    <strong>Votes:</strong> {candidate.votes}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No candidates yet</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
