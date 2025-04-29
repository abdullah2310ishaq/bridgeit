"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PaymentDetail {
  id: string
  projectId: string
  project: {
    title: string
    studentName: string
  }
  paidAt: string
  paymentSlip: string | null
}

const PaymentHistoryPage = () => {
  const router = useRouter()
  const [payments, setPayments] = useState<PaymentDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const res = await fetch("https://localhost:7053/api/payment-details/get-payment-details", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch payment history")
        }

        const data = await res.json()
        setPayments(data)
      } catch (err) {
        console.error("Error fetching payment history:", err)
        setError("Failed to load payment history. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentHistory()
  }, [router])

  const downloadPaymentSlip = (paymentId: string) => {
    // Implement download functionality if needed
    console.log(`Downloading payment slip for payment ID: ${paymentId}`)
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading payment history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen p-6 text-white">
        <div className="max-w-4xl mx-auto bg-red-900/30 border border-red-700 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={() => router.push("/industryexpert/dashboard")}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Payment History</h1>
          <Link
            href="/industryexpert/dashboard"
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {payments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No Payment Records Found</h2>
            <p className="text-gray-400">
              You haven't made any payments yet. When you complete payments for projects, they will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{payment.project.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{payment.project.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{new Date(payment.paidAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{new Date(payment.paidAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">Completed</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {payment.paymentSlip && (
                          <button
                            onClick={() => downloadPaymentSlip(payment.id)}
                            className="text-green-400 hover:text-green-300 flex items-center justify-end ml-auto"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentHistoryPage
