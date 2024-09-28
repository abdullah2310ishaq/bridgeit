"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRobot, FaProjectDiagram, FaUser, FaSun, FaMoon, FaSearch, FaCheckCircle, FaExclamationCircle, FaUserTie, FaUserGraduate, FaCode, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

// Interface Definitions
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
  studentName?: string;
  expertName?: string;
  status?: string;
  stack?: string;
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

// Main Component
const ExploreProjects: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  // Fetch User Profile and Projects
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

  // Filter Projects based on Search, Filter, and Proposals
  useEffect(() => {
    filterProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Best Matches":
        sortedProjects.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case "Featured":
        sortedProjects = sortedProjects.filter((project) => project.isFeatured);
        break;
      case "Completed":
      case "Pending":
      case "Ongoing":
        sortedProjects = sortedProjects.filter(
          (project) => project.status?.toLowerCase() === selectedFilter.toLowerCase()
        );
        break;
      default:
        break;
    }

    setFilteredProjects(sortedProjects);
  };

  // Internal Components

  // Navbar Component
  const Navbar: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [darkMode]);

    return (
      <nav className="bg-white dark:bg-gray-900 shadow-lg fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ProjectExplorer
            </span>
            <button
              onClick={() => router.push("/student/explore-projects")}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <FaProjectDiagram className="mr-1" /> Explore Projects
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/student/profile")}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <FaUser className="mr-1" /> Profile
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </nav>
    );
  };

  // ProfileCard Component
  const ProfileCard: React.FC<{ user: UserProfile }> = ({ user }) => {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center w-full lg:w-1/4 mb-6 lg:mb-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={`data:image/jpeg;base64,${user.imageData}`}
          alt={`${user.firstName} ${user.lastName}`}
          width={150}
          height={150}
          className="rounded-full mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{`${user.firstName} ${user.lastName}`}</h2>
        <p className="text-gray-600 dark:text-gray-400">{user.role}</p>
        <div className="mt-4 w-full">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{user.email}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">University:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{user.universityName}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Address:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{user.address}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Roll Number:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">{user.rollNumber}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // SearchBar Component
  const SearchBar: React.FC<{ searchQuery: string; setSearchQuery: (query: string) => void }> = ({ searchQuery, setSearchQuery }) => {
    return (
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />
      </motion.div>
    );
  };

  // FilterPanel Component
  const FilterPanel: React.FC<{ selectedFilter: string; setSelectedFilter: (filter: string) => void; availableFilters: string[] }> = ({
    selectedFilter,
    setSelectedFilter,
    availableFilters,
  }) => {
    return (
      <motion.div
        className="flex space-x-2 overflow-x-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {availableFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>
    );
  };

  // ProjectCard Component
  const ProjectCard: React.FC<ExpertProject> = ({
    id,
    title,
    description,
    stack,
    status,
    expertName,
    studentName,
  }) => {
    const handleViewDetails = () => {
      router.push(`/student/projects/${id}`);
    };

    const renderStatusBadge = (status: string | undefined) => {
      if (!status) return null;

      const statusClass =
        status.toLowerCase() === "completed"
          ? "bg-green-500 text-green-100"
          : status.toLowerCase() === "pending"
          ? "bg-yellow-500 text-yellow-100"
          : "bg-red-500 text-red-100";

      const statusIcon =
        status.toLowerCase() === "completed" ? (
          <FaCheckCircle className="mr-1" />
        ) : status.toLowerCase() === "pending" ? (
          <FaExclamationCircle className="mr-1" />
        ) : null;

      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
          {statusIcon} {status}
        </span>
      );
    };

    return (
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div>
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{description}</p>
          {stack && (
            <div className="flex items-center mb-2">
              <FaCode className="text-gray-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">{stack}</span>
            </div>
          )}
          {status && <div className="mb-2">{renderStatusBadge(status)}</div>}
          {expertName && (
            <div className="flex items-center mb-2">
              <FaUserTie className="text-blue-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">Expert: {expertName}</span>
            </div>
          )}
          {studentName && (
            <div className="flex items-center">
              <FaUserGraduate className="text-green-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">Student: {studentName}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleViewDetails}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </button>
      </motion.div>
    );
  };

  // AIButton Component
  const AIButton: React.FC = () => {
    const handleClick = () => {
      router.push("/student/ai-assist");
    };

    return (
      <motion.button
        onClick={handleClick}
        className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors duration-200"
        aria-label="AI Assistance"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <FaRobot className="text-2xl" />
        <span className="hidden sm:inline">AI Assist</span>
      </motion.button>
    );
  };

  // Main Render
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileCard user={userProfile} />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <FilterPanel
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                availableFilters={[
                  "Most Recent",
                  "Best Matches",
                  "Featured",
                 
                ]}
              />
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
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
                    studentName={project.studentName} type={""} createdAt={""} isFeatured={false} matchScore={0}                  />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No projects found.</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <AIButton />
    </div>
  );
};

export default ExploreProjects;
