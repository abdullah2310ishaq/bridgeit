"use client"
import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface CompletedIndustryProject {
  id: string
  title: string
  description: string
  expertName: string
  status: string
  endDate: string
}

interface Props {
  projects: CompletedIndustryProject[]
}

const CompletedIndustryProjectsSection: React.FC<Props> = ({ projects }) => {
  const router = useRouter()

  // Filter to include both Completed projects and PaymentPending projects
  // PaymentPending projects are essentially completed from the student's perspective
  // and are just waiting for the expert to make the payment
  const completedProjects = projects.filter(
    (project) => project.status === "Completed" || project.status === "PaymentPending",
  )

  const handleProjectClick = (projectId: string) => {
    router.push(`/student/projects/detail/${projectId}`)
  }

  return (
    <section className="py-16 bg-gray-200">
      <div className="max-w-7xl mx-auto mb-8 px-4">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Completed Industry Projects
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {completedProjects.length > 0 ? (
          completedProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white border border-gray-300 p-6 rounded-xl shadow-md hover:shadow-xl transition-transform cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <h3 className="text-xl font-bold text-green-800 mb-3">{project.title}</h3>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <p className="text-sm text-gray-600">
                <strong>Expert:</strong> {project.expertName}
              </p>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>End Date:</strong> {project.endDate}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No completed industry projects available.</p>
        )}
      </div>
    </section>
  )
}

export default CompletedIndustryProjectsSection
