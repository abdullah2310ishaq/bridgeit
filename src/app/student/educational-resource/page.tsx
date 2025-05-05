"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { motion } from "framer-motion"

interface EducationalResource {
  id: string
  title: string
  content: string
  sourceLink: string
  facultyId: string
  facultyName: string
  facultyPost: string
  facultyDepartment: string
  universityId: string
  universityName: string
  universityLocation: string
  imageUrl?: string // Added for hardcoded images
}

const StudentEducationalResources = () => {
  const router = useRouter()
  const [resources, setResources] = useState<EducationalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "university">("all")
  const [universityId, setUniversityId] = useState<string | null>(null)

  // Hardcoded placeholder images (using Unsplash for high-quality visuals)
  const placeholderImages = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1501504901893-7f44a978966d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1516761497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
  ]

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("jwtToken")
        if (!token) {
          router.push("/auth/login-user")
          return
        }

        // Fetch user profile to get university ID
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // Get student details
        const studentResponse = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!studentResponse.ok) {
          throw new Error("Failed to fetch student details")
        }

        const studentData = await studentResponse.json()
        const uniId = studentData.universityId
        setUniversityId(uniId)

        // Get all resources
        const allResourcesResponse = await fetch(
          "https://localhost:7053/api/educational-resources/get-all",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!allResourcesResponse.ok) {
          throw new Error("Failed to fetch educational resources")
        }

        const allResourcesData = await allResourcesResponse.json()

        // If we have university ID, also get university-specific resources
        let combinedResources: EducationalResource[] = allResourcesData
        if (uniId) {
          const uniResourcesResponse = await fetch(
            `https://localhost:7053/api/educational-resources/get-by-id/${uniId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (uniResourcesResponse.ok) {
            const uniResourcesData = await uniResourcesResponse.json()
            combinedResources = [...allResourcesData, ...uniResourcesData]
          }
        }

        // Deduplicate resources and add random placeholder images
        const uniqueResources = Array.from(
          new Map<string, EducationalResource>(combinedResources.map((item) => [item.id, item])).values()
        ).map((resource: EducationalResource, index: number) => ({
          ...resource,
          imageUrl: placeholderImages[index % placeholderImages.length],
        }))
        setResources(uniqueResources)
      } catch (error) {
        console.error("Error fetching resources:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
        toast.error(error instanceof Error ? error.message : "Failed to load resources")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [router])

  // Filter resources based on search term and filter type
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.universityName.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "university" && universityId) {
      return matchesSearch && resource.universityId === universityId
    }

    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold">Loading Resources...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-red-400">Error</h1>
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-semibold"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Educational Resources
        </h1>

        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All Resources
              </button>
              <button
                onClick={() => setFilter("university")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  filter === "university"
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                My University
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-12 shadow-lg text-center"
          >
            <svg
              className="mx-auto h-20 w-20 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold text-gray-300">No Resources Found</h2>
            <p className="mt-2 text-gray-400">
              {searchTerm
                ? "No resources match your search criteria."
                : filter === "university"
                ? "No resources available from your university."
                : "No educational resources available."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={resource.imageUrl || placeholderImages[0]}
                    alt={resource.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 text-green-400">{resource.title}</h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{resource.content}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">
                      {resource.facultyName}
                    </span>
                    <span className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm">
                      {resource.facultyDepartment}
                    </span>
                    <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-sm">
                      {resource.universityName}
                    </span>
                  </div>

                  {resource.sourceLink && (
                    <a
                      href={resource.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Source
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  )
}

export default StudentEducationalResources