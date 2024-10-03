"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProposalModal from "../../stdcomps/ProposalModal";

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
}

const ProjectDetails = () => {
  const { id } = useParams(); // Get project id from the URL
  const [project, setProject] = useState<ProjectDetails | null>(null); // State for project details
  const [studentId, setStudentId] = useState<string>(""); // State for storing studentId
  const [showModal, setShowModal] = useState<boolean>(false); // State to toggle modal

  // Fetch studentId from StudentPage or Auth API
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
            setStudentId(studentData.id); // Use the studentId from the response, not userId
          }
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentId();
  }, []);

  // Fetch project details using project id from the URL
  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await fetch(`https://localhost:7053/api/projects/get-project-by-id/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error("Failed to fetch project details");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    }

    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  if (!project) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Project Header */}
        <h1 className="text-4xl font-extrabold text-green-500 mb-6">{project.title}</h1>
        <div className="border-b border-gray-700 mb-6"></div>

        {/* Project Description */}
        <div className="mb-6">
          <p className="text-lg text-gray-400 leading-relaxed mb-4">
            {project.description}
          </p>
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
        </div>

        {/* Proposal Button */}
        <button
          className="mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300"
          onClick={() => setShowModal(true)}
        >
          Submit Proposal
        </button>

        {/* Modal for Proposal Submission */}
        {showModal && (
          <ProposalModal
            projectId={Array.isArray(id) ? id[0] : id}
            studentId={studentId} 
            onClose={() => setShowModal(false)} // Close modal on cancel
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
