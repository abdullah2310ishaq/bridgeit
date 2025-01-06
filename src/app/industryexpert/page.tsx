"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import your custom components
import IndustryProfile from "./industrycomponents/IndustryProfile";
import CompanyProfile from "./industrycomponents/CompanyProfile";
import ProjectCard from "./industrycomponents/ProjectsCardd";

// Interface for the expert's main profile data
interface IndustryExpertProfile {
  userId: string;
  indExptId: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  description:string;
  companyName: string;
  address: string;
  contact: string;
  imageData: string;
}

// Interface for each project
interface Project {
  id: string;
  title: string;
  description: string;
  endDate: string;
  name: string;
}

const IndustryExpertPage: React.FC = () => {
  const router = useRouter();

  // Basic state
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null);
  const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For toggling between “unassigned” & “assigned”
  const [activeTab, setActiveTab] = useState<"unassigned" | "assigned">("unassigned");

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // 1) Fetch basic user info
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!profileResponse.ok) throw new Error("Failed to fetch profile.");

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        // 2) Fetch the full industry-expert profile
        const expertResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile.");

        const expertData = await expertResponse.json();
        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId,
          companyId: expertData.companyId,
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          description: expertData.description,
          email: expertData.email,
          companyName: expertData.companyName,
          address: expertData.address,
          contact: expertData.contact,
          imageData: expertData.imageData,
        });

        // 3) Fetch “Assigned” Projects
        const assignedRes = await fetch(
          `https://localhost:7053/api/projects/get-assigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (assignedRes.ok) {
          const assignedData = await assignedRes.json();
          setAssignedProjects(assignedData);
        }

        // 4) Fetch “Unassigned” Projects
        const unassignedRes = await fetch(
          `https://localhost:7053/api/projects/get-unassigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (unassignedRes.ok) {
          const unassignedData = await unassignedRes.json();
          setUnassignedProjects(unassignedData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data");
        // Potentially route to "unauthorized" page if needed
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndProjects();
  }, [router]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  if (!expertProfile) {
    return <div className="text-center text-gray-400">No profile found</div>;
  }

  // For logging out
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/auth/login-user");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="container mx-auto space-y-8">
        {/* (A) Industry Expert Profile Section */}
        <IndustryProfile
          companyLogo={expertProfile.imageData}
          companyName={expertProfile.companyName}
          userId={expertProfile.userId}
          indExptId={expertProfile.indExptId}
          companyId={expertProfile.companyId}
          firstName={expertProfile.firstName}
          lastName={expertProfile.lastName}
          description={expertProfile.description}
          email={expertProfile.email}
          address={expertProfile.address}
          contact={expertProfile.contact}
        />

        {/* (B) Company Profile Section */}
        <CompanyProfile
          companyName={expertProfile.companyName}
          address={expertProfile.address}
          contact={expertProfile.contact}
          onEditCompany={() => {
            // Placeholder for editing company details
            alert("Editing company not implemented yet.");
          }}
        />

        {/* (C) Tabs for “Assigned” / “Unassigned” Projects */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("unassigned")}
            className={`py-2 px-4 rounded-lg ${
              activeTab === "unassigned"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Unassigned Projects
          </button>
          <button
            onClick={() => setActiveTab("assigned")}
            className={`py-2 px-4 rounded-lg ${
              activeTab === "assigned"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Assigned Projects
          </button>
        </div>

        {/* (D) List Projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "unassigned"
            ? unassignedProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  projectId={proj.id}
                  title={proj.title}
                  description={proj.description}
                  endDate={proj.endDate}
                />
              ))
            : assignedProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  projectId={proj.id}
                  title={proj.title}
                  description={proj.description}
                  endDate={proj.endDate}
                />
              ))}
        </div>

        {/* Example: Logout button (optional) */}
        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryExpertPage;
