"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileCard from "./ProfileCard";
import Navbar from "@/app/components/NavBar";
import { FaRobot } from "react-icons/fa";
import { FiSearch, FiFilter } from "react-icons/fi";
import ProjectCard from "./ExploreProjectCard";
import ProjectDetailsPanel from "../[id]/page";

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
  isRequested: any;
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  companyName?: string;
  isFeatured?: boolean;
  matchScore?: number;
  createdAt?: string;
  isRequested?: boolean;
}

const ExploreProjects: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<ExpertProject | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

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

            
              const formattedProjects: ExpertProject[] = expertProjectsData.map(
                (project: any) => ({
                  id: project.id,
                  title: project.title,
                  description: project.description,
                  stack: project.stack,
                  status: project.currentStatus,
                  expertName: project.name,
                  companyName: project.companyName,
                  isFeatured: project.isFeatured,
                  matchScore: project.matchScore,
                  createdAt: project.createdAt,
                  isRequested: project.isRequested,
                })
              );

              setExpertProjects(formattedProjects);
              setFilteredProjects(formattedProjects);
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

  // those requested not shown again to user 
    const filteredByRequestStatus = sortedProjects.filter(
      (project) => !project.isRequested
    );

    setFilteredProjects(filteredByRequestStatus);
  // those requested not shown again to user 
    const filteredByRequestStatus = sortedProjects.filter(
      (project) => !project.isRequested
    );

    setFilteredProjects(filteredByRequestStatus);
  };
  useEffect(() => {
    const projectIdFromUrl = searchParams.get("projectId");
    if (projectIdFromUrl) {
      setSelectedProjectId(projectIdFromUrl);
    }
  }, [searchParams]);

 
  useEffect(() => {
    if (selectedProjectId) {
      const project = expertProjects.find((p) => p.id === selectedProjectId);
      if (project) {
        setSelectedProjectDetails(project);
      } else {
     
        setSelectedProjectDetails(null);
      }
    } else {
      setSelectedProjectDetails(null);
    }
  }, [selectedProjectId, expertProjects]);

  const handleProjectClick = (id: string) => {
    setSelectedProjectId(id);
    router.push(`?projectId=${id}`, undefined);
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
        <main className="flex-1 flex">
          {/* Project List */}
          <div
            className={`p-6 ${
              selectedProjectDetails ? "w-full lg:w-1/2" : "w-full"
            }`}
          >
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              {/* Search Bar */}
              <div className="relative w-full lg:w-2/3 mb-4 lg:mb-0">
              <div className="relative w-full lg:w-2/3 mb-4 lg:mb-0">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Filter Options */}
              <div className="flex space-x-3 items-center">
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


            {/* Projects Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6`}
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    stack={project.stack}
                    expertName={project.expertName}
                    onClick={() => handleProjectClick(project.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400">
                  No projects available.
                <div className="col-span-full text-center text-gray-400">
                  No projects available.
                </div>
              )}
            </div>
          </div>

          {/* Project Details Panel */}
          {selectedProjectDetails && (
            <div className="w-full lg:w-1/2 p-6 bg-gray-800 overflow-auto">
              <ProjectDetailsPanel
                project={selectedProjectDetails}
                onClose={() => {
                  setSelectedProjectId(null);
                  router.push("", undefined);
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExploreProjects;
