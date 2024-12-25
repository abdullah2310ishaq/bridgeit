"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaRocket, FaCode, FaCheckCircle, FaSpinner } from "react-icons/fa";

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
        const userResponse = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

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

  const handleCardClick = (projectId: string) => {
    router.push(`/student/projects/personal/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl text-blue-500"
        >
          <FaSpinner />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 text-white p-8 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
        >
          My Innovative Projects
        </motion.h1>

        {projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleCardClick(project.id)} // Handle card click
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-lg">
                  {project.status}
                </div>
                <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h2>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex items-center text-gray-500 mb-2">
                  <FaCode className="mr-2" />
                  <span>{project.stack}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaCheckCircle className="mr-2" />
                  <span>{project.status}</span>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-300 text-center text-xl"
          >
            No projects found. Start creating your innovative projects!
          </motion.p>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 text-blue-400 opacity-20 animate-pulse">
        <FaRocket size={100} />
      </div>
      <div className="absolute bottom-20 left-10 text-purple-400 opacity-20 animate-pulse">
        <FaCode size={100} />
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProjectsPage;
