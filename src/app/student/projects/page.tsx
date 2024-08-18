"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  status: string;
  studentName: string;
  indExpertName: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const response = await fetch("https://localhost:7053/api/projects/get-all-projects", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          toast.error("Failed to load projects.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error("An error occurred while fetching projects.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [router]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Explore Our Projects
        </h1>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="relative bg-gray-800 p-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-10 rounded-xl"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
                    <p className="text-gray-400 mb-6">{project.description}</p>
                    <div className="text-gray-500 mb-2">
                      <span className="font-semibold">Stack:</span> {project.stack}
                    </div>
                    <div className="text-gray-500 mb-2">
                      <span className="font-semibold">Status:</span> {project.status}
                    </div>
                    <div className="text-gray-500 mb-2">
                      <span className="font-semibold">Student:</span> {project.studentName}
                    </div>
                    <div className="text-gray-500">
                      <span className="font-semibold">Industry Expert:</span> {project.indExpertName}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center mt-20">No projects found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProjectsPage;
