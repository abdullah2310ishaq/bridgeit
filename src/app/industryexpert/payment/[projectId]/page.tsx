"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ProjectDetails {
  id: string
  title: string
  description: string
  status: string
  budget: number
  studentName: string
  expertName: string
}

const PaymentPage = () => {
  const { projectId } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const res = await fetch(`https://localhost:7053/api/projects/get-project-by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch project details")
        }

        const data = await res.json()
        setProject(data)
      } catch (err) {
        console.error("Error fetching project details:", err)
        setError("Failed to load project details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectDetails()
    }
  }, [projectId, router])

  const handleInitiatePayment = async () => {
    setProcessingPayment(true)
    const token = localStorage.getItem("jwtToken")

    try {
      // Call the backend API to create a checkout session
      const res = await fetch(`https://localhost:7053/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }), // Change this to send as an object
      })

      if (!res.ok) {
        const errorData = await res.text()
        throw new Error(`Payment initiation failed: ${errorData}`)
      }

      const { checkoutUrl } = await res.json()

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl
    } catch (err: any) {
      console.error("Payment error:", err)
      toast.error(`Failed to initiate payment: ${err.message || "Unknown error"}`)
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen p-6 text-white">
        <div className="max-w-2xl mx-auto bg-red-900/30 border border-red-700 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-6">Project Payment</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-green-300 mb-4">Project Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Project Title:</span>
              <span className="font-medium">{project?.title}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Description:</span>
              <span className="font-medium">{project?.description}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Status:</span>
              <span className="font-medium">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project?.status === "Completed" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"
                  }`}
                >
                  {project?.status}
                </span>
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Student:</span>
              <span className="font-medium">{project?.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount Due:</span>
              <span className="font-bold text-xl text-green-400">
                PKR {project?.budget?.toLocaleString() || "20,000"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-green-300 mb-4">Payment Information</h2>
          <p className="text-gray-300 mb-6">
            You are about to make a payment for the completed project. This payment will be processed securely through
            Stripe. After clicking the button below, you will be redirected to Stripe's checkout page to complete your
            payment.
          </p>

          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Payment Details:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Payment Method: Credit/Debit Card</li>
              <li>• Amount: PKR {project?.budget?.toLocaleString() || "20,000"}</li>
              <li>• Recipient: {project?.studentName}</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleInitiatePayment}
              disabled={processingPayment}
              className={`px-8 py-3 rounded-lg font-semibold flex items-center ${
                processingPayment
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500 text-white"
              }`}
            >
              {processingPayment ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-green-300 mb-4">Payment Security</h2>
          <p className="text-gray-300 mb-4">
            All payments are securely processed through Stripe, a PCI-compliant payment processor. Your payment
            information is encrypted and never stored on our servers.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-white p-2 rounded">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#635BFF">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
              </svg>
            </div>
            <div className="bg-white p-2 rounded">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#FFB600">
                <path d="M22.891 3.51H1.11A1.11 1.11 0 000 4.62v14.76a1.11 1.11 0 001.11 1.11h21.78A1.11 1.11 0 0024 19.38V4.62a1.11 1.11 0 00-1.11-1.11zm-1.11 15.87H2.22V5.73h19.56v13.65z" />
                <path d="M7.11 14.62h.37c1.48 0 2.42-.8 2.42-2.15 0-1.26-.83-2.05-2.2-2.05H5.33v7.16h1.12v-2.96h.66zm-.66-3.23h.66c.7 0 1.06.36 1.06.99 0 .68-.42 1.12-1.08 1.12h-.64v-2.11zm4.82 6.19h1.22l1.92-7.16h-1.13l-1.44 5.86h-.02l-1.44-5.86h-1.16l1.92 7.16h.13zm6.85-1.13h-2.95v-2.12h2.57v-1.01h-2.57v-1.9h2.95V10.4h-4.07v7.16h4.07v-1.11z" />
              </svg>
            </div>
            <div className="bg-white p-2 rounded">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#000000">
                <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102h2.037zm8.033 5.049c.008-2-.554-3.502-3.033-3.502-1.759 0-2.961.446-2.961.446l.37 1.568s1.063-.431 1.907-.431c.748 0 1.43.212 1.43 1.01v.279c-2.945 0-4.81.999-4.81 3.034 0 1.269.862 2.095 2.188 2.095 1.004 0 1.759-.249 2.235-.9l.046.8h1.798c-.093-.487-.139-1.01-.139-1.643l-.031-2.756zm-1.664 2.476c-.216.57-.693.941-1.298.941-.555 0-.878-.34-.878-.864 0-.941.878-1.29 2.176-1.29v1.213zm3.258 2.023h2.019l1.712-8.574h-2.03l-1.701 8.574zm-8.991-8.574l-1.597 8.574h1.921l1.597-8.574h-1.921z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PaymentPage
