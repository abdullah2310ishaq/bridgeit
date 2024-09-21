"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toast

interface ProposalModalProps {
  projectId: string;
  studentId: string;
  onClose: () => void; // To close the modal
}

const ProposalModal: React.FC<ProposalModalProps> = ({ projectId, studentId, onClose }) => {
  const [proposal, setProposal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // To disable button during submission
  const router = useRouter(); // Initialize router for navigation

  const handleSubmitProposal = async () => {
    if (!proposal) {
      toast.error("Please enter your proposal.");
      return;
    }

    setIsSubmitting(true); // Disable the submit button while submitting

    try {
      const response = await fetch("https://localhost:7053/api/project-proposals/send-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposal,
          studentId,
          projectId,
        }),
      });

      if (response.ok) {
        toast.success("Proposal submitted successfully!");
        
        // After a short delay, redirect to the explore projects page
        setTimeout(() => {
          router.push("/student/projects/explore-projects"); // Adjust this route as needed
        }, 1500);
      } else {
        toast.error("Failed to submit proposal. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Error occurred while submitting the proposal.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-300 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-500 mb-4">Submit Your Proposal</h2>
        
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Write your proposal..."
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 h-40"
        />

        <div className="mt-4 flex justify-between">
          <button
            className={`bg-green-600 text-white px-4 py-2 rounded-lg ${isSubmitting ? "opacity-50" : "hover:bg-green-500"}`}
            onClick={handleSubmitProposal}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ProposalModal;
