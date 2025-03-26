"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileCard from "./ProfileCard";
import ProjectCard from "./ExploreProjectCard";
import { ToastContainer } from "react-toastify"; // to display toasts
import { Search as SearchIcon, Filter, ChevronDown } from "lucide-react";
import ProjectDetailsPanel from "../[id]/ProjectDetailsPanel";

// Interfaces
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
  skills?: string[];
}

interface ExpertProject {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  studentName?: string;
  budget?: number;
  companyName?: string;
  matchScore?: number;
  createdAt?: string;
  isRequested?: boolean;
}

interface Proposal {
  id: string;
  projectId: string;
  studentId: string;
  status: string; // "Pending", "Accepted", "Rejected"
}

const ExploreProjects: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([]);
  const [studentProposals, setStudentProposals] = useState<Proposal[]>([]);

  const [selectedFilter, setSelectedFilter] = useState("Most Recent");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Project details
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<ExpertProject | null>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // 1) Fetch user info
        const profileRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) {
          router.push("/unauthorized");
          return;
        }
        const profileData = await profileRes.json();
        const userId = profileData.userId;

        // 2) Fetch extended student data
        const studentRes = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!studentRes.ok) {
          router.push("/unauthorized");
          return;
        }
        const studentData = await studentRes.json();

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
          skills: studentData.skills,
        });

        // 3) Fetch the student’s proposals
        const proposalsRes = await fetch(
          `https://localhost:7053/api/project-proposals/get-proposal-for-student/${studentData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (proposalsRes.ok) {
          const proposalsData = await proposalsRes.json();
          setStudentProposals(proposalsData);
        } else {
          console.log("No proposals or could not fetch proposals");
        }

        // 4) Fetch Expert Projects
        const projectsRes = await fetch("https://localhost:7053/api/projects/get-expert-projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectsRes.ok) {
          setError("Failed to load projects.");
          return;
        }
        const projectsData = await projectsRes.json();

        // 5) For each project, optionally call Python /predict to compute matchScore
        const updatedProjects: ExpertProject[] = [];
        for (const proj of projectsData) {
          const projectObj: ExpertProject = {
            id: proj.id,
            title: proj.title,
            description: proj.description,
            stack: proj.stack,
            status: proj.currentStatus,
            expertName: proj.name,
            studentName: proj.studentName,
            budget: proj.budget,
            companyName: proj.companyName,
            matchScore: 0,
            createdAt: proj.createdAt,
            isRequested: proj.isRequested,
          };

          // (optional) Python skill prediction
          try {
            const pythonResp = await fetch(
              `http://127.0.0.1:5000/predict?project_title=${encodeURIComponent(
                projectObj.title
              )}`
            );
            if (pythonResp.ok) {
              const result = await pythonResp.json();
              const predictedSkills: string[] = result.skills || [];
              // Compare with student's known skills
              const studentSkillsSet = new Set(
                studentData.skills?.map((s: string) => s.toLowerCase()) || []
              );
              const overlap = predictedSkills.filter((skill: string) =>
                studentSkillsSet.has(skill.toLowerCase())
              );
              projectObj.matchScore = overlap.length;
            }
          } catch (err) {
            console.error("Error calling Python API for project:", proj.title, err);
          }
          updatedProjects.push(projectObj);
        }

        setExpertProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
      } catch (err) {
        console.error("An error occurred:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // Filter logic
  useEffect(() => {
    filterProjects();
  }, [selectedFilter, searchQuery, expertProjects]);

  const filterProjects = () => {
    let sorted = [...expertProjects];

    // Searching
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      sorted = sorted.filter(
        (proj) =>
          proj.title.toLowerCase().includes(q) ||
          proj.description.toLowerCase().includes(q) ||
          (proj.companyName && proj.companyName.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (selectedFilter) {
      case "Most Recent":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case "Best Matches":
        sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      default:
        break;
    }

    // Optionally exclude isRequested
    sorted = sorted.filter((p) => !p.isRequested);

    setFilteredProjects(sorted);
  };

  // Check for pending proposals
  function hasPendingProposal(projectId: string): boolean {
    return studentProposals.some(
      (proposal) => proposal.projectId === projectId && proposal.status === "Pending"
    );
  }

  // Handle project selection
  useEffect(() => {
    const idFromUrl = searchParams.get("projectId");
    if (idFromUrl) {
      setSelectedProjectId(idFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedProjectId) {
      const found = expertProjects.find((p) => p.id === selectedProjectId);
      setSelectedProjectDetails(found || null);
    } else {
      setSelectedProjectDetails(null);
    }
  }, [selectedProjectId, expertProjects]);

  const handleProjectClick = (id: string) => {
    setSelectedProjectId(id);
    router.push(`?projectId=${id}`);
    // If you want to open a proposal modal, do it here
  };

  // Render
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
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-gray-900 text-gray-300">
      <div className="flex flex-1">
        {/* Sidebar with Profile */}
        <aside className="hidden lg:block lg:w-1/5 xl:w-1/6 bg-gray-900 p-6">
          {userProfile && (
            <ProfileCard
              imageData={`data:image/jpeg;base64,${userProfile.imageData}`}
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              role={userProfile.role}
              skills={userProfile.skills}
            />
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex">
          <div className={`p-6 ${selectedProjectDetails ? "w-full lg:w-1/2" : "w-full"}`}>
            {/* Search & Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="relative w-full lg:w-2/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out hover:bg-gray-600"
                />
              </div>

              <div className="relative w-full lg:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-full bg-gray-700 text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out hover:bg-gray-600"
                >
                  <option value="Most Recent">Most Recent</option>
                  <option value="Best Matches">Best Matches</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const pending = hasPendingProposal(project.id);
                  return (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      stack={project.stack}
                      status={project.status}
                      expertName={project.expertName}
                      studentName={project.studentName}
                      budget={project.budget}
                      hasPending={pending}
                      onClick={() => {
                        if (!pending) {
                          handleProjectClick(project.id);
                          // e.g., open a <ProposalModal /> here
                        }
                      }}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center text-gray-400">
                  No projects available.
                </div>
              )}
            </div>
          </div>

          {/* Project Details Panel */}
          {selectedProjectDetails && (
            <div className="w-full lg:w-1/2 p-6 bg-gray-900 overflow-auto">
              <ProjectDetailsPanel
                project={selectedProjectDetails}
                onClose={() => {
                  setSelectedProjectId(null);
                  router.push("");
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ExploreProjects;
