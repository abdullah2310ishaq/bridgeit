"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
}

interface CompletionRequestsProps {
  requests: CompletionRequest[]
  onRefresh?: () => Promise<void>
}

const CompletionRequestsComponent: React.FC<CompletionRequestsProps> = ({ requests, onRefresh }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [localRequests, setLocalRequests] = useState<CompletionRequest[]>(requests)

  // Update local requests when the prop changes
  useEffect(() => {
    setLocalRequests(requests)
  }, [requests])

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error("Error refreshing completion requests:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (localRequests.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-700 rounded-lg">
        <p className="mb-4">No completion requests pending</p>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded transition flex items-center mx-auto"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Check for New Requests
              </>
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      {onRefresh && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded transition flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Requests
              </>
            )}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-600 text-left">
              <th className="py-3 px-4 font-semibold">Project</th>
              <th className="py-3 px-4 font-semibold">Student</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localRequests.map((request) => (
              <tr key={request.id} className="border-t border-gray-600">
                <td className="py-3 px-4">{request.projectTitle}</td>
                <td className="py-3 px-4">{request.studentName}</td>
                <td className="py-3 px-4">{new Date(request.requestDate).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      request.status === "PENDING"
                        ? "bg-yellow-900 text-yellow-300"
                        : request.status === "ACCEPTED"
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => router.push(`/industryexpert/projects/milestone/${request.projectId}`)}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded text-sm"
                  >
                    View Project
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompletionRequestsComponent
