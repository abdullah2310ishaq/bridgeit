"use client";
import React, { useState } from "react";
import { toast } from "react-toastify"; // Import only toast, not ToastContainer
import { FaTimes, FaEdit } from "react-icons/fa";

interface ProposalModalProps {
  projectId: string;
  studentId: string;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ projectId, studentId, onClose }) => {
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validExtensions = ['.doc', '.docx', '.pdf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (validExtensions.includes(`.${fileExtension}`)) {
        setProposalFile(file);
      } else {
        toast.error("Please select a valid .doc, .docx, or .pdf file.");
      }
    } else {
      toast.error("Please select a valid file.");
    }
  };

  // Convert file to base64
  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64File = reader.result as string;
        // Extract the base64 portion from the data URL (after 'base64,')
        const base64Data = base64File.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  };

  // Handle submit proposal
  const handleSubmitProposal = async () => {
    if (!proposalFile) {
      toast.error("Please select a proposal file.");
      return;
    }

    setIsSubmitting(true);

    // Convert file to Base64
    const base64File = await toBase64(proposalFile);

    const data = {
      studentId,
      projectId,
      proposal: base64File, // Send only the base64 string
    };

    try {
      const response = await fetch("https://localhost:7053/api/project-proposals/send-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send as JSON
        },
        body: JSON.stringify(data), // Send the JSON with the base64-encoded file
      });

      if (response.ok) {
        toast.success("Proposal submitted successfully!");
        onClose(); // Close the modal after submission
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

        {/* File Input */}
        <input
          type="file"
          accept=".doc,.docx,.pdf" // Allow .pdf files
          onChange={handleFileChange}
          className="w-full p-4 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300"
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
