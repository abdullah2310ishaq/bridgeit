"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const PaymentSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectTitle, setProjectTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusUpdated, setStatusUpdated] = useState(false)

  useEffect(() => {
    // Get project ID from URL parameters if available
    const id = searchParams.get("project_id")
    const title = searchParams.get("title")

    if (id) setProjectId(id)
    if (title) setProjectTitle(decodeURIComponent(title))

    // Check if user is authenticated
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    // Update project status to Completed if payment was successful
    if (id && token) {
      console.log("Payment successful, updating project status to Completed")
      completeProject(id, token)
    }
  }, [router, searchParams])

  const completeProject = async (id: string, token: string) => {
    setLoading(true)
    try {
      console.log("Calling project complete endpoint for project:", id)

      // Call the dedicated complete project endpoint
      const res = await fetch(
        `https://localhost:7053/api/projects/${id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (res.ok) {
        console.log("Project successfully marked as completed")
        setStatusUpdated(true)
      } else {
        const errorText = await res.text()
        console.error("Failed to complete project:", res.status, errorText)
      }
    } catch (err) {
      console.error("Error completing project:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-white">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          {loading ? (
            <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin mb-4"></div>
          ) : (
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          <h1 className="text-3xl font-bold text-green-400 mb-4">Payment Successful!</h1>

          <p className="text-gray-300 mb-6">
            Your payment has been processed successfully. Thank you for completing the transaction.
            {projectTitle && (
              <span>
                {" "}
                The payment for project <strong>{projectTitle}</strong> has been recorded.
              </span>
            )}
          </p>

          <div className="bg-gray-700 p-4 rounded-lg w-full mb-8">
            <h3 className="font-semibold text-green-300 mb-2">Payment Details:</h3>
            <ul className="space-y-2 text-left text-gray-300">
              <li>
                • Status: <span className="text-green-400">Completed</span>
              </li>
              <li>• Date: {new Date().toLocaleDateString()}</li>
              <li>• Time: {new Date().toLocaleTimeString()}</li>
              <li>• Payment Method: Credit/Debit Card</li>
              <li>
                • Project Status:{" "}
                <span className={statusUpdated ? "text-green-400" : "text-yellow-400"}>
                  {statusUpdated ? "Updated to Completed" : "Updating..."}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/industryexpert"
              className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center transition"
            >
              Go to Dashboard
            </Link>

            {projectId && (
              <>
                <Link
                  href={`/industryexpert/projects/milestone/${projectId}`}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-center transition"
                >
                  Return to Project
                </Link>
                <Link
                  href={`/industryexpert/payment-receipt/${projectId}`}
                  className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-500 text-white rounded-lg text-center transition"
                >
                  View Receipt
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
