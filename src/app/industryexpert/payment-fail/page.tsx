"use client"

import { useRouter } from "next/navigation"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function PaymentFailurePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-900/30 rounded-full p-4">
                <XCircle className="h-16 w-16 text-red-400" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
            <p className="text-gray-300 text-lg mb-8">
              We're sorry, but your payment could not be processed. Please try again or contact support if the issue
              persists.
            </p>

            <div className="bg-gray-700/30 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Possible Reasons</h2>
              <ul className="text-left list-disc pl-5 space-y-2 text-gray-300">
                <li>Insufficient funds in your account</li>
                <li>Card declined by your bank</li>
                <li>Incorrect payment information</li>
                <li>Connection issues during the payment process</li>
                <li>Temporary issues with the payment gateway</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
              <button
                onClick={() => router.push("/industry-expert/dashboard")}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
