"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";
import ProjectCard from "./ExploreCard";
import Navbar from "@/app/components/NavBar";

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

interface Project {
  id: string;
  title: string;
  description: string;
}

interface ExpertProject {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  isFeatured: boolean;
  matchScore: number;
}

const ExploreProjects: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndProjects() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
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

            // Fetch student projects
            const projectsResponse = await fetch(
              `https://localhost:7053/api/projects/get-student-projects-by-id/${studentData.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (projectsResponse.ok) {
              const projectsData = await projectsResponse.json();
              setProjects(projectsData.slice(0, 2));
            } else {
              setProjects([]);
            }

            // Fetch expert projects
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
              setExpertProjects(expertProjectsData);
              setFilteredProjects(expertProjectsData);
            } else {
              setExpertProjects([]);
            }
          } else {
            console.error("Failed to fetch student profile.");
            router.push("/unauthorized");
          }
        } else {
          console.error("Failed to fetch user profile.");
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        router.push("/unauthorized");
      }
    }

    fetchProfileAndProjects();
  }, [router]);

  useEffect(() => {
    filterProjects();
  }, [selectedFilter, expertProjects, searchQuery]);

  const filterProjects = () => {
    let sortedProjects = [...expertProjects];

    // Apply the search filter
    if (searchQuery) {
      sortedProjects = sortedProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply the selected filter
    switch (selectedFilter) {
      case "Most Recent":
        sortedProjects.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Best Matched":
        sortedProjects.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case "Featured":
        sortedProjects = sortedProjects.filter((project) => project.isFeatured);
        break;
      default:
        break;
    }

    setFilteredProjects(sortedProjects);
  };

  if (!userProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
     
      <Navbar />
      
      {/* Main Container with padding to prevent overlap with Navbar */}
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 pt-10">
        
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row w-full mt-4 relative">
          {/* Profile Section Positioned Correctly */}
          <ProfileCard 
       imageData={`data:image/jpeg;base64,${userProfile.imageData}`}
       firstName={userProfile.firstName}
       lastName={userProfile.lastName}
       role={userProfile.role}
          />
          
          {/* Main Content */}
          <div className="flex flex-col w-full lg:w-3/4 pr-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-start gap-4 justify-between mb-8">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-3/4 lg:w-2/3 p-3 rounded-lg bg-gray-800 text-gray-300 shadow-md"
              />
              <div className="flex space-x-4 sm:mt-0">
                <button
                  onClick={() => setSelectedFilter("Best Matched")}
                  className={`p-2 rounded-md text-sm font-semibold ${
                    selectedFilter === "Best Matched"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Best Matches
                </button>
                <button
                  onClick={() => setSelectedFilter("Featured")}
                  className={`p-2 rounded-md text-sm font-semibold ${
                    selectedFilter === "Featured"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setSelectedFilter("Most Recent")}
                  className={`p-2 rounded-md text-sm font-semibold ${
                    selectedFilter === "Most Recent"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Most Recent
                </button>
              </div>
            </div>
    
            {/* Projects Display */}
            <div className="flex flex-col gap-4">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                  />
                ))
              ) : (
                <p className="text-gray-400">No projects available.</p>
              )}
            </div>
          </div>
    
          {/* Sidebar (Placeholder for additional content if needed) */}
          <div className="hidden lg:flex lg:w-1/4"></div>
        </div>
      </div>
    </div>
  );
  
  
  
};

export default ExploreProjects;
