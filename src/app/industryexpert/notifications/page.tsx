// app/industryexpert/notifications/NotificationsPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentModal from "@/app/components/PaymentModal";
import ProposalDetailsModal from "../industrycomponents/PropossalDetails";

interface Proposal {
  id: string;
  projectTitle: string;
  studentName: string;
  studentUserId: string; // Assumed to be Student.Id
  proposal: string; // Base64 encoded proposal
  status: string;
}

interface PaymentIntentResponse {
  Message: string;
  PaymentClientSecret: string;
}

interface ErrorResponse {
  Error: string;
  Details?: string;
}

const NotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const router = useRouter();

  // Fetch proposals on component load
  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch authorized user info
        const profileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/authorized-user-info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Profile Response Status:", profileResponse.status);

        if (!profileResponse.ok) {
          const errorData: ErrorResponse = await profileResponse.json();
          throw new Error(errorData.Error || "Failed to fetch profile.");
        }

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        // Fetch industry expert info
        const expertResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Expert Response Status:", expertResponse.status);

        if (!expertResponse.ok) {
          const errorData: ErrorResponse = await expertResponse.json();
          throw new Error(errorData.Error || "Failed to fetch expert profile.");
        }

        const expertData = await expertResponse.json();
        const expertId = expertData.indExptId;

        // Fetch proposals for the expert
        const proposalsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project-proposals/get-proposal-for-expert/${expertId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Proposals Response Status:", proposalsResponse.status);

        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json();
          console.log("Proposals Data:", proposalsData);
          const mappedProposals: Proposal[] = proposalsData.map((p: any) => ({
            id: p.id,
            projectTitle: p.projectTitle,
            studentName: p.studentName,
            studentUserId: p.studentId,
            proposal: p.proposal,
            status: p.status,
          }));
          setProposals(mappedProposals);
        } else {
          const errorData: ErrorResponse = await proposalsResponse.json();
          throw new Error(errorData.Error || "Failed to fetch proposals.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "An unexpected error occurred.");
        console.error("Fetch Proposals Error:", err);
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

  const handleViewStudentDetails = (studentUserId: string) => {
    router.push(`/industryexpert/notifications/student/${studentUserId}`);
  };

  // Initiate Payment Intent and Payment Modal
  const initiatePaymentForProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/auth/login-user");
        return;
      }

      // Create Payment Intent
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project-proposals/accept-proposal/${proposalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Accept Proposal Response Status:", response.status);

      if (response.ok) {
        const data: PaymentIntentResponse = await response.json();
        console.log("Accept Proposal Response Data:", data);

        const clientSecret = data.PaymentClientSecret;

        if (clientSecret) {
          setPaymentClientSecret(clientSecret);
          setShowPaymentModal(true);
          setSelectedProposal(
            proposals.find((proposal) => proposal.id === proposalId) || null
          );
          toast.info("Please complete the payment to accept the proposal.");
        } else {
          console.error("PaymentClientSecret is missing in the response.");
          toast.error("Payment initiation failed. Missing client secret.");
        }
      } else {
        const errorData: ErrorResponse = await response.json();
        console.error("Accept Proposal Error Data:", errorData);
        toast.error(errorData.Error || "Failed to initiate payment.");
      }
    } catch (err: any) {
      console.error("Error initiating payment:", err);
      toast.error("An unexpected error occurred while initiating payment.");
    }
  };

  // Confirm Proposal Acceptance After Successful Payment
  const handlePaymentSuccess = async () => {
    if (!selectedProposal) {
      toast.error("No proposal selected.");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/auth/login-user");
        return;
      }

      // Confirm Proposal Acceptance
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project-proposals/confirm-accept-proposal/${selectedProposal.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Confirm Accept Proposal Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Confirm Accept Proposal Response Data:", data);
        toast.success("Payment successful! Proposal has been accepted.");
        setProposals((prev) =>
          prev.filter((proposal) => proposal.id !== selectedProposal.id)
        );
        setShowPaymentModal(false);
        setPaymentClientSecret(null);
        setSelectedProposal(null);
      } else {
        const errorData: ErrorResponse = await response.json();
        console.error("Confirm Accept Proposal Error Data:", errorData);
        toast.error(errorData.Error || "Failed to confirm proposal acceptance.");
      }
    } catch (err: any) {
      console.error("Error confirming proposal acceptance:", err);
      toast.error("An unexpected error occurred while confirming proposal acceptance.");
    }
  };

  // Handle Payment Failure by Rejecting the Proposal
  const handlePaymentFailure = async () => {
    if (selectedProposal) {
      await handleRejectProposal(selectedProposal.id);
    }
    toast.error("Payment failed. Proposal acceptance was not completed.");
    setShowPaymentModal(false);
    setPaymentClientSecret(null);
    setSelectedProposal(null);
  };

  // Handle closing the payment modal without completing payment
  const handlePaymentClose = async () => {
    if (selectedProposal) {
      await handleRejectProposal(selectedProposal.id);
    }
    setShowPaymentModal(false);
    setPaymentClientSecret(null);
    setSelectedProposal(null);
  };

  // Reject Proposal with Confirmation
  const handleRejectProposal = async (proposalId: string) => {
    const confirmReject = window.confirm("Are you sure you want to reject this proposal?");
    if (!confirmReject) return;

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/auth/login-user");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project-proposals/reject-proposal/${proposalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reject Proposal Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Reject Proposal Response Data:", data);
        toast.success("Proposal rejected successfully!");
        setProposals((prev) =>
          prev.filter((proposal) => proposal.id !== proposalId)
        );
        setShowModal(false);
      } else {
        const errorData: ErrorResponse = await response.json();
        console.error("Reject Proposal Error Data:", errorData);
        toast.error(errorData.Error || "Failed to reject proposal.");
      }
    } catch (err: any) {
      console.error("Error rejecting proposal:", err);
      toast.error("An unexpected error occurred while rejecting the proposal.");
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
              <p className="text-gray-400">Status: {proposal.status}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  className="text-gray-900 bg-green-400 rounded py-2 px-4 hover:bg-green-500"
                  onClick={() => handleSeeDetails(proposal)}
                >
                  See Details
                </button>
                <button
                  className="text-gray-900 bg-blue-400 rounded py-2 px-4 hover:bg-blue-500"
                  onClick={() => handleViewStudentDetails(proposal.studentUserId)}
                >
                  View Student
                </button>
                <button
                  className="text-gray-900 bg-yellow-400 rounded py-2 px-4 hover:bg-yellow-500"
                  onClick={() => initiatePaymentForProposal(proposal.id)}
                >
                  Accept
                </button>
                <button
                  className="text-gray-900 bg-red-400 rounded py-2 px-4 hover:bg-red-500"
                  onClick={() => handleRejectProposal(proposal.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          onAccept={() => initiatePaymentForProposal(selectedProposal.id)}
          onReject={() => handleRejectProposal(selectedProposal.id)}
          onClose={() => setShowModal(false)}
        />
      )}

      {showPaymentModal && paymentClientSecret && selectedProposal && (
        <PaymentModal
          clientSecret={paymentClientSecret}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={handlePaymentClose}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default NotificationsPage;
