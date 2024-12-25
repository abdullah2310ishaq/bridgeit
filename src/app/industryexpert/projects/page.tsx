"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjecttCard from "../industrycomponents/ProjectsPageCard";

interface Project {
  id: string;
  title: string;
  description: string;
  endDate: string;
}

const ExpertProjectsPage: React.FC = () => {
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"assigned" | "unassigned">("assigned");
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch expert ID
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!profileResponse.ok) throw new Error("Failed to fetch user info");
        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        // Fetch expert profile
        const expertResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile");
        const expertData = await expertResponse.json();

        // Fetch assigned projects
        const assignedResponse = await fetch(
          `https://localhost:7053/api/projects/get-assigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (assignedResponse.ok) {
          const assignedData = await assignedResponse.json();
          setAssignedProjects(assignedData);
        } else {
          throw new Error("Failed to fetch assigned projects");
        }

        // Fetch unassigned projects
        const unassignedResponse = await fetch(
          `https://localhost:7053/api/projects/get-unassigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (unassignedResponse.ok) {
          const unassignedData = await unassignedResponse.json();
          setUnassignedProjects(unassignedData);
        } else {
          throw new Error("Failed to fetch unassigned projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`py-2 px-4 rounded-lg ${
            activeTab === "assigned" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Assigned Projects
        </button>
        <button
          onClick={() => setActiveTab("unassigned")}
          className={`py-2 px-4 rounded-lg ${
            activeTab === "unassigned" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Unassigned Projects
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "assigned"
          ? assignedProjects.map((project) => (
              <ProjecttCard
                key={project.id}
                projectId={project.id}
                title={project.title}
                description={project.description}
                endDate={project.endDate}
              />
            ))
          : unassignedProjects.map((project) => (
              <ProjecttCard
                key={project.id}
                projectId={project.id}
                title={project.title}
                description={project.description}
                endDate={project.endDate}
              />
            ))}
      </div>
    </div>
  );
};

export default ExpertProjectsPage;
