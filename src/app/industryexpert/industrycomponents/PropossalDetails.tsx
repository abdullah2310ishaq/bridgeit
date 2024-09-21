"use client";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProposalDetailsModalProps {
  proposal: {
    id: string;
    projectTitle: string;
    studentName: string;
    proposal: string;
    status: string;
  };
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

const ProposalDetailsModal: React.FC<ProposalDetailsModalProps> = ({
  proposal,
  onAccept,
  onReject,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-300 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-500 mb-4">
          Proposal Details
        </h2>
        <p>
          <strong>Project:</strong> {proposal.projectTitle}
        </p>
        <p>
          <strong>Student:</strong> {proposal.studentName}
        </p>
        <p>
          <strong>Proposal:</strong> {proposal.proposal}
        </p>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
            onClick={onAccept}
          >
            Accept
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
            onClick={onReject}
          >
            Reject
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ProposalDetailsModal;
