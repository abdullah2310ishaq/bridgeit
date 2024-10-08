"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Import only toast, not ToastContainer
import { FaTimes, FaEdit } from "react-icons/fa";

interface ProposalModalProps {
  projectId: string;
  studentId: string;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ projectId, studentId, onClose }) => {
  const [proposal, setProposal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

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

        // Close the modal after submission
        onClose();

        // Optionally, you can refresh the page or update the state to reflect the submission
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 text-gray-200 p-8 shadow-2xl w-full max-w-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-3xl font-bold text-green-400 mb-6 flex items-center ">
          <FaEdit className="mr-2 text-green-400" /> Submit Your Proposal Here
        </h2>

        {/* Proposal Textarea */}
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Write your proposal here..."
          className="w-full p-4 rounded-md bg-gray-700 text-gray-200 h-48 border border-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300"
        />

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          {/* Submit Proposal Button */}
          <button
            className={`px-6 py-3 rounded-full font-medium text-white shadow-lg transform transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            }`}
            onClick={handleSubmitProposal}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </button>

          {/* Cancel Button */}
          <button
            className="px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-500 shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;
