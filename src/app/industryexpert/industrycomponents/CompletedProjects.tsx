"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Calendar, FileText, Award, User } from "lucide-react"

interface CompletedProject {
  id: string
  title: string
  description: string
  studentName: string
  endDate: string
  status: string
}

interface CompletedProjectsProps {
  expertId: string
}

const CompletedProjects = ({ expertId }: CompletedProjectsProps) => {
  const router = useRouter()
  const [projects, setProjects] = useState<CompletedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch assigned projects that are completed
        const res = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-assigned-expert-projects?expertId=${expertId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!res.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await res.json()

        // Filter only completed projects
        const completedProjects = data.filter((project: CompletedProject) => project.status === "Completed")

        setProjects(completedProjects)
      } catch (err) {
        console.error("Error fetching completed projects:", err)
        setError("Failed to load completed projects")
      } finally {
        setLoading(false)
      }
    }

    if (expertId) {
      fetchCompletedProjects()
    }
  }, [expertId, router])

  const handleViewDetails = (projectId: string) => {
    router.push(`/industryexpert/projects/milestone/${projectId}`)
  }

  const handleViewReceipt = (projectId: string) => {
    router.push(`/industryexpert/payment-receipt/${projectId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-500">Loading completed projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Completed Projects</h3>
        <p className="text-gray-500">Projects will appear here once they are marked as completed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-600 flex items-center">
        <CheckCircle className="w-6 h-6 mr-2" />
        Completed Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white truncate">{project.title}</h3>
                <span className="bg-white text-green-600 text-xs px-2 py-1 rounded-full font-medium">Completed</span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">Student: {project.studentName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">Completed: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleViewDetails(project.id)}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm transition flex-1 flex items-center justify-center"
                >
                  <Award className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button
                  onClick={() => handleViewReceipt(project.id)}
                  className="py-2 px-3 bg-green-100 hover:bg-green-200 text-green-800 rounded text-sm transition flex-1 flex items-center justify-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  View Receipt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompletedProjects
