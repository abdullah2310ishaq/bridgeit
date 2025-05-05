"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Loader2, Clock, CheckCircle, XCircle, ArrowRight, Filter } from "lucide-react"

interface FypRequest {
  id: string
  status: number | null
  fypId: string
  industryExpertId: string
  fypTitle: string
  fypDescription?: string
  fyp_fypId: string
}

export default function MyRequestsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requests, setRequests] = useState<FypRequest[]>([])
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Get user info
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!profileResponse.ok) throw new Error("Failed to fetch profile.")

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // Step 2: Get industry expert details
        const expertResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile.")

        const expertData = await expertResponse.json()
        setIndustryExpertId(expertData.indExptId)
        console.log("Industry Expert ID:", expertData.indExptId)

        // Step 3: Fetch FYP requests for this industry expert
        const requestsResponse = await fetch(
          `https://localhost:7053/api/ind-expert-request-fyp/get-by-id/${expertData.indExptId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (requestsResponse.ok) {
          const requestData = await requestsResponse.json()
          console.log("Request data:", requestData)

          // If the response is an array, use it directly, otherwise wrap it in an array
          const requestsArray = Array.isArray(requestData) ? requestData : [requestData]
          setRequests(requestsArray)
        } else {
          if (requestsResponse.status === 404) {
            console.log("No requests found for this industry expert")
            setRequests([])
          } else {
            console.error("Failed to fetch requests:", await requestsResponse.text())
            throw new Error("Failed to fetch requests")
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [router])

  // Filter requests based on status
  const filteredRequests = requests.filter((request) => {
    if (statusFilter === "all") return true
    if (statusFilter === "pending") return request.status === null
    if (statusFilter === "approved") return request.status === 1
    if (statusFilter === "rejected") return request.status === 0
    return true
  })

  const getStatusBadge = (status: number | null) => {
    if (status === null) {
      return (
        <div className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-md flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </div>
      )
    } else if (status === 1) {
      return (
        <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Approved</span>
        </div>
      )
    } else {
      return (
        <div className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-md flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          <span>Rejected</span>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading your requests...</p>
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
          <h1 className="text-3xl font-bold text-purple-400">My FYP Requests</h1>
          <p className="text-gray-400 mt-2">Track the status of your Final Year Project requests</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Filter */}
        <div className="mb-6 flex items-center gap-2">
          <Filter className="text-gray-400" />
          <span className="text-gray-300">Filter by status:</span>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{request.fypTitle}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-md">
                          {request.fyp_fypId}
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/industry-expert/fyp-details/${request.fypId}`)}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {request.fypDescription && (
                    <p className="text-gray-400 mt-4 line-clamp-2">{request.fypDescription}</p>
                  )}

                  {/* Status-specific actions */}
                  <div className="mt-6 border-t border-gray-700 pt-4">
                    {request.status === 1 && (
                      <button
                        onClick={() => router.push("/industry-expert/approved-requests")}
                        className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md"
                      >
                        Go to Approved Requests
                      </button>
                    )}
                    {request.status === 0 && (
                      <div className="text-gray-400">
                        This request has been rejected. You can browse other projects in the marketplace.
                      </div>
                    )}
                    {request.status === null && (
                      <div className="text-yellow-400">Your request is pending approval from the university admin.</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
              <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No requests found</h3>
              <p className="text-gray-400 mt-2">
                {statusFilter !== "all"
                  ? `You don't have any ${statusFilter} requests.`
                  : "You haven't made any FYP requests yet."}
              </p>
              <button
                onClick={() => router.push("/industry-expert/fyp-marketplace")}
                className="mt-6 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                Browse FYP Marketplace
              </button>
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
