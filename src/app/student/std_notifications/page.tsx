"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface Proposal {
  id: string;
  projectTitle: string;
  proposal: string;
  status: string;
  read: boolean;
  projectId: string;
  expertFirstName: string;
  expertLastName: string;
  expertImageData: string;
}

const StudentNotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");
  const router = useRouter();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/auth/login-user");
      return;
    }

    try {
      setLoading(true);
      const profileResponse = await fetch(
        "https://localhost:7053/api/auth/authorized-user-info",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profileData = await profileResponse.json();

      const studentResponse = await fetch(
        `https://localhost:7053/api/get-student/student-by-id/${profileData.userId}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );
      const studentData = await studentResponse.json();

      const proposalsResponse = await fetch(
        `https://localhost:7053/api/project-proposals/get-proposal-for-student/${studentData.id}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );
      const proposalsData = await proposalsResponse.json();

      setProposals(proposalsData);
    } catch (error) {
      setError("Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  const handleDismissProposal = (id: string) => {
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === id ? { ...proposal, read: true } : proposal
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-16 w-16 mb-4 text-red-500" />
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  const unreadProposals = proposals.filter((proposal) => !proposal.read);
  const readProposals = proposals.filter((proposal) => proposal.read);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-white mb-6">Notifications</h1>

      {/* Tab Switcher */}
      <div className="flex space-x-8 border-b border-gray-700 mb-6">
        <button
          className={`pb-2 text-lg ${
            activeTab === "unread"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Unread ({unreadProposals.length})
        </button>
        <button
          className={`pb-2 text-lg ${
            activeTab === "read"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("read")}
        >
          Read ({readProposals.length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {(activeTab === "unread" ? unreadProposals : readProposals).map(
          (proposal) => (
            <div
              key={proposal.id}
              className="bg-gray-800 p-4 rounded-md border border-gray-700"
            >
              <div className="flex items-center mb-2">
                {/* Expert Image */}
                {proposal.expertImageData ? (
                  <img
                    src={proposal.expertImageData}
                    alt={`${proposal.expertFirstName} ${proposal.expertLastName}`}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-gray-700"
                  />
                ) : (
                  <div className="bg-gray-700 w-12 h-12 rounded-full mr-3" />
                )}

                {/* Expert and Project Info */}
                <div>
                  <p className="text-lg font-bold text-white mb-1">
                    {proposal.projectTitle}
                  </p>
                  <p className="text-sm text-gray-400">
                    Your proposal for &quot;{proposal.projectTitle}&quot; was{" "}
                    <span
                      className={`font-semibold ${
                        proposal.status === "Accepted"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {proposal.status.toLowerCase()}
                    </span>
                    .
                  </p>
                </div>
              </div>

              {/* Dismiss Button for unread items */}
              {activeTab === "unread" && (
                <button
                  onClick={() => handleDismissProposal(proposal.id)}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StudentNotificationsPage;
