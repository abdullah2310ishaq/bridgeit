"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface StudentDetails {
  id: string
  firstName: string
  lastName: string
  email: string
  universityName: string
  department: string
  skills: string[]
  address: string
  rollNumber: string
  imageData: string | null
  uniImage: string | null // The university image
  description: string
}

const StudentProfilePage: React.FC = () => {
  const { id } = useParams()
  const router = useRouter()

  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const response = await fetch(`https://localhost:7053/api/get-student/student-by-id/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch student details.")

        const data = await response.json()
        setStudentDetails(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchStudentDetails()
  }, [id, router])

  // Utility to format image data as a proper data URI if needed
  const formatImageSrc = (imageData: string | null) =>
    imageData
      ? imageData.startsWith("data:image")
        ? imageData
        : `data:image/jpeg;base64,${imageData}`
      : "/default-profile.jpg"

  // Fallback text
  const notAvailable = (value: string | undefined) => (value ? value : "Not Available")

  // Loading / Error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-xl font-semibold">Loading project details...</span>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    )
  }
  if (!studentDetails) {
    return <p className="text-gray-300">No student found</p>
  }

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600">
          {studentDetails.firstName} {studentDetails.lastName}
        </h1>
        <p className="text-lg text-gray-600 mt-2">{notAvailable(studentDetails.email)}</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Panel: Profile Image & Basic Info */}
        <motion.div
          className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Image */}
          <motion.div
            className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.4 }}
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={formatImageSrc(studentDetails.imageData) || "/placeholder.svg"}
              alt={`${studentDetails.firstName} ${studentDetails.lastName}`}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Basic Contact Info */}
          <AnimatePresence>
            <motion.div
              className="text-center md:text-left space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {studentDetails.description && (
                <p className="text-sm text-gray-600 italic mt-2">{notAvailable(studentDetails.description)}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right Panel: University/Student Info, Skills, and Projects */}
        <motion.div
          className="w-full md:w-2/3 space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* University + Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Info */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 15px rgba(124, 58, 237, 0.4)",
              }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg font-bold text-blue-600 mb-2">University Details</h2>
              <p className="text-sm text-gray-700">
                University: <span className="font-medium">{notAvailable(studentDetails.universityName)}</span>
              </p>
              <p className="text-sm text-gray-700">
                Department: <span className="font-medium">{notAvailable(studentDetails.department)}</span>
              </p>
              <p className="text-sm text-gray-700">
                Address: <span className="font-medium">{notAvailable(studentDetails.address)}</span>
              </p>
            </motion.div>

            {/* Roll Number / Additional Student Info */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
              }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg font-bold text-blue-600 mb-2">Student Details</h2>
              <p className="text-sm text-gray-700">
                Roll Number: <span className="font-medium">{notAvailable(studentDetails.rollNumber)}</span>
              </p>
            </motion.div>
          </div>

          {/* Skills Section */}
          {studentDetails.skills && studentDetails.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-blue-600 mt-6 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {studentDetails.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="inline-block bg-blue-600 text-white py-1 px-3 rounded-full shadow-sm text-sm font-medium"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(59, 130, 246, 0.5)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
            >
              ✕
            </button>
            <img
              src={formatImageSrc(studentDetails.imageData) || "/placeholder.svg"}
              alt="Enlarged Profile"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentProfilePage

