"use client"

import type React from "react"
import { motion } from "framer-motion"

// Define the StudentProject interface here
interface StudentProject {
  id: string
  title: string
  status: string
  studentName: string
  expertName: string
  endDate: string
  universityName: string
}

interface StudentProjectsProps {
  loadingProjects: boolean
  projectsError: string | null
  studentProjects: StudentProject[]
}

const StudentProjects: React.FC<StudentProjectsProps> = ({ loadingProjects, projectsError, studentProjects }) => {
  return (
    <motion.div
      className="bg-gray-100 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
        Ongoing Student Projects
      </h2>

      {loadingProjects ? (
        <p className="text-gray-600">Loading student projects...</p>
      ) : projectsError ? (
        <p className="text-red-500">{projectsError}</p>
      ) : studentProjects.length === 0 ? (
        <p className="text-gray-600">No ongoing projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentProjects.map((project) => (
            <div key={project.id} className="bg-gray-200 p-4 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
              <p className="text-sm text-gray-700">Student: {project.studentName}</p>
              <p className="text-sm text-gray-700">Assigned Expert: {project.expertName}</p>
              <p className="text-sm text-gray-700">End Date: {project.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default StudentProjects
