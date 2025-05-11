"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Loader2,
  User,
  Users,
  Code,
  Calendar,
  DollarSign,
  Briefcase,
  Filter,
  Building,
  BookOpen,
} from "lucide-react"
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
  facultyName?: string
  facultyId?: string
  universityName?: string
  department?: string
  technology?: string
  yearOfCompletion?: number
  batch?: string
  status?: string
}

export default function FYPMarketplacePage() {
  // State variables
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [allFyps, setAllFyps] = useState<FYP[]>([])
  const [buyFyps, setBuyFyps] = useState<FYP[]>([])
  const [sponsorFyps, setSponsorFyps] = useState<FYP[]>([])
  const [filteredBuyFyps, setFilteredBuyFyps] = useState<FYP[]>([])
  const [filteredSponsorFyps, setFilteredSponsorFyps] = useState<FYP[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all")
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"buy" | "sponsor">("buy")

  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [selectedFyp, setSelectedFyp] = useState<FYP | null>(null)
  const [agreementType, setAgreementType] = useState<"buy" | "sponsor" | null>(null)

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
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Step 2: Get industry expert details
        const expertResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch industry expert details")

        const expertData = await expertResponse.json()
        setIndustryExpertId(expertData.indExptId)

        // Step 3: Fetch all faculties
        const facultiesResponse = await fetch(
          "https://localhost:7053/api/get-faculty/faculties",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!facultiesResponse.ok) throw new Error("Failed to fetch faculties")

        const facultiesData = await facultiesResponse.json()
        setFaculties(facultiesData)

        // Step 4: Fetch FYPs for all faculties
        const collectedFyps: FYP[] = []

        for (const faculty of facultiesData) {
          try {
            const fypResponse = await fetch(
              `https://localhost:7053/api/fyp/get-fyp-by-faculty-id/${faculty.id}`,
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
                yearOfCompletion:
                  fyp.yearOfCompletion || (fyp.batch ? Number.parseInt(fyp.batch) + 4 : new Date().getFullYear() + 4),
              }))
              collectedFyps.push(...enhancedFyps)
            }
          } catch (err) {
            console.error(`Failed to fetch FYPs for faculty ${faculty.id}:`, err)
          }
        }

        // Step 5: Also try the dedicated marketplace endpoints
        try {
          // Try to fetch "Buy" FYPs (completed projects)
          const buyFypsResponse = await fetch(
            "https://localhost:7053/api/fyp/for-marketplace/buy",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          // Try to fetch "Sponsor" FYPs (ongoing projects)
          const sponsorFypsResponse = await fetch(
            "https://localhost:7053/api/fyp/for-marketplace/sponsor",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (buyFypsResponse.ok) {
            const buyFypsData = await buyFypsResponse.json()
            // Add to collected FYPs, avoiding duplicates
            const existingIds = new Set(collectedFyps.map((fyp: FYP) => fyp.id))
            const newBuyFyps = buyFypsData.filter((fyp: FYP) => !existingIds.has(fyp.id))
            collectedFyps.push(...newBuyFyps)
          }

          if (sponsorFypsResponse.ok) {
            const sponsorFypsData = await sponsorFypsResponse.json()
            // Add to collected FYPs, avoiding duplicates
            const existingIds = new Set(collectedFyps.map((fyp: FYP) => fyp.id))
            const newSponsorFyps = sponsorFypsData.filter((fyp: FYP) => !existingIds.has(fyp.id))
            collectedFyps.push(...newSponsorFyps)
          }
        } catch (err) {
          console.error("Failed to fetch from marketplace endpoints:", err)
        }

        // Step 6: Process all collected FYPs
        setAllFyps(collectedFyps)

        // Separate into buy and sponsor categories
        const currentYear = new Date().getFullYear()
        const buyFypsData = collectedFyps.filter(
          (fyp: FYP) =>
            (fyp.yearOfCompletion !== undefined && fyp.yearOfCompletion <= currentYear) ||
            (fyp.status === "Approved" && (!fyp.yearOfCompletion || fyp.yearOfCompletion <= currentYear)),
        )

        const sponsorFypsData = collectedFyps.filter(
          (fyp: FYP) =>
            (fyp.yearOfCompletion !== undefined && fyp.yearOfCompletion > currentYear) ||
            (fyp.status === "Approved" && fyp.yearOfCompletion && fyp.yearOfCompletion > currentYear),
        )

        setBuyFyps(buyFypsData)
        setFilteredBuyFyps(buyFypsData)
        setSponsorFyps(sponsorFypsData)
        setFilteredSponsorFyps(sponsorFypsData)
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
    let buyResults = buyFyps
    let sponsorResults = sponsorFyps

    // Filter by faculty
    if (selectedFaculty !== "all") {
      buyResults = buyResults.filter((fyp: FYP) => fyp.facultyId === selectedFaculty)
      sponsorResults = sponsorResults.filter((fyp: FYP) => fyp.facultyId === selectedFaculty)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()

      buyResults = buyResults.filter(
        (fyp: FYP) =>
          fyp.title.toLowerCase().includes(query) ||
          fyp.description.toLowerCase().includes(query) ||
          (fyp.facultyName && fyp.facultyName.toLowerCase().includes(query)) ||
          (fyp.universityName && fyp.universityName.toLowerCase().includes(query)) ||
          (fyp.technology && fyp.technology.toLowerCase().includes(query)) ||
          (fyp.department && fyp.department.toLowerCase().includes(query)),
      )

      sponsorResults = sponsorResults.filter(
        (fyp: FYP) =>
          fyp.title.toLowerCase().includes(query) ||
          fyp.description.toLowerCase().includes(query) ||
          (fyp.facultyName && fyp.facultyName.toLowerCase().includes(query)) ||
          (fyp.universityName && fyp.universityName.toLowerCase().includes(query)) ||
          (fyp.technology && fyp.technology.toLowerCase().includes(query)) ||
          (fyp.department && fyp.department.toLowerCase().includes(query)),
      )
    }

    setFilteredBuyFyps(buyResults)
    setFilteredSponsorFyps(sponsorResults)
  }, [selectedFaculty, searchQuery, buyFyps, sponsorFyps])

  // Handle FYP selection
  const handleFypClick = (fypId: string) => {
    router.push(`/industryexpert/fyp/${fypId}`)
  }

  // Handle requesting an FYP
  const handleRequestFyp = (event: React.MouseEvent, fyp: FYP, type: "buy" | "sponsor") => {
    event.stopPropagation()
    setSelectedFyp(fyp)
    setAgreementType(type)
    setShowAgreementModal(true)
  }

  const submitFypRequest = async () => {
    if (!industryExpertId || !selectedFyp) {
      toast.error("Missing required information")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      const response = await fetch(
        `https://localhost:7053/api/ind-expert-request-fyp/add/${selectedFyp.id}`,
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
          "FYP request submitted successfully! The university admin will review your request and youll be notified once its approved or rejected.",
          { autoClose: 8000 },
        )
        setShowAgreementModal(false)
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
          <p className="text-gray-400 mt-2">Browse, buy, or sponsor Final Year Projects</p>
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
              placeholder="Search projects by title, description, faculty, technology..."
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
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === "buy" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("buy")}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Buy Completed Projects</span>
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {filteredBuyFyps.length}
              </span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === "sponsor"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("sponsor")}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Sponsor Ongoing Projects</span>
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {filteredSponsorFyps.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* FYP Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        {activeTab === "buy" && (
          <>
            {filteredBuyFyps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBuyFyps.map((fyp: FYP) => (
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

                        {fyp.universityName && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Building className="h-4 w-4" />
                            <span>{fyp.universityName}</span>
                          </div>
                        )}

                        {fyp.department && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <BookOpen className="h-4 w-4" />
                            <span>{fyp.department}</span>
                          </div>
                        )}

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

                        {fyp.yearOfCompletion && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Completed in {fyp.yearOfCompletion}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleRequestFyp(e, fyp, "buy")}
                        className="w-full mt-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>Buy Project</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
                  <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-300">No completed projects found</h3>
                  <p className="text-gray-400 mt-2">
                    {searchQuery || selectedFaculty !== "all"
                      ? "Try adjusting your search or filters"
                      : "There are no completed projects available for purchase at the moment"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "sponsor" && (
          <>
            {filteredSponsorFyps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSponsorFyps.map((fyp: FYP) => (
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

                        {fyp.universityName && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Building className="h-4 w-4" />
                            <span>{fyp.universityName}</span>
                          </div>
                        )}

                        {fyp.department && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <BookOpen className="h-4 w-4" />
                            <span>{fyp.department}</span>
                          </div>
                        )}

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

                        {fyp.yearOfCompletion && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Expected completion in {fyp.yearOfCompletion}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleRequestFyp(e, fyp, "sponsor")}
                        className="w-full mt-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                      >
                        <Briefcase className="h-4 w-4" />
                        <span>Sponsor Project</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
                  <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-300">No ongoing projects found</h3>
                  <p className="text-gray-400 mt-2">
                    {searchQuery || selectedFaculty !== "all"
                      ? "Try adjusting your search or filters"
                      : "There are no ongoing projects available for sponsorship at the moment"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Agreement Modal */}
      {showAgreementModal && selectedFyp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full border border-gray-700 shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {agreementType === "buy" ? "Purchase Agreement" : "Sponsorship Agreement"}
              </h2>

              <div className="bg-gray-700/50 rounded-lg p-4 mb-6 max-h-80 overflow-y-auto">
                <h3 className="font-semibold text-gray-200 mb-3">Project: {selectedFyp.title}</h3>

                {agreementType === "buy" ? (
                  <div className="text-gray-300 space-y-3 text-sm">
                    <p>By proceeding with this purchase request, I agree to the following terms:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        I acknowledge that I am requesting to purchase the intellectual property rights to this Final
                        Year Project.
                      </li>
                      <li>
                        I agree to respect the copyright of the original creators and will provide appropriate
                        attribution when using this project.
                      </li>
                      <li>
                        I understand that I will not publicly share or distribute the source code or proprietary
                        elements of this project without proper authorization.
                      </li>
                      <li>
                        I agree to use this project in accordance with the universitys intellectual property policies.
                      </li>
                      <li>
                        I understand that the final terms of purchase will be determined upon approval by the university
                        administration.
                      </li>
                      <li>I acknowledge that this request may be rejected at the universitys discretion.</li>
                    </ol>
                  </div>
                ) : (
                  <div className="text-gray-300 space-y-3 text-sm">
                    <p>By proceeding with this sponsorship request, I agree to the following terms:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>I acknowledge that I am requesting to sponsor this ongoing Final Year Project.</li>
                      <li>
                        I agree to maintain the confidentiality of any proprietary information shared during the
                        collaboration.
                      </li>
                      <li>
                        I will not disclose any sensitive details about the project to unauthorized third parties.
                      </li>
                      <li>
                        I understand that the intellectual property rights will be shared as specified in the final
                        agreement upon approval.
                      </li>
                      <li>
                        I agree to provide reasonable support and resources to the student team as needed for the
                        projects success.
                      </li>
                      <li>I acknowledge that this request may be rejected at the universitys discretion.</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowAgreementModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFypRequest}
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    agreementType === "buy" ? "bg-green-700 hover:bg-green-600" : "bg-blue-700 hover:bg-blue-600"
                  }`}
                >
                  I Agree & Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
