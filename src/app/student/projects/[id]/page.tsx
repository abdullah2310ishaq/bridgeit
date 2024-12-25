"use client";
import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaProjectDiagram,
  FaCode,
  FaCheckCircle,
  FaUserTie,
  FaBuilding,
  FaPaperPlane,
  FaMoneyBillAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import ProposalModal from "../../stdcomps/ProposalModal";

interface ExpertProject {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  companyName?: string;
  budget?: number;        // new
  startDate?: string;     // from API
  endDate?: string;
  isFeatured?: boolean;
  matchScore?: number;
  isRequested?: boolean;
  // etc...
}

interface ProjectDetailsPanelProps {
  project: ExpertProject;
  onClose: () => void;
}

const ProjectDetailsPanel: React.FC<ProjectDetailsPanelProps> = ({
  project,
  onClose,
}) => {
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>("");

  // Optionally fetch the student ID if needed
  useEffect(() => {
    async function fetchStudentId() {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) return;

        const data = await response.json();
        const studentRes = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${data.userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!studentRes.ok) return;

        const studentData = await studentRes.json();
        setStudentId(studentData.id);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentId();
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 rounded-lg shadow-2xl overflow-y-auto max-h-screen p-6">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-2xl -z-10"></div>

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
        onClick={onClose}
      >
        <FaTimes size={24} />
      </button>

      {/* Project Title */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-6 tracking-wide flex items-center">
        {project.title}
        <FaProjectDiagram className="ml-3 text-green-400" size={30} />
      </h1>

      {/* Project Info */}
      <div className="mb-8">
        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.stack && (
          <p className="text-sm text-gray-300 mb-4 flex items-center">
            <FaCode className="mr-2 text-blue-400" />
            <span className="font-semibold text-blue-400">Tech Stack:</span>{" "}
            {project.stack}
          </p>
        )}

        {/* Status */}
        {project.status && (
          <p className="text-sm text-gray-300 mb-4 flex items-center">
            <FaCheckCircle className="mr-2 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Status:</span>{" "}
            {project.status}
          </p>
        )}

        {/* Expert */}
        {project.expertName && (
          <p className="text-sm text-gray-300 mb-4 flex items-center">
            <FaUserTie className="mr-2 text-purple-400" />
            <span className="font-semibold text-purple-400">Expert:</span>{" "}
            {project.expertName}
          </p>
        )}

        {/* Company */}
        {project.companyName && (
          <p className="text-sm text-gray-300 mb-4 flex items-center">
            <FaBuilding className="mr-2 text-teal-400" />
            <span className="font-semibold text-teal-400">Company:</span>{" "}
            {project.companyName}
          </p>
        )}

        {/* Budget */}
        {project.budget !== undefined && (
          <p className="text-sm text-gray-300 mb-4 flex items-center">
            <FaMoneyBillAlt className="mr-2 text-green-400" />
            <span className="font-semibold text-green-400">Budget:</span> $
            {project.budget}
          </p>
        )}

        {/* Dates */}
        {project.startDate && (
          <p className="text-sm text-gray-300 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-300" />
            <span className="font-semibold text-blue-300">Start Date:</span>{" "}
            {project.startDate}
          </p>
        )}
        {project.endDate && (
          <p className="text-sm text-gray-300 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-pink-300" />
            <span className="font-semibold text-pink-300">End Date:</span>{" "}
            {project.endDate}
          </p>
        )}
      </div>

      {/* Submit Proposal Button */}
      <button
        className="group px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        onClick={() => setShowProposalModal(true)}
      >
        <span className="flex items-center justify-center">
          <FaPaperPlane className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
          Submit Proposal
        </span>
      </button>

      {/* Proposal Modal */}
      {showProposalModal && (
        <ProposalModal
          projectId={project.id}
          studentId={studentId}
          onClose={() => setShowProposalModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPanel;
