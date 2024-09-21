"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa"; // Icons for status
import ProposalDetailsModal from "../industrycomponents/PropossalDetails";
import "react-toastify/dist/ReactToastify.css";

interface Proposal {
  id: string;
  projectTitle: string;
  proposal: string;
  studentName: string;
  status: string;
}

const NotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
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

        if (!profileResponse.ok) throw new Error("Failed to fetch profile");

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        const expertResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile");

        const expertData = await expertResponse.json();
        const expertId = expertData.indExptId;

        const proposalsResponse = await fetch(
          `https://localhost:7053/api/project-proposals/get-proposal-for-expert/${expertId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json();
          setProposals(proposalsData);
        } else {
          setProposals([]);
        }
      } catch (error) {
        setError("Failed to fetch proposals");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [router]);

  const handleSeeDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://localhost:7053/api/project-proposals/accept-proposal/${proposalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Proposal accepted successfully!");
        setProposals((prev) =>
          prev.filter((proposal) => proposal.id !== proposalId)
        );
        setShowModal(false);
      } else {
        toast.error("Failed to accept proposal.");
      }
    } catch (error) {
      toast.error("Error accepting proposal.");
      console.error("Error accepting proposal:", error);
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://localhost:7053/api/project-proposals/reject-proposal/${proposalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Proposal rejected successfully!");
        setProposals((prev) =>
          prev.filter((proposal) => proposal.id !== proposalId)
        );
        setShowModal(false);
      } else {
        toast.error("Failed to reject proposal.");
      }
    } catch (error) {
      toast.error("Error rejecting proposal.");
      console.error("Error rejecting proposal:", error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-green-500 mb-8 text-center">
          Notifications
        </h1>
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="relative bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                {proposal.status === "Accepted" && (
                  <FaCheckCircle className="text-green-400 text-2xl" />
                )}
                {proposal.status === "Rejected" && (
                  <FaTimesCircle className="text-red-400 text-2xl" />
                )}
                {proposal.status !== "Accepted" && proposal.status !== "Rejected" && (
                  <FaInfoCircle className="text-yellow-400 text-2xl" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {proposal.projectTitle}
              </h2>
              <p className="text-gray-400 mb-4">From: {proposal.studentName}</p>
              <p className="text-gray-300 mb-4">{proposal.proposal}</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
                  onClick={() => handleSeeDetails(proposal)}
                >
                  See Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposal Details Modal */}
      {showModal && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          onAccept={() => handleAcceptProposal(selectedProposal.id)}
          onReject={() => handleRejectProposal(selectedProposal.id)}
          onClose={() => setShowModal(false)}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default NotificationsPage;
