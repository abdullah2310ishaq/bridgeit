"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpertProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [indExpertId, setIndExpertId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("You must be logged in to view your projects.");
        router.push("/login"); // Redirect to login page if not logged in
        return;
      }

      try {
        // Fetch authorized user profile to get userId
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          // Fetch IndExpertId using userId
          const expertResponse = await fetch(
            `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (expertResponse.ok) {
            const expertData = await expertResponse.json();

            if (expertData.indExptId) {
              const indExptId = expertData.indExptId;
              setIndExpertId(indExptId);

              // Fetch projects using IndExpertId
              const projectsResponse = await fetch(
                `https://localhost:7053/api/projects/get-expert-projects-by-id/${indExptId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (projectsResponse.ok) {
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
              } else {
                toast.error("Failed to fetch projects.");
              }
            } else {
              toast.error("Unable to fetch your expert ID.");
            }
          } else {
            toast.error("Failed to fetch expert data.");
          }
        } else {
          toast.error("Failed to fetch user profile.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("An error occurred while fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 p-6 flex justify-center items-center">
        <p>Loading...</p>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">My Projects</h1>
      {projects.length > 0 ? (
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-white mb-2">{project.title}</h2>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <p><strong>Start Date:</strong> {project.startDate}</p>
              <p><strong>End Date:</strong> {project.endDate}</p>
              <p><strong>Status:</strong> {project.currentStatus}</p>
              {/* Include other project details as needed */}
            </div>
          ))}
        </div>
      ) : (
        <p>No projects found.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ExpertProjectsPage;
