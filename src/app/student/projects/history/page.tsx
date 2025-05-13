"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Proposal {
  id: string;
  projectTitle: string;
  proposal: string;
  status: string;
}

const ProposalHistoryPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token is missing");
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch the authorized user's profile (student)
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) {
          console.error("Failed to fetch profile", profileResponse.statusText);
          throw new Error("Failed to fetch profile");
        }

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        // Fetch the student ID using the userId
        const studentResponse = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!studentResponse.ok) {
          console.error("Failed to fetch student details", studentResponse.statusText);
          throw new Error("Failed to fetch student details");
        }

        const studentData = await studentResponse.json();
        const studentId = studentData.id;

        // Fetch proposals for the student using their student ID
        const proposalsResponse = await fetch(
          `https://localhost:7053/api/project-proposals/get-proposal-for-student/${studentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!proposalsResponse.ok) {
          console.error("Failed to fetch proposals", proposalsResponse.statusText);
          throw new Error("Failed to fetch proposals");
        }

        const proposalsData = await proposalsResponse.json();
        setProposals(proposalsData);
      } catch (error) {
        setError("Failed to fetch proposals");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [router]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (proposals.length === 0) {
    return <div className="text-center text-gray-400">No proposals found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-500 mb-6">Your Proposal History</h1>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-gray-800 rounded-lg p-4 shadow-md"
            >
              <h2 className="text-lg font-semibold text-white mb-2">
                {proposal.projectTitle}
              </h2>
              <p className="text-gray-300 mb-2">{proposal.proposal}</p>
              <p className={`text-lg font-bold ${getStatusColor(proposal.status)}`}>
                Status: {proposal.status}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

// Function to get status color based on proposal status
const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "text-green-500";
    case "Rejected":
      return "text-red-500";
    default:
      return "text-yellow-500";
  }
};

export default ProposalHistoryPage;
