"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { colors } from "@/app/common_components/Utils/colors";
 // 🎨 Import Colors

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
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ color: colors.text }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{ color: colors.error }}
      >
        <AlertCircle className="h-16 w-16 mb-4" />
        <p className="text-2xl">{error}</p>
      </div>
    );
  }

  const unreadProposals = proposals.filter((proposal) => !proposal.read);
  const readProposals = proposals.filter((proposal) => proposal.read);

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">Notifications</h1>

      {/* Tab Switcher */}
      <div className="flex space-x-8 border-b mb-6" style={{ borderColor: colors.border }}>
        <button
          className="pb-2 text-lg"
          style={{
            color: activeTab === "unread" ? colors.primary : colors.text,
            borderBottom: activeTab === "unread" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("unread")}
        >
          Unread ({unreadProposals.length})
        </button>
        <button
          className="pb-2 text-lg"
          style={{
            color: activeTab === "read" ? colors.primary : colors.text,
            borderBottom: activeTab === "read" ? `2px solid ${colors.primary}` : "none",
          }}
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
              className="p-4 rounded-md border"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center mb-2">
                {/* Expert Image */}
                {proposal.expertImageData ? (
                  <img
                    src={proposal.expertImageData}
                    alt={`${proposal.expertFirstName} ${proposal.expertLastName}`}
                    className="w-12 h-12 rounded-full mr-3 border-2"
                    style={{ borderColor: colors.border }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full mr-3"
                    style={{ backgroundColor: colors.border }}
                  />
                )}

                {/* Expert and Project Info */}
                <div>
                  <p className="text-lg font-bold mb-1">{proposal.projectTitle}</p>
                  <p className="text-sm">
                    Your proposal for &quot;{proposal.projectTitle}&quot; was{" "}
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          proposal.status === "Accepted"
                            ? colors.success
                            : colors.error,
                      }}
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
                  className="text-sm hover:underline"
                  style={{ color: colors.primary }}
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
