"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProposalDetailsModal from "../industrycomponents/PropossalDetails";

interface Proposal {
  id: string;
  projectTitle: string;
  studentName: string;
  studentUserId: string;
  proposal: string; // Base64 encoded proposal
  status: string;
}

const NotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  // Fetch proposals on component load
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
          // Map API response to match Proposal interface
          const mappedProposals = proposalsData.map((p: any) => ({
            id: p.id,
            projectTitle: p.projectTitle,
            studentName: p.studentName,
            studentUserId: p.studentId,
            proposal: p.proposal, // base64 string
            status: p.status,
          }));
          setProposals(mappedProposals);
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
          prev.filter((proposal) => proposal.id !== proposalId) // Remove proposal after accepting
        );
        setShowModal(false); // Close the modal
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="mb-6">
          {/* <img
            src="/no-notifications.svg" // Use a placeholder image or illustration
            alt="No Notifications"
            className="w-40 h-40"
          /> */}
        </div>
        <h1 className="text-2xl font-semibold">No Notifications</h1>
        <p className="text-gray-400 mt-2">
          You dont have any new proposals at the moment. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-500 mb-6">Notifications</h1>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-gray-800 rounded-lg p-4 shadow-md"
            >
              <h2 className="text-lg font-semibold text-white mb-2">
                {proposal.projectTitle}
              </h2>
              <p className="text-gray-400">From: {proposal.studentName}</p>
              <p className="text-gray-300 mb-2">
                You have a new proposal document.
              </p>
              <p className="text-gray-400">Status: {proposal.status}</p>
              <button
                className="mt-4 text-gray-900 bg-green-400 rounded py-2 px-4 hover:bg-green-500 transition duration-200"
                onClick={() => handleSeeDetails(proposal)}
              >
                See Details
              </button>
            </div>
          ))}
        </div>
      </div>

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
