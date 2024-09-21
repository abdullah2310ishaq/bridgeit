"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";
import Navbar from "@/app/components/NavBar";
import { FaRobot } from "react-icons/fa"; // Import an AI-related icon
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

interface Project {
  id: string;
  title: string;
  description: string;
}

interface ExpertProject {
  studentName: string | undefined;
  expertName: string | undefined;
  status: string | undefined;
  stack: string | undefined;
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  isFeatured: boolean;
  matchScore: number;
}

interface Proposal {
  projectId: string; // The ID of the project for which a proposal is submitted
}

const ExploreProjects: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
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

            // Fetch proposals for the student to filter out projects they've already applied for
            const proposalsResponse = await fetch(
              `https://localhost:7053/api/project-proposals/get-proposal-for-student/${studentData.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (proposalsResponse.ok) {
              const proposalsData = await proposalsResponse.json();
              setProposals(proposalsData); // Store the proposals made by the student
            } else {
              setProposals([]);
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
            router.push("/unauthorized");
          }
        } else {
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
  }, [selectedFilter, expertProjects, searchQuery, proposals]);

  const filterProjects = () => {
    let sortedProjects = [...expertProjects];

    if (searchQuery) {
      sortedProjects = sortedProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter out projects where the student has already submitted a proposal
    const submittedProjectIds = proposals.map((proposal) => proposal.projectId);
    sortedProjects = sortedProjects.filter(
      (project) => !submittedProjectIds.includes(project.id)
    );

    switch (selectedFilter) {
      case "Most Recent":
        sortedProjects.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300">
      <Navbar />
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 pt-10">
        <div className="flex flex-col lg:flex-row w-full mt-4 relative">
          <ProfileCard 
            imageData={`data:image/jpeg;base64,${userProfile.imageData}`}
            firstName={userProfile.firstName}
            lastName={userProfile.lastName}
            role={userProfile.role}
          />
          <div className="flex flex-col w-full lg:w-3/4 pr-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 justify-between mb-8">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-3/4 lg:w-2/3 p-3 rounded-lg bg-gray-800 text-gray-300 shadow-md placeholder-gray-400"
              />
              <div className="flex space-x-4 sm:mt-0">
                <button
                  onClick={() => setSelectedFilter("Best Matched")}
                  className={`p-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    selectedFilter === "Best Matched"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Best Matches
                </button>
                <button
                  onClick={() => setSelectedFilter("Featured")}
                  className={`p-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    selectedFilter === "Featured"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setSelectedFilter("Most Recent")}
                  className={`p-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    selectedFilter === "Most Recent"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Most Recent
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
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
                    studentName={project.studentName}
                  />
                ))
              ) : (
                <p className="text-gray-400">No projects available.</p>
              )}
            </div>
          </div>
          <div className="hidden lg:flex lg:w-1/4"></div>
        </div>
      </div>
      
      {/* Floating Button for AI Help */}
      <button
        onClick={() => router.push("/ai-assist")} // This can be linked to a new AI recommendation page later
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center hover:bg-blue-700 transition-all duration-200"
      >
        <FaRobot className="mr-2 text-2xl" />
        Need AI Help?
      </button>
    </div>
  );
};

export default ExploreProjects;
