"use client";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import ProposalModal from "../../stdcomps/ProposalModal";

interface ExpertProject {
interface ExpertProject {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  companyName?: string;
  isFeatured?: boolean;
  matchScore?: number;
  createdAt?: string;
  isRequested?: boolean;
}

interface ProjectDetailsPanelProps {
  project: ExpertProject;
  onClose: () => void;
}

const ProjectDetailsPanel: React.FC<ProjectDetailsPanelProps> = ({ project, onClose }) => {
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>("");

  companyName?: string;
  isFeatured?: boolean;
  matchScore?: number;
  createdAt?: string;
  isRequested?: boolean;
}

interface ProjectDetailsPanelProps {
  project: ExpertProject;
  onClose: () => void;
}

const ProjectDetailsPanel: React.FC<ProjectDetailsPanelProps> = ({ project, onClose }) => {
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>("");

  useEffect(() => {
  
  
    async function fetchStudentId() {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const studentResponse = await fetch(
            `https://localhost:7053/api/get-student/student-by-id/${data.userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            setStudentId(studentData.id);
            setStudentId(studentData.id);
          }
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentId();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 rounded-lg shadow-lg overflow-y-auto max-h-screen relative p-6">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        onClick={onClose}
      >
        <FaTimes size={24} />
      </button>

      {/* Project Title */}
      <h1 className="text-3xl font-bold text-green-400 mb-4">{project.title}</h1>

      {/* Project Information */}
      <div className="mb-6">
        <p className="text-lg text-gray-400 leading-relaxed mb-4">{project.description}</p>
        {project.stack && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-blue-400">Tech Stack:</span> {project.stack}
          </p>
        )}
        {project.status && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-yellow-400">Status:</span> {project.status}
          </p>
        )}
        {project.expertName && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-purple-400">Expert:</span> {project.expertName}
          </p>
        )}
        {project.companyName && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-teal-400">Company:</span> {project.companyName}
          </p>
        )}
      </div>
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 rounded-lg shadow-lg overflow-y-auto max-h-screen relative p-6">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        onClick={onClose}
      >
        <FaTimes size={24} />
      </button>

      {/* Project Title */}
      <h1 className="text-3xl font-bold text-green-400 mb-4">{project.title}</h1>

      {/* Project Information */}
      <div className="mb-6">
        <p className="text-lg text-gray-400 leading-relaxed mb-4">{project.description}</p>
        {project.stack && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-blue-400">Tech Stack:</span> {project.stack}
          </p>
        )}
        {project.status && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-yellow-400">Status:</span> {project.status}
          </p>
        )}
        {project.expertName && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-purple-400">Expert:</span> {project.expertName}
          </p>
        )}
        {project.companyName && (
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-teal-400">Company:</span> {project.companyName}
          </p>
        )}
      </div>

      {/* Submit Proposal Button */}
      <button
        className="py-2 px-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:from-green-500 hover:to-blue-400 transition duration-300"
        onClick={() => setShowProposalModal(true)}
      >
        Submit Proposal
      </button>

      {/* Proposal Modal */}
      {showProposalModal && (
        <ProposalModal
          projectId={project.id}
          studentId={studentId}
          onClose={() => setShowProposalModal(false)}
        />
      )}
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
export default ProjectDetailsPanel;
