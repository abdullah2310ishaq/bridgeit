"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IndustryProfile from "./industrycomponents/IndustryProfile";
import CompanyProfile from "./industrycomponents/CompanyProfile";
import ProjectCard from "./industrycomponents/ProjectsCardd";

interface IndustryExpertProfile {
  userId: string;
  indExptId: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  imageData: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  endDate: string;
  name: string;
}

const IndustryExpertPage: React.FC = () => {
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null);
  const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"unassigned" | "assigned">("unassigned");
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch Industry Expert Profile
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) throw new Error("Failed to fetch profile");

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        const expertResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!expertResponse.ok) throw new Error("Failed to fetch industry expert profile");

        const expertData = await expertResponse.json();
        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId,
          companyId: expertData.companyId,
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          email: expertData.email,
          companyName: expertData.companyName,
          address: expertData.address,
          contact: expertData.contact,
          imageData: expertData.imageData,
        });

        // Fetch Assigned Projects
        const assignedResponse = await fetch(
          `https://localhost:7053/api/projects/get-assigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (assignedResponse.ok) {
          const assignedData = await assignedResponse.json();
          setAssignedProjects(assignedData);
        } else {
          console.error("Failed to fetch assigned projects:", assignedResponse.statusText);
        }

        // Fetch Unassigned Projects
        const unassignedResponse = await fetch(
          `https://localhost:7053/api/projects/get-unassigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (unassignedResponse.ok) {
          const unassignedData = await unassignedResponse.json();
          setUnassignedProjects(unassignedData);
        } else {
          console.error("Failed to fetch unassigned projects:", unassignedResponse.statusText);
        }
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Failed to fetch data:", error);
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndProjects();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/auth/login-user");
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!expertProfile) {
    return <div className="text-center text-gray-400">No profile found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="bg-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">Industry Expert Dashboard</h1>
          <ul className="flex space-x-6">
            <li>
              <button
                onClick={() => router.push("/industryexpert/notifications")}
                className="text-gray-500 hover:text-blue-600 transition"
              >
                Notifications
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-8">
        {/* Industry Expert Profile Section */}
        <IndustryProfile
          companyLogo={expertProfile.imageData}
          companyName={expertProfile.companyName}
          userId={expertProfile.userId}
          indExptId={expertProfile.indExptId}
          companyId={expertProfile.companyId}
          firstName={expertProfile.firstName}
          lastName={expertProfile.lastName}
          email={expertProfile.email}
          address={expertProfile.address}
          contact={expertProfile.contact}
          onViewProjects={() => {}}
          onEditProfile={() => {}}
          onAddProjects={() => {}}
        />

        {/* Company Profile Section */}
        <CompanyProfile
          companyName={expertProfile.companyName}
          address={expertProfile.address}
          contact={expertProfile.contact}
          onEditCompany={() => {}}
        />

        {/* Tabs for Assigned and Unassigned Projects */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("unassigned")}
            className={`py-2 px-4 rounded-lg ${
              activeTab === "unassigned" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Unassigned Projects
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`py-2 px-4 rounded-lg ${
              activeTab === "assigned" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Assigned Projects
          </button>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "unassigned"
            ? unassignedProjects.map((project) => (
                <ProjectCard
                key={project.id}
                projectId={project.id}
                title={project.title}
                description={project.description}
                endDate={project.endDate} name={""}                />
              ))
            : assignedProjects.map((project) => (
                <ProjectCard
                key={project.id}
                projectId={project.id}
                title={project.title}
                description={project.description}
                endDate={project.endDate} name={""}           
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default IndustryExpertPage;
