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
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-green-500">{project.title}</h1>
        <p className="text-sm text-gray-400">{project.description}</p>
        <p className="text-sm text-gray-300">
          <span className="font-semibold">Stack:</span> {project.stack}
        </p>
        <p className="text-sm text-gray-300">
          <span className="font-semibold">Status:</span> {project.status}
        </p>
        {project.expertName && (
          <p className="text-sm text-gray-300">
            <span className="font-semibold">Expert:</span> {project.expertName}
          </p>
        )}

        {/* Button to show modal for proposal submission */}
        <button
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-500"
          onClick={() => setShowModal(true)}
        >
          Submit Proposal
        </button>

        {/* Proposal submission modal */}
        {showModal && (
          <ProposalModal
            projectId={Array.isArray(id) ? id[0] : id}
            studentId={studentId} // Ensure the correct studentId is passed
            onClose={() => setShowModal(false)} // Close modal on cancel
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
