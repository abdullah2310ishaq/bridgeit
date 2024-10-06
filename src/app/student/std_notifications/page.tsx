'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Toast from '@radix-ui/react-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Eye } from 'lucide-react'

interface Proposal {
  id: string
  projectTitle: string
  proposal: string
  status: string
  read: boolean
  projectId: string
  expertId: string
  expertFirstName: string
  expertLastName: string
  expertImageData: string
}

const StudentNotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread')
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchProposals()
  }, [router])

  const fetchProposals = async () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      console.error('Token is missing')
      router.push('/auth/login-user')
      return
    }

    try {
      setLoading(true)
      // Fetch user profile to get userId
      const profileResponse = await fetch(
        'https://localhost:7053/api/auth/authorized-user-info',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile')
      }

      const profileData = await profileResponse.json()
      const userId = profileData.userId

      // Fetch student data to get studentId
      const studentResponse = await fetch(
        `https://localhost:7053/api/get-student/student-by-id/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!studentResponse.ok) {
        throw new Error('Failed to fetch student details')
      }

      const studentData = await studentResponse.json()
      const studentId = studentData.id

      // Fetch proposals for the student
      const proposalsResponse = await fetch(
        `https://localhost:7053/api/project-proposals/get-proposal-for-student/${studentId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!proposalsResponse.ok) {
        throw new Error('Failed to fetch proposals')
      }

      const proposalsData = await proposalsResponse.json()

      // Fetch project and expert data for each proposal
      const proposalsWithExpertData = await Promise.all(
        proposalsData.map(async (proposal: any) => {
          const projectId = proposal.projectId
          let expertFirstName = ''
          let expertLastName = ''
          let expertImageData = ''

          if (projectId) {
            // Fetch project details
            const projectResponse = await fetch(
              `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )

            if (projectResponse.ok) {
              const projectData = await projectResponse.json()
              const expertId = projectData.indExpertId
              proposal.expertId = expertId // Add expertId to proposal

              expertFirstName = projectData.expertName?.split(' ')[0] || 'Expert'
              expertLastName = projectData.expertName?.split(' ')[1] || ''

              // Fetch expert details
              if (expertId) {
                const expertResponse = await fetch(
                  `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${expertId}`,
                  {
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )

                if (expertResponse.ok) {
                  const expertData = await expertResponse.json()
                  expertImageData = expertData.imageData
                    ? `data:image/jpeg;base64,${expertData.imageData}`
                    : ''
                }
              }
            } else {
              console.error('Failed to fetch project details')
            }
          }

          return {
            ...proposal,
            read: false,
            expertFirstName,
            expertLastName,
            expertImageData,
          }
        })
      )

      setProposals(proposalsWithExpertData)
    } catch (error) {
      setError('Failed to fetch proposals')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismissProposal = (id: string) => {
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === id ? { ...proposal, read: true } : proposal
      )
    )
    showToast('Notification dismissed')
  }

  const handleMarkAllAsRead = () => {
    setProposals((prev) => prev.map((proposal) => ({ ...proposal, read: true })))
    showToast('All notifications marked as read')
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white text-2xl font-bold flex items-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          Loading notifications...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-pink-500 text-white">
        <AlertCircle className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-xl mb-4">{error}</p>
        <button
          onClick={fetchProposals}
          className="bg-white text-red-500 font-bold py-2 px-4 rounded-full flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </button>
      </div>
    )
  }

  const unreadProposals = proposals.filter((proposal) => !proposal.read)
  const readProposals = proposals.filter((proposal) => proposal.read)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center">
              <Bell className="inline-block mr-3 text-purple-500" />
              Notifications
            </h1>
            {unreadProposals.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-purple-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-purple-600 transition-colors"
              >
                <Eye className="mr-2 h-4 w-4" />
                Mark All as Read
              </button>
            )}
          </div>

          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 ${
                  activeTab === 'unread'
                    ? 'border-b-2 border-purple-500 text-purple-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('unread')}
              >
                Unread ({unreadProposals.length})
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === 'read'
                    ? 'border-b-2 border-purple-500 text-purple-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('read')}
              >
                Read ({readProposals.length})
              </button>
            </div>
          </div>

          <div className="h-[600px] overflow-y-auto pr-4">
            <AnimatePresence>
              {activeTab === 'unread' && unreadProposals.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 mt-20"
                >
                  <Bell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-2xl font-semibold">All caught up!</p>
                  <p className="text-gray-400 mt-2">No new notifications at the moment.</p>
                </motion.div>
              )}
              {activeTab === 'read' && readProposals.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 mt-20"
                >
                  <Bell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-2xl font-semibold">No read notifications</p>
                  <p className="text-gray-400 mt-2">Dismissed notifications will appear here.</p>
                </motion.div>
              )}
              {(activeTab === 'unread' ? unreadProposals : readProposals).map((proposal) => (
                <NotificationCard
                  key={proposal.id}
                  proposal={proposal}
                  onDismiss={handleDismissProposal}
                  isRead={activeTab === 'read'}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="bg-white rounded-md shadow-lg p-4 flex items-center justify-between"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          <Toast.Title className="font-medium text-gray-900">{toastMessage}</Toast.Title>
          <Toast.Close className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-5 w-5" />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50" />
      </Toast.Provider>
    </div>
  )
}

interface NotificationCardProps {
  proposal: Proposal
  onDismiss: (id: string) => void
  isRead: boolean
}

const NotificationCard: React.FC<NotificationCardProps> = ({ proposal, onDismiss, isRead }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`bg-white rounded-lg shadow-md p-6 mb-4 ${isRead ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {proposal.expertImageData ? (
              <img src={proposal.expertImageData} alt={`${proposal.expertFirstName} ${proposal.expertLastName}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-500">
                {proposal.expertFirstName[0]}
                {proposal.expertLastName[0]}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {proposal.expertFirstName} {proposal.expertLastName}
            </h3>
            <p className="text-sm text-gray-500">{proposal.projectTitle}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{proposal.proposal}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {getStatusIcon(proposal.status)}
            <span className="ml-2 text-sm font-medium text-gray-700">{proposal.status}</span>
          </div>
          {!isRead && (
            <button
              onClick={() => onDismiss(proposal.id)}
              className="text-sm text-purple-500 hover:text-purple-700 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Accepted':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'Rejected':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }
}

export default StudentNotificationsPage