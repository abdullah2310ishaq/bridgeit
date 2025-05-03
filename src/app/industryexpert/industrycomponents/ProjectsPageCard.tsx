"use client"

import type React from "react"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  projectId: string
  title: string
  description: string
  endDate: string
  status?: string
}

const ProjecttCard: React.FC<ProjectCardProps> = ({ projectId, title, description, endDate, status }) => {
  const router = useRouter()

  // A few random background gradients for visual variety
  const gradientStyles = [
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
    "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500",
    "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
  ]

  // Get a random gradient for each project (but keep it consistent)
  const getGradient = (id: string) => {
    // Use the last character of the ID as a simple hash
    const index = id.charCodeAt(id.length - 1) % gradientStyles.length
    return gradientStyles[index]
  }

  const handleCardClick = () => {
    router.push(`/industryexpert/projects/milestone/${projectId}`)
  }

  return (
    <div
      className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden cursor-pointer ${getGradient(projectId)}`}
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
      <div className="relative z-10">
        {/* Project Title */}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

        {/* Project Description */}
        <p className="text-gray-200 mb-2">{description}</p>

        {/* End Date */}
        <p className="text-gray-300 mb-1">
          <strong>End Date:</strong> {endDate}
        </p>

        {/* Status Badge (only shown if status is provided) */}
        {status && (
          <div className="mt-2 mb-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                status === "Completed" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"
              }`}
            >
              {status}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjecttCard
