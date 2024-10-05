"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle, FaBell, FaEnvelopeOpenText } from "react-icons/fa";

interface Proposal {
  id: string;
  projectTitle: string;
  proposal: string;
  status: string;
  read: boolean;
}

const StudentNotificationsPage: React.FC = () => {
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
        const proposalsWithRead = proposalsData.map((proposal: Proposal) => ({
          ...proposal,
          read: false,
        }));

        setProposals(proposalsWithRead);
      } catch (error) {
        setError("Failed to fetch proposals");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [router]);

  const handleDismissProposal = (id: string) => {
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === id ? { ...proposal, read: true } : proposal
      )
    );
    toast.success("Notification dismissed!");
  };

  const handleMarkAllAsRead = () => {
    setProposals((prev) =>
      prev.map((proposal) => ({ ...proposal, read: true }))
    );
    toast.success("All notifications marked as read!");
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const unreadProposals = proposals.filter((proposal) => !proposal.read);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with Gradient */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 text-transparent bg-clip-text">
            <FaBell className="inline-block mr-2" />
            Your Notifications
          </h1>
          {unreadProposals.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg hover:opacity-80 transition-opacity duration-300"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {unreadProposals.length === 0 ? (
          <div className="text-center text-gray-400">
            <FaEnvelopeOpenText className="inline-block text-5xl mb-4" />
            <p>No new notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {unreadProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <button
                  className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                  onClick={() => handleDismissProposal(proposal.id)}
                >
                  ❌
                </button>
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-white mb-2 flex-grow">
                    {proposal.projectTitle}
                    <span className="ml-3 inline-block px-2 py-1 bg-green-600 text-xs font-bold text-white rounded-full">
                      New
                    </span>
                  </h2>
                  <span className="text-2xl ml-4">
                    {proposal.status === "Accepted" ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{proposal.proposal}</p>
                <p className={`text-lg font-bold ${getStatusColor(proposal.status)}`}>
                  Status: {proposal.status}
                </p>
              </div>
            ))}
          </div>
        )}
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

export default StudentNotificationsPage;
