"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

// Import your custom components
import IndustryProfile from "./industrycomponents/IndustryProfile"
import CompanyProfile from "./industrycomponents/CompanyProfile"
import ProjectCard from "./industrycomponents/ProjectsCardd"
import CompletedProjects from "./industrycomponents/CompletedProjects"
import CompletionRequestsComponent from "./completion-requests-component"

// Interface for the expert's main profile data
interface IndustryExpertProfile {
  userId: string
  indExptId: string
  companyId: string
  firstName: string
  lastName: string
  email: string
  description: string
  companyName: string
  address: string
  contact: string
  imageData: string
}

// Interface for each project
interface Project {
  id: string
  title: string
  description: string
  endDate: string
  name: string
  status: string
}

interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
}

const IndustryExpertPage: React.FC = () => {
  const router = useRouter()

  // Basic state
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null)
  const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([])
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completionRequests, setCompletionRequests] = useState<CompletionRequest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // For toggling between tabs
  const [activeTab, setActiveTab] = useState<"unassigned" | "assigned" | "completed" | "requests">("unassigned")

  const fetchCompletionRequests = useCallback(async (expertId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://localhost:7053/api/request-for-project-completion/get-completion-request/${expertId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store", // Ensure we don't get cached results
        },
      )

      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setCompletionRequests(data)
          return data
        } else {
          setCompletionRequests([])
          return []
        }
      } else {
        console.error("Failed to fetch completion requests:", res.status)
        setCompletionRequests([])
        return []
      }
    } catch (err) {
      console.error("Error fetching completion requests:", err)
      setCompletionRequests([])
      return []
    }
  }, [])

  const refreshCompletionRequests = useCallback(async () => {
    if (!expertProfile) return

    setIsRefreshing(true)
    try {
      await fetchCompletionRequests(expertProfile.indExptId)
    } finally {
      setIsRefreshing(false)
    }
  }, [expertProfile, fetchCompletionRequests])

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // 1) Fetch basic user info
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!profileResponse.ok) throw new Error("Failed to fetch profile.")

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // 2) Fetch the full industry-expert profile
        const expertResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile.")

        const expertData = await expertResponse.json()
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
        })

        // Fetch completion requests
        await fetchCompletionRequests(expertData.indExptId)

        // 3) Fetch "Assigned" Projects
        const assignedRes = await fetch(
          `https://localhost:7053/api/projects/get-assigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (assignedRes.ok) {
          const assignedData = await assignedRes.json()
          // Filter out completed projects from assigned projects
          const activeProjects = assignedData.filter((project: Project) => project.status !== "Completed")
          setAssignedProjects(activeProjects)
        }

        // 4) Fetch "Unassigned" Projects
        const unassignedRes = await fetch(
          `https://localhost:7053/api/projects/get-unassigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (unassignedRes.ok) {
          const unassignedData = await unassignedRes.json()
          setUnassignedProjects(unassignedData)
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndProjects()
  }, [router, fetchCompletionRequests])

  // Set up an interval to refresh completion requests periodically
  useEffect(() => {
    if (!expertProfile) return

    // Initial fetch
    fetchCompletionRequests(expertProfile.indExptId)

    // Set up interval for periodic refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      if (activeTab === "requests") {
        fetchCompletionRequests(expertProfile.indExptId)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [expertProfile, activeTab, fetchCompletionRequests])

  // Refresh completion requests when switching to the requests tab
  useEffect(() => {
    if (activeTab === "requests" && expertProfile) {
      fetchCompletionRequests(expertProfile.indExptId)
    }
  }, [activeTab, expertProfile, fetchCompletionRequests])

  if (loading) {
    return <div className="text-center p-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>
  }

  if (!expertProfile) {
    return <div className="text-center p-8">No profile found</div>
  }

  // For logging out
  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    router.push("/auth/login-user")
  }

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
            alert("Editing company not implemented yet.")
          }}
        />

        {/* (C) Tabs for Projects */}
        <div className="flex flex-wrap gap-2">
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
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-2 px-4 rounded-lg ${
              activeTab === "completed" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Completed Projects
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-2 px-4 rounded-lg ${
              activeTab === "requests" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Completion Requests
            {completionRequests.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {completionRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* (D) Project Lists */}
        {activeTab === "unassigned" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unassignedProjects.length > 0 ? (
              unassignedProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  projectId={proj.id}
                  title={proj.title}
                  description={proj.description}
                  endDate={proj.endDate}
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8 bg-gray-800 rounded-lg">
                No unassigned projects available
              </div>
            )}
          </div>
        )}

        {activeTab === "assigned" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedProjects.length > 0 ? (
              assignedProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  projectId={proj.id}
                  title={proj.title}
                  description={proj.description}
                  endDate={proj.endDate}
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8 bg-gray-800 rounded-lg">No active projects available</div>
            )}
          </div>
        )}

        {activeTab === "completed" && <CompletedProjects expertId={expertProfile.indExptId} />}

        {activeTab === "requests" && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Project Completion Requests</h2>
            <CompletionRequestsComponent requests={completionRequests} onRefresh={refreshCompletionRequests} />
          </div>
        )}

        {/* Logout button */}
        <div className="mt-10">
          <button onClick={handleLogout} className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default IndustryExpertPage
