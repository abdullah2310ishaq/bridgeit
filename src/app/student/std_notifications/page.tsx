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
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>

        <div className="mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === 'unread'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadProposals.length})
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'read' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('read')}
          >
            Read ({readProposals.length})
          </button>
        </div>

        <div className="h-[400px] overflow-y-auto">
          <AnimatePresence>
            {(activeTab === 'unread' ? unreadProposals : readProposals).map((proposal) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
              >
                <div className="flex items-center">
                  {proposal.expertImageData ? (
                    <img
                      src={proposal.expertImageData}
                      alt={`${proposal.expertFirstName} ${proposal.expertLastName}`}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  ) : (
                    <div className="bg-gray-300 w-10 h-10 rounded-full mr-4" />
                  )}
                  <div>
                    <p className="font-bold">{proposal.projectTitle}</p>
                    <p>{proposal.expertFirstName} {proposal.expertLastName}</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{proposal.proposal}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">{proposal.status}</span>
                  {activeTab === 'unread' && (
                    <button
                      onClick={() => handleDismissProposal(proposal.id)}
                      className="text-sm text-blue-500"
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
