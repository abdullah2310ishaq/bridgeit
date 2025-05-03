"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProjecttCard from "../industrycomponents/ProjectsPageCard"

interface Project {
  id: string
  title: string
  description: string
  endDate: string
  status?: string
}

const ExpertProjectsPage: React.FC = () => {
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([])
  const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([])
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<"assigned" | "unassigned" | "completed">("assigned")
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        // Fetch expert ID
        const profileResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!profileResponse.ok) throw new Error("Failed to fetch user info")
        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // Fetch expert profile
        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile")
        const expertData = await expertResponse.json()

        // Fetch all assigned projects
        const assignedResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-assigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (assignedResponse.ok) {
          const allAssignedData = await assignedResponse.json()

          // Filter out completed projects
          const activeProjects = allAssignedData.filter(
            (project: Project) => project.status !== "Completed" && project.status !== "PaymentPending",
          )

          // Filter completed projects
          const completed = allAssignedData.filter(
            (project: Project) => project.status === "Completed" || project.status === "PaymentPending",
          )

          setAssignedProjects(activeProjects)
          setCompletedProjects(completed)
        } else {
          throw new Error("Failed to fetch assigned projects")
        }

        // Fetch unassigned projects
        const unassignedResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-unassigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (unassignedResponse.ok) {
          const unassignedData = await unassignedResponse.json()
          setUnassignedProjects(unassignedData)
        } else {
          throw new Error("Failed to fetch unassigned projects")
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`py-2 px-4 rounded-lg ${
            activeTab === "assigned" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Active Projects
        </button>
        <button
          onClick={() => setActiveTab("unassigned")}
          className={`py-2 px-4 rounded-lg ${
            activeTab === "unassigned" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Unassigned Projects
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`py-2 px-4 rounded-lg ${
            activeTab === "completed" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Completed Projects
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "assigned" && assignedProjects.length > 0 ? (
          assignedProjects.map((project) => (
            <ProjecttCard
              key={project.id}
              projectId={project.id}
              title={project.title}
              description={project.description}
              endDate={project.endDate}
            />
          ))
        ) : activeTab === "unassigned" && unassignedProjects.length > 0 ? (
          unassignedProjects.map((project) => (
            <ProjecttCard
              key={project.id}
              projectId={project.id}
              title={project.title}
              description={project.description}
              endDate={project.endDate}
            />
          ))
        ) : activeTab === "completed" && completedProjects.length > 0 ? (
          completedProjects.map((project) => (
            <ProjecttCard
              key={project.id}
              projectId={project.id}
              title={project.title}
              description={project.description}
              endDate={project.endDate}
              status={project.status}
            />
          ))
        ) : (
          <div className="col-span-full text-center p-8 bg-gray-800 rounded-lg">
            {activeTab === "assigned"
              ? "No active projects available"
              : activeTab === "unassigned"
                ? "No unassigned projects available"
                : "No completed projects available"}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpertProjectsPage
