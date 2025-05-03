"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Project {
  id: string
  title: string
  description: string
  studentName: string
  budget: number
  status: string
}

const PaymentPage = () => {
  const { projectId } = useParams()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("Please log in to continue.")
      router.push("/auth/login-user")
      return
    }

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch project")
      }
      const data = await res.json()
      setProject(data)
      if (data.status.toLowerCase() !== "paymentpending") {
        toast.warning("Project is not in Payment Pending status. Please refresh or verify completion request.")
      }
    } catch (err: any) {
      setError(err.message || "Could not load project details.")
      toast.error(err.message || "Could not load project details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) fetchProject()
  }, [projectId, router])

  const handlePayment = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) {
      toast.error("Unauthorized or missing project ID")
      return
    }

    setProcessing(true)

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/payments/create-checkout-session/${projectId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.Error || errorData.Details || "Failed to create checkout session")
      }

      const { checkoutUrl } = await res.json()
      console.log("Redirecting to Stripe Checkout URL:", checkoutUrl)
      window.location.href = checkoutUrl
    } catch (err: any) {
      console.error("Payment error:", err)
      toast.error(`Payment failed: ${err.message || "Unknown error"}`)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-red-400 mb-6">Error</h1>
          <p>{error || "Project not found."}</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                fetchProject()
              }}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
              Retry
            </button>
            <button
              onClick={() => router.push(`/industryexpert/projects/milestone/${projectId}`)}
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              Back to Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-6">Confirm Payment</h1>

        <div className="bg-gray-800 p-6 rounded shadow mb-6">
          <p className="mb-2">
            <strong>Title:</strong> {project.title}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {project.description}
          </p>
          <p className="mb-2">
            <strong>Student:</strong> {project.studentName}
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                project.status.toLowerCase() === "paymentpending"
                  ? "bg-blue-900 text-blue-300"
                  : project.status.toLowerCase() === "completed"
                    ? "bg-green-900 text-green-300"
                    : project.status.toLowerCase() === "pendingcompletion"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-gray-700 text-gray-300"
              }`}
            >
              {project.status}
            </span>
          </p>
        </div>

        {project.status.toLowerCase() !== "paymentpending" && (
          <div className="mb-4">
            <p className="text-yellow-400 mb-2">
              This project is not ready for payment. Please ensure the project is in "Payment Pending" status by
              approving the completion request.
            </p>
            <button
              onClick={() => {
                setLoading(true)
                fetchProject()
              }}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
              Refresh Status
            </button>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={processing || project.status.toLowerCase() === "completed"}
          className={`w-full py-3 text-white rounded transition ${
            processing || project.status.toLowerCase() === "completed"
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
              Processing...
            </span>
          ) : (
            "Make Payment"
          )}
        </button>

        <button
          onClick={() => router.push(`/industryexpert/projects/milestone/${projectId}`)}
          className="mt-4 w-full py-3 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
        >
          Back to Project
        </button>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PaymentPage
