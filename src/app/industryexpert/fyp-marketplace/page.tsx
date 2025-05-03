"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Loader2, BookOpen, User, Building, Users, Code } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Define interfaces for our data types
interface Faculty {
  id: string
  firstName: string
  lastName: string
  department: string
  universityName: string
}

interface FYP {
  id: string
  title: string
  description: string
  fypId: string
  members: number
  batch?: string
  technology?: string
  status?: string
  facultyId?: string
  facultyName?: string
  universityName?: string
  department?: string
}

export default function FYPMarketplacePage() {
  // State variables
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [fyps, setFyps] = useState<FYP[]>([])
  const [filteredFyps, setFilteredFyps] = useState<FYP[]>([])
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [loadingFyps, setLoadingFyps] = useState<Record<string, boolean>>({})

  const router = useRouter()

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Get user info
        const userResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Step 2: Get industry expert details
        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch industry expert details")

        const expertData = await expertResponse.json()
        setIndustryExpertId(expertData.indExptId)

        // Step 3: Fetch all faculties
        const facultiesResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculties",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!facultiesResponse.ok) throw new Error("Failed to fetch faculties")

        const facultiesData = await facultiesResponse.json()
        setFaculties(facultiesData)

        // Step 4: Fetch FYPs for all faculties
        const allFyps: FYP[] = []
        const newLoadingState: Record<string, boolean> = {}

        for (const faculty of facultiesData) {
          newLoadingState[faculty.id] = true
          try {
            const fypResponse = await fetch(
              `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-fyp-by-faculty-id/${faculty.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            if (fypResponse.ok) {
              const fypData = await fypResponse.json()
              // Enhance FYP data with faculty information
              const enhancedFyps = fypData.map((fyp: FYP) => ({
                ...fyp,
                facultyId: faculty.id,
                facultyName: `${faculty.firstName} ${faculty.lastName}`,
                universityName: faculty.universityName,
                department: faculty.department,
              }))
              allFyps.push(...enhancedFyps)
            }
          } catch (err) {
            console.error(`Failed to fetch FYPs for faculty ${faculty.id}:`, err)
          } finally {
            newLoadingState[faculty.id] = false
          }
        }

        setFyps(allFyps)
        setFilteredFyps(allFyps)
        setLoadingFyps(newLoadingState)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Filter FYPs based on selected faculty and search query
  useEffect(() => {
    let result = fyps

    // Filter by faculty
    if (selectedFaculty !== "all") {
      result = result.filter((fyp) => fyp.facultyId === selectedFaculty)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (fyp) =>
          fyp.title.toLowerCase().includes(query) ||
          fyp.description.toLowerCase().includes(query) ||
          (fyp.facultyName && fyp.facultyName.toLowerCase().includes(query)) ||
          (fyp.universityName && fyp.universityName.toLowerCase().includes(query)) ||
          (fyp.technology && fyp.technology.toLowerCase().includes(query)),
      )
    }

    setFilteredFyps(result)
  }, [selectedFaculty, searchQuery, fyps])

  // Handle FYP selection
  const handleFypClick = (fypId: string) => {
    router.push(`/industryexpert/fyp/${fypId}`)
  }

  // Handle requesting an FYP
  const handleRequestFyp = async (event: React.MouseEvent, fypId: string) => {
    event.stopPropagation()

    if (!industryExpertId) {
      toast.error("Industry expert ID not found")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/add/${fypId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(industryExpertId),
        },
      )

      if (response.ok) {
        toast.success(
          "FYP request submitted successfully! The university admin will review your request and you'll be notified once it's approved or rejected.",
          { autoClose: 8000 },
        )
      } else {
        const errorData = await response.text()
        toast.error(`Failed to request FYP: ${errorData}`)
      }
    } catch (err) {
      toast.error("An error occurred while requesting the FYP")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading FYP Marketplace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 p-6 rounded-lg border border-red-700 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => router.push("/industry-expert")}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-400">FYP Marketplace</h1>
          <p className="text-gray-400 mt-2">Browse and request Final Year Projects from various faculties</p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects by title, description, faculty..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Faculty Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" />
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="all">All Faculties</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.firstName} {faculty.lastName} - {faculty.department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-gray-400">
          Found {filteredFyps.length} project{filteredFyps.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* FYP Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        {filteredFyps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFyps.map((fyp) => (
              <div
                key={fyp.id}
                onClick={() => handleFypClick(fyp.id)}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-purple-900/20"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white line-clamp-2">{fyp.title}</h3>
                    <div className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-md">{fyp.fypId}</div>
                  </div>

                  <p className="text-gray-400 line-clamp-3">{fyp.description}</p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{fyp.facultyName || "Unknown Faculty"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Building className="h-4 w-4" />
                      <span>{fyp.universityName || "Unknown University"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{fyp.department || "Unknown Department"}</span>
                    </div>

                    {fyp.members && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{fyp.members} Members</span>
                      </div>
                    )}

                    {fyp.technology && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Code className="h-4 w-4" />
                        <span>{fyp.technology}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleRequestFyp(e, fyp.id)}
                    className="w-full mt-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
                  >
                    Request Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No projects found</h3>
              <p className="text-gray-400 mt-2">
                {searchQuery || selectedFaculty !== "all"
                  ? "Try adjusting your search or filters"
                  : "There are no projects available at the moment"}
              </p>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}
