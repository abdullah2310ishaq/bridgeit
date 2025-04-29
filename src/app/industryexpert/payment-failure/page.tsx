"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const PaymentFailurePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
    }
  }, [router])

  // Get error message from URL if available
  const errorMessage = searchParams.get("error")
    ? decodeURIComponent(searchParams.get("error") as string)
    : "Your payment could not be processed at this time."

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-white">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-red-400 mb-4">Payment Failed</h1>

          <p className="text-gray-300 mb-6">{errorMessage}</p>

          <div className="bg-gray-700 p-4 rounded-lg w-full mb-8">
            <h3 className="font-semibold text-red-300 mb-2">Common Payment Issues:</h3>
            <ul className="space-y-2 text-left text-gray-300">
              <li>• Insufficient funds in your account</li>
              <li>• Card declined by your bank</li>
              <li>• Incorrect card information</li>
              <li>• Network or connection issues</li>
              <li>• Temporary issues with the payment processor</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/industryexpert/dashboard"
              className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center transition"
            >
              Go to Dashboard
            </Link>

            <button
              onClick={() => router.back()}
              className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-500 text-white rounded-lg text-center transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailurePage
