import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProposalModalProps {
  projectId: string;
  studentId: string;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ projectId, studentId, onClose }) => {
  const [proposal, setProposal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitProposal = async () => {
    if (!proposal.trim()) {
      toast.error("Please enter your proposal.");
      return;
    }

    setIsSubmitting(true);

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
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit proposal. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("An error occurred while submitting the proposal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 p-8 rounded-lg shadow-xl w-full max-w-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-3xl font-bold text-green-400 mb-4">Submit Your Proposal</h2>

        {/* Proposal Textarea */}
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Write your proposal here..."
          className="w-full p-4 rounded-lg bg-gray-700 text-gray-300 h-48 border-2 border-gray-600 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-500 transition duration-300"
        />

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500"
            }`}
            onClick={handleSubmitProposal}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 shadow-lg transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ProposalModal;