"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";
import Navbar from "@/app/components/NavBar";
import { FaRobot } from "react-icons/fa";
import { FiSearch, FiFilter } from "react-icons/fi";
import ProjectCard from "./ExploreProjectCard";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  universityName: string;
  address: string;
  rollNumber: string;
  imageData: string;
}

interface ExpertProject {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertId?: string; // Add expertId to the project
  expertName?: string;
  companyName?: string;
  isFeatured?: boolean;
  matchScore?: number;
  createdAt?: string;
}

const ExploreProjects: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndProjects() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch User Profile
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

          const studentResponse = await fetch(
            `https://localhost:7053/api/get-student/student-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();

            setUserProfile({
              userId: studentData.userId,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              role: profileData.role,
              email: studentData.email,
              universityName: studentData.universityName,
              address: studentData.address,
              rollNumber: studentData.rollNumber,
              imageData: studentData.imageData,
            });

            // Fetch Expert Projects
            const expertProjectsResponse = await fetch(
              "https://localhost:7053/api/projects/get-expert-projects",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (expertProjectsResponse.ok) {
              const expertProjectsData = await expertProjectsResponse.json();

              // Loop through projects and fetch the expert's name for each project
              const projectsWithExpertNames = await Promise.all(
                expertProjectsData.map(async (project: any) => {
                  let expertName = "";
                  let companyName = "";

                  if (project.indExpertId) {
                    // Fetch expert details using the expertId
                    const expertResponse = await fetch(
                      `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${project.indExpertId}`
                    );

                    if (expertResponse.ok) {
                      const expertData = await expertResponse.json();
                      expertName = `${expertData.firstName} ${expertData.lastName}`;
                      companyName = expertData.companyName;
                    }
                  }

                  return {
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    stack: project.stack,
                    status: project.currentStatus,
                    expertId: project.indExpertId, // Keep track of the expertId
                    expertName, // Add expertName from the fetched data
                    companyName, // Add companyName from the fetched data
                    isFeatured: project.isFeatured,
                    matchScore: project.matchScore,
                    createdAt: project.createdAt,
                  };
                })
              );

              setExpertProjects(projectsWithExpertNames);
              setFilteredProjects(projectsWithExpertNames);
            } else {
              setExpertProjects([]);
              setFilteredProjects([]);
            }
          } else {
            router.push("/unauthorized");
          }
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndProjects();
  }, [router]);

  useEffect(() => {
    filterProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, searchQuery, expertProjects]);

  const filterProjects = () => {
    let sortedProjects = [...expertProjects];

    if (searchQuery) {
      sortedProjects = sortedProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.companyName &&
            project.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    switch (selectedFilter) {
      case "Most Recent":
        sortedProjects.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case "Best Matches":
        sortedProjects.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case "Featured":
        sortedProjects = sortedProjects.filter((project) => project.isFeatured);
        break;
      default:
        break;
    }

    setFilteredProjects(sortedProjects);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-gray-800">
        <p className="text-gray-400 text-xl">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-gray-800">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-1/5 xl:w-1/6 bg-gray-800 p-6">
          {userProfile && (
            <ProfileCard
              imageData={`data:image/jpeg;base64,${userProfile.imageData}`}
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              role={userProfile.role}
            />
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            {/* Search Bar */}
            <div className="relative w-full lg:w-2/3 mb-4 lg:mb-0">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filter Options */}
            <div className="flex space-x-3 items-center">
              <FiFilter className="text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-gray-700 text-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Best Matches">Best Matches</option>
                <option value="Featured">Featured</option>
              </select>
            </div>
          </div>

          {/* Add Project Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => router.push("/student/add-project")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-colors duration-300"
            >
              Add New Project
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  stack={project.stack}
                  status={project.status}
                  expertName={project.expertName} // Pass expertName from fetched data
                  companyName={project.companyName} // Pass companyName from fetched data
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                No projects available.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating AI Help Button */}
      <button
        onClick={() => router.push("/student/ai-assist")}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 animate-bounce hover:scale-110 transition-transform duration-300"
      >
        <FaRobot className="text-2xl" />
        <span className="hidden sm:inline-block">AI Help?</span>
      </button>
    </div>
  );
};

export default ExploreProjects;
