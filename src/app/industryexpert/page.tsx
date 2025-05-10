"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

// Import your custom components
import IndustryProfile from "./industrycomponents/IndustryProfile"
{/*import CompanyProfile from "./industrycomponents/CompanyProfile"*/}
import ProjectCard from "./industrycomponents/ProjectsCardd"
import CompletedProjects from "./industrycomponents/CompletedProjects"
import CompletionRequestsComponent from "./completion-requests-component"
import { Bell } from "lucide-react"

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
    <div className="min-h-screen bg-white text-gray-700 p-6">
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

        {/* (C) Tabs for Projects */}
         <div className="container mx-auto py-10">
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-full font-semibold ${activeTab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          onClick={() => setActiveTab("requests")}
        >
          Project Completion Requests
        </button>
      </div>

      {activeTab === "requests" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Project Completion Requests</h2>
            </div>

            {completionRequests.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {completionRequests.length} {completionRequests.length === 1 ? "Request" : "Requests"}
              </span>
            )}
          </div>

          {isRefreshing ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-blue-600 font-medium">Refreshing requests...</span>
            </div>
          ) : (
            <CompletionRequestsComponent requests={completionRequests} onRefresh={refreshCompletionRequests} />
          )}
        </div>
      )}
    </div>

        {/* Logout button 
        <div className="mt-10">
          <button onClick={handleLogout} className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500">
            Logout
          </button>
        </div>*/}
      </div>
    </div>
  )
}

export default IndustryExpertPage
