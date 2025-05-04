"use client"

import type React from "react"
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa"
import { motion } from "framer-motion"

interface UniversityStatsProps {
  studentsCount: number
  facultiesCount: number
}

const UniversityStats: React.FC<UniversityStatsProps> = ({ studentsCount, facultiesCount }) => {
  return (
    <>
      {/* University Overview: Students */}
      <motion.div
        className="bg-gray-100 rounded-lg shadow-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-4">
          Students
        </h3>
        <div className="flex items-center">
          <FaGraduationCap className="text-4xl text-blue-400 mr-4" />
          <div>
            <p className="text-3xl font-bold text-gray-700">{studentsCount}</p>
            <p className="text-gray-500">Total Enrolled</p>
          </div>
        </div>
      </motion.div>

      {/* University Overview: Faculties */}
      <motion.div
        className="bg-gray-100 rounded-lg shadow-lg p-6 border border-gray-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
          Faculties
        </h3>
        <div className="flex items-center">
          <FaChalkboardTeacher className="text-4xl text-green-400 mr-4" />
          <div>
            <p className="text-3xl font-bold text-gray-700">{facultiesCount}</p>
            <p className="text-gray-500">Total Faculty Members</p>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default UniversityStats
