"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  status: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }
      try {
        // Step 1: Fetch the authorized user info to get the userId
        const userResponse = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          // Step 2: Fetch the student's projects using the studentId
          const studentResponse = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            const studentId = studentData.id;

            const projectsResponse = await fetch(`https://localhost:7053/api/projects/get-student-projects-by-id/${studentId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (projectsResponse.ok) {
              const projectsData = await projectsResponse.json();
              setProjects(projectsData);
            } else {
              toast.error("Failed to load projects.", {
                position: "top-center",
                autoClose: 3000,
              });
            }
          } else {
            console.error("Failed to fetch student details.");
            router.push("/unauthorized");
          }
        } else {
          console.error("Failed to fetch user details.");
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("An error occurred while fetching projects.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Projects</h1>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <p className="text-gray-500">
                  <strong>Stack:</strong> {project.stack}
                </p>
                <p className="text-gray-500">
                  <strong>Status:</strong> {project.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center">No projects found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProjectsPage;
