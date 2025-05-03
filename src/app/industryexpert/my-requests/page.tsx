"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FypRequest {
  id: string
  status: number | null
  fypId: string
  fypTitle: string
  fyp_fypId: string
  fypDescription?: string
}

export default function MyRequestsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requests, setRequests] = useState<FypRequest[]>([])
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)

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

        // Step 3: Fetch requests for this industry expert
        // Note: This endpoint is hypothetical - you may need to create it
        const requestsResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/my-requests/${expertData.indExptId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json()
          setRequests(requestsData)
        } else {
          // If the endpoint doesn't exist yet, we'll show a message
          setRequests([])
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

  const getStatusBadge = (status: number | null) => {
    if (status === 1) {
      return (
        <div className="flex items-center gap-1 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <span>Approved</span>
        </div>
      )
    } else if (status === 0) {
      return (
        <div className="flex items-center gap-1 text-red-400">
          <XCircle className="h-4 w-4" />
          <span>Rejected</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          <Clock className="h-4 w-4" />
          <span>Pending</span>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading your FYP requests...</p>
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
        {requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((request) => (
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
                        <div className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
                          {getStatusBadge(request.status)}
                        </div>
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

                  <div className="mt-4">
                    {request.status === 1 && (
                      <div className="p-3 bg-green-900/20 border border-green-800 rounded-md text-sm text-green-300">
                        Your request has been approved! You can now collaborate with the faculty and students on this
                        project.
                      </div>
                    )}
                    {request.status === 0 && (
                      <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-sm text-red-300">
                        Your request has been rejected. You may want to explore other projects or contact the faculty
                        for more information.
                      </div>
                    )}
                    {request.status === null && (
                      <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-md text-sm text-yellow-300">
                        Your request is pending approval from the university admin. You'll be notified once a decision
                        is made.
                      </div>
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
                You haven't requested any Final Year Projects yet, or the request tracking feature is still being
                implemented.
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
