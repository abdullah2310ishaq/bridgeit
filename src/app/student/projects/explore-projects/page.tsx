"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileCard from "./ProfileCard";
import Navbar from "@/app/components/NavBar";
import { FaRobot } from "react-icons/fa";
import { FiSearch, FiFilter } from "react-icons/fi";
import ProjectCard from "./ExploreProjectCard";
import ProposalModal from "../../stdcomps/ProposalModal";

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
  expertName?: string;
  companyName?: string;
  isFeatured?: boolean;
  matchScore?: number;
  createdAt?: string;
  expertImageData?: string;
}

const ExploreProjects: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<ExpertProject | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

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

          // Fetch student data by user ID
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

              // Format projects to include necessary fields
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
                  expertImageData: project.expertImageData,
                })
              );

              setExpertProjects(formattedProjects);
              setFilteredProjects(formattedProjects);

              // If there's a project ID in the URL, set it as the selected project
              if (projectId) {
                const selectedProject = formattedProjects.find(p => p.id === projectId);
                if (selectedProject) {
                  setSelectedProject(selectedProject);
                }
              }
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
  }, [router, projectId]);

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

    setFilteredProjects(sortedProjects);
  };

  const handleProjectSelect = (project: ExpertProject) => {
    setSelectedProject(project);
    router.push(`/student/projects/explore-projects?id=${project.id}`);
  };

  const handleCloseProjectDetails = () => {
    setSelectedProject(null);
    router.push('/student/projects/explore-projects');
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
        <main className="flex-1 flex overflow-hidden">
          {/* Left Side - Projects List */}
          <div className={`w-1/2 p-6 overflow-y-auto ${selectedProject ? 'hidden md:block' : 'w-full'}`}>
            {/* Search and Filters */}
            <div className="flex flex-col mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
              </div>

              {/* Filter Options */}
              <div className="flex items-center space-x-3">
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

            {/* Projects List */}
            <div className="space-y-6 overflow-y-auto h-[calc(100vh-300px)]">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    stack={project.stack}
                    status={project.status}
                    expertName={project.expertName}
                    studentName={project.companyName}
                    expertImageData={project.expertImageData}
                    onSelectProject={() => handleProjectSelect(project)}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-lg shadow-lg">
                  <p className="text-xl mb-4">No projects available.</p>
                  <p>Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Project Details */}
          {selectedProject && (
            <div className="w-1/2 p-6 overflow-y-auto bg-gray-800">
              <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-green-500 mb-4">{selectedProject.title}</h2>
                <p className="text-gray-300 mb-4">{selectedProject.description}</p>
                {selectedProject.stack && (
                  <p className="text-sm text-gray-400 mb-2">
                    <span className="font-semibold">Tech Stack:</span> {selectedProject.stack}
                  </p>
                )}
                {selectedProject.status && (
                  <p className="text-sm text-gray-400 mb-2">
                    <span className="font-semibold">Status:</span> {selectedProject.status}
                  </p>
                )}
                {selectedProject.expertName && (
                  <p className="text-sm text-gray-400 mb-2">
                    <span className="font-semibold">Expert:</span> {selectedProject.expertName}
                  </p>
                )}
                {selectedProject.companyName && (
                  <p className="text-sm text-gray-400 mb-2">
                    <span className="font-semibold">Company:</span> {selectedProject.companyName}
                  </p>
                )}
                <div className="mt-6 space-x-4">
                  <button
                    className="py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition-colors duration-300"
                    onClick={() => setShowModal(true)}
                  >
                    Submit Proposal
                  </button>
                  <button
                    className="py-2 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-300"
                    onClick={handleCloseProjectDetails}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating AI Help Button */}
      <button
        onClick={() => router.push("/student/ai-assist")}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 hover:scale-110 transition-all duration-300 group"
      >
        <FaRobot className="text-2xl group-hover:animate-bounce" />
        <span className="hidden sm:inline-block">AI Help</span>
      </button>

      {/* Proposal Modal */}
      {showModal && selectedProject && userProfile && (
        <ProposalModal
          projectId={selectedProject.id}
          studentId={userProfile.userId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ExploreProjects;