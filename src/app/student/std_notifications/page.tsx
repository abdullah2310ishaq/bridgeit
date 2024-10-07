'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Proposal {
  id: string
  projectTitle: string
  proposal: string
  status: string
  read: boolean
  projectId: string
  expertFirstName: string
  expertLastName: string
  expertImageData: string
}

const StudentNotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread')
  const router = useRouter()

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      router.push('/auth/login-user')
      return
    }

    try {
      setLoading(true)
      const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
      const profileData = await profileResponse.json()

      const studentResponse = await fetch(
        `https://localhost:7053/api/get-student/student-by-id/${profileData.userId}`,
        { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
      )
      const studentData = await studentResponse.json()

      const proposalsResponse = await fetch(
        `https://localhost:7053/api/project-proposals/get-proposal-for-student/${studentData.id}`,
        { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
      )
      const proposalsData = await proposalsResponse.json()

      setProposals(proposalsData)
    } catch (error) {
      setError('Failed to fetch proposals')
    } finally {
      setLoading(false)
    }
  }

  const handleDismissProposal = (id: string) => {
    setProposals((prev) =>
      prev.map((proposal) => (proposal.id === id ? { ...proposal, read: true } : proposal))
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-16 w-16 mb-4 text-red-500" />
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    )
  }

  const unreadProposals = proposals.filter((proposal) => !proposal.read)
  const readProposals = proposals.filter((proposal) => proposal.read)

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-900">
  <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-white">
    {/* Page Title */}
    <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
      Notifications
    </h1>

    {/* Tab Switcher for Unread and Read Notifications */}
    <div className="flex space-x-6 mb-6 border-b border-gray-600">
      <button
        className={`py-2 px-4 focus:outline-none text-lg transition-colors duration-300 ${
          activeTab === 'unread'
            ? 'border-b-4 border-blue-500 text-blue-400'
            : 'text-gray-400 hover:text-white'
        }`}
        onClick={() => setActiveTab('unread')}
      >
        Unread ({unreadProposals.length})
      </button>
      <button
        className={`py-2 px-4 focus:outline-none text-lg transition-colors duration-300 ${
          activeTab === 'read'
            ? 'border-b-4 border-blue-500 text-blue-400'
            : 'text-gray-400 hover:text-white'
        }`}
        onClick={() => setActiveTab('read')}
      >
        Read ({readProposals.length})
      </button>
    </div>

    {/* Notifications List */}
    <div className="h-[400px] overflow-y-auto space-y-4">
      <AnimatePresence>
        {(activeTab === 'unread' ? unreadProposals : readProposals).map((proposal) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              {/* Expert Image or Placeholder */}
              {proposal.expertImageData ? (
                <img
                  src={proposal.expertImageData}
                  alt={`${proposal.expertFirstName} ${proposal.expertLastName}`}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-gray-600"
                />
              ) : (
                <div className="bg-gray-600 w-12 h-12 rounded-full mr-4" />
              )}

              {/* Expert and Project Information */}
              <div>
                <p className="text-lg font-semibold text-green-400">{proposal.projectTitle}</p>
                <p className="text-sm text-gray-300">
                  {proposal.expertFirstName} {proposal.expertLastName}
                </p>
              </div>
            </div>

            {/* Proposal Message */}
            <p className="text-gray-300 mb-4">{proposal.proposal}</p>

            {/* Status and Dismiss Button */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 italic">{proposal.status}</span>
              {activeTab === 'unread' && (
                <button
                  onClick={() => handleDismissProposal(proposal.id)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
</div>

  )
}

export default StudentNotificationsPage
