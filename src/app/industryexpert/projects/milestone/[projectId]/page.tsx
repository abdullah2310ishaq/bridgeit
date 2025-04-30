"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ChatForIndustry from "@/app/common_components/ChatforIndustry"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// --------- Interfaces ---------
interface IndustryExpertProfile {
  userId: string
  indExptId: string // We'll use this as the "expertId"
  firstName: string
  lastName: string
  email: string
}

interface Milestone {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
}

interface StudentDetails {
  studentId: string
  firstName: string
  lastName: string
  stdUserId: string
}

interface Comment {
  id: string
  comment: string
  commenterName: string
  commentDate: string
}

interface TaskItem {
  id: string
  projectId: string
  task: string
  description: string
  taskStatus: string
}

interface Review {
  id: string
  review: string
  rating: number
  datePosted: string
  reviewerName: string
}

interface ProjectDetailsExtended {
  studentId: string
  stdUserId: string
  studentName: string
  status?: string
  title: string
  description: string
  endDate: string
  expertName: string
  indExpertId: string
  iExptUserId: string
}

interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
}

const MilestonePage: React.FC = () => {
  const { projectId } = useParams()
  const router = useRouter()

  // Logged-in industry expert profile (if available)
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null)
  // Project details and student info
  const [project, setProject] = useState<ProjectDetailsExtended | null>(null)
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null)
  // Milestones and comments
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [currentMilestoneId, setCurrentMilestoneId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>([])
  // New Task inputs (visible only to industry experts)
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  // Review state (if needed when project is completed)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReviewText, setNewReviewText] = useState("")
  const [newReviewRating, setNewReviewRating] = useState<number>(0)
  // Completion requests
  const [completionRequests, setCompletionRequests] = useState<CompletionRequest[]>([])
  const [currentRequest, setCurrentRequest] = useState<CompletionRequest | null>(null)
  // Modal state for adding/editing milestones
  const [showModal, setShowModal] = useState(false)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  })
  // Loading and error state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Debug state
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // Determine if the project is completed or pending completion
  const isProjectComplete = project?.status === "Completed"
  const isPendingCompletion = project?.status === "PendingCompletion"

  // -----------------------------
  // 1) Fetch Expert, Project Details, and Milestones
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }
      if (!projectId) return

      try {
        // Get authorized user info
        const authRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!authRes.ok) throw new Error("Failed to get authorized user info.")
        const authData = await authRes.json()

        // Fetch industry expert profile using logged-in user ID
        const expertRes = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${authData.userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (!expertRes.ok) throw new Error("Failed to fetch industry expert profile.")
        const expertData = await expertRes.json()
        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId,
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          email: expertData.email,
        })

        // Fetch project details (includes student info)
        const projectRes = await fetch(`https://localhost:7053/api/projects/get-project-by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!projectRes.ok) throw new Error("Failed to fetch project details.")
        const projectData = await projectRes.json()
        setProject(projectData)
        setStudentDetails({
          studentId: projectData.studentId,
          stdUserId: projectData.stdUserId,
          firstName: projectData.studentName.split(" ")[0] ?? "",
          lastName: projectData.studentName.split(" ")[1] ?? "",
        })

        // Fetch milestones
        const milestonesRes = await fetch(`https://localhost:7053/api/milestone/get-project-milestones/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!milestonesRes.ok) throw new Error("Failed to fetch milestones.")
        const milestonesData = await milestonesRes.json()

        // Add isCompleted property based on achievement date
        const today = new Date().toISOString().split("T")[0]
        const processedMilestones = milestonesData.map((m: Milestone) => ({
          ...m,
          isCompleted: m.achievementDate <= today,
        }))

        setMilestones(processedMilestones)

        // Fetch completion requests for this expert
        await fetchCompletionRequests(expertData.indExptId)
      } catch (err) {
        console.error(err)
        setError("Failed to load project data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId, router])

  // -----------------------------
  // 2) Fetch Completion Requests
  // -----------------------------
  const fetchCompletionRequests = async (expertId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    setDebugInfo(`Fetching completion requests for expert ID: ${expertId}`)

    try {
      // First, try to fetch using the expert ID
      const res = await fetch(
        `https://localhost:7053/api/request-for-project-completion/get-completion-request/${expertId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.ok) {
        const data = await res.json()
        setDebugInfo((prev) => `${prev}\nReceived ${data.length} requests from API`)

        // Check if we got an empty array or error message
        if (Array.isArray(data) && data.length === 0) {
          setDebugInfo((prev) => `${prev}\nNo completion requests found for this expert`)
          setCompletionRequests([])
        } else if (typeof data === "string") {
          setDebugInfo((prev) => `${prev}\nAPI returned string: ${data}`)
          setCompletionRequests([])
        } else {
          setCompletionRequests(data)

          // Find if there's a request for the current project
          const currentProjectRequest = data.find((req: CompletionRequest) => req.projectId === projectId)
          if (currentProjectRequest) {
            setCurrentRequest(currentProjectRequest)
            setDebugInfo((prev) => `${prev}\nFound request for current project: ${currentProjectRequest.id}`)
          } else {
            setDebugInfo((prev) => `${prev}\nNo request found for current project ID: ${projectId}`)

            // If no request found for this project, check project status
            if (project?.status === "PendingCompletion") {
              // If project status is PendingCompletion but no request found, try to fetch directly by project ID
              await fetchCompletionRequestByProject()
            }
          }
        }
      } else {
        const errorText = await res.text()
        setDebugInfo((prev) => `${prev}\nError fetching requests: ${res.status} - ${errorText}`)
        console.error("Failed to fetch completion requests:", res.status, errorText)

        // If expert ID fetch fails, try fetching by project ID as fallback
        await fetchCompletionRequestByProject()
      }
    } catch (err) {
      setDebugInfo((prev) => `${prev}\nException fetching requests: ${err}`)
      console.error("Error fetching completion requests:", err)

      // If expert ID fetch throws exception, try fetching by project ID as fallback
      await fetchCompletionRequestByProject()
    }
  }

  // Fallback method to fetch completion request by project ID
  const fetchCompletionRequestByProject = async () => {
    if (!projectId) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    setDebugInfo((prev) => `${prev}\nTrying fallback: Fetching completion request by project ID: ${projectId}`)

    try {
      // Try to fetch the specific request for this project
      const res = await fetch(
        `https://localhost:7053/api/request-for-project-completion/get-project-request/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.ok) {
        const data = await res.json()
        setDebugInfo((prev) => `${prev}\nReceived project-specific request data`)

        if (data && data.id) {
          setCurrentRequest(data)
          setDebugInfo((prev) => `${prev}\nSet current request from project-specific endpoint: ${data.id}`)

          // Add this request to the completionRequests array if it's not already there
          setCompletionRequests((prev) => {
            if (prev.some((req) => req.id === data.id)) {
              return prev
            }
            return [...prev, data]
          })
        } else {
          setDebugInfo((prev) => `${prev}\nNo project-specific request found or invalid data format`)
        }
      } else {
        const errorText = await res.text()
        setDebugInfo((prev) => `${prev}\nError fetching project-specific request: ${res.status} - ${errorText}`)
        console.error("Failed to fetch project-specific completion request:", res.status, errorText)
      }
    } catch (err) {
      setDebugInfo((prev) => `${prev}\nException fetching project-specific request: ${err}`)
      console.error("Error fetching project-specific completion request:", err)
    }
  }

  // -----------------------------
  // 3) Fetch Comments for a Milestone
  // -----------------------------
  const fetchComments = async (milestoneId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return
    try {
      const res = await fetch(
        `https://localhost:7053/api/milestone-comment/get-milestone-comments/?milestoneId=${milestoneId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.ok) {
        const data = await res.json()
        setComments((prev) => ({
          ...prev,
          [milestoneId]: typeof data === "string" && data.includes("No comments") ? [] : data,
        }))
      }
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }

  // -----------------------------
  // 4) Add a new comment
  // -----------------------------
  const handleAddComment = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !expertProfile || !currentMilestoneId) return
    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    try {
      const res = await fetch(
        `https://localhost:7053/api/milestone-comment/add-milestone-comment?milestoneId=${currentMilestoneId}&expertId=${expertProfile.indExptId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newComment),
        },
      )
      if (res.ok) {
        toast.success("Comment added successfully")
        setNewComment("")
        await fetchComments(currentMilestoneId)
      } else {
        console.error("Failed to add comment:", res.status)
        toast.error("Failed to add comment")
      }
    } catch (err) {
      console.error("Error adding comment:", err)
      toast.error("Error adding comment")
    }
  }

  // -----------------------------
  // 5) Fetch Tasks
  // -----------------------------
  const fetchTasks = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    try {
      const res = await fetch(`https://localhost:7053/api/project-progress/get-tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      } else {
        console.error("Failed to fetch tasks:", res.status)
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

  // -----------------------------
  // 6) Handle Task Toggle (Update Task Status)
  // -----------------------------
  const handleTaskToggle = async (task: TaskItem) => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    // Only allow marking tasks as complete (not toggling back to pending)
    // This matches the controller's functionality
    if (task.taskStatus === "COMPLETED") {
      toast.info("Task is already completed")
      return
    }

    try {
      // Use the marks-as-complete endpoint from the controller
      const res = await fetch(`https://localhost:7053/api/project-progress/marks-as-complete/${projectId}/${task.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        // Update local state to show task as completed
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, taskStatus: "COMPLETED" } : t)))
        toast.success("Task marked as completed")
      } else {
        console.error("Failed to mark task as complete:", res.status)
        toast.error("Failed to mark task as complete")
      }
    } catch (err) {
      console.error("Error marking task as complete:", err)
      toast.error("Error marking task as complete")
    }
  }

  // -----------------------------
  // 7) Handle Add Task (Industry Expert adds a new task)
  // -----------------------------
  const handleAddTask = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    if (!newTask.trim() || !newTaskDescription.trim()) {
      toast.error("Please provide both task title and description.")
      return
    }
    try {
      const res = await fetch(`https://localhost:7053/api/project-progress/add-tasks/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: newTask, description: newTaskDescription }),
      })
      if (res.ok) {
        toast.success("Task added successfully.")
        setNewTask("")
        setNewTaskDescription("")
        await fetchTasks()
      } else {
        console.error("Failed to add task:", res.status)
        toast.error("Failed to add task.")
      }
    } catch (err) {
      console.error("Error adding task:", err)
      toast.error("Error adding task.")
    }
  }

  // -----------------------------
  // 8) Fetch Reviews (if project is completed)
  // -----------------------------
  const fetchReviews = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    try {
      const res = await fetch(`https://localhost:7053/api/reviews/get-reviews/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      } else {
        console.error("Failed to fetch reviews:", res.status)
      }
    } catch (err) {
      console.error("Error fetching reviews:", err)
    }
  }

  // -----------------------------
  // 9) Handle Add Review (Industry Expert adds a review)
  // -----------------------------
  const handleAddReview = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId || !expertProfile) return
    if (newReviewRating < 1 || newReviewRating > 5 || !newReviewText.trim()) {
      toast.error("Please provide both a review and a rating between 1 and 5.")
      return
    }
    try {
      const res = await fetch(`https://localhost:7053/api/reviews/add-review/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ReviewerId: expertProfile.userId,
          Review: newReviewText,
          Rating: newReviewRating,
        }),
      })
      if (res.ok) {
        toast.success("Review added successfully.")
        setNewReviewText("")
        setNewReviewRating(0)
        await fetchReviews()
      } else {
        toast.error("Failed to add review.")
      }
    } catch (err) {
      console.error("Error adding review:", err)
      toast.error("Error adding review.")
    }
  }

  // -----------------------------
  // 10) Handle Approve Project Completion (Expert approves student's request)
  // -----------------------------
  const handleApproveCompletion = async () => {
    if (!currentRequest) {
      toast.error("No completion request found for this project")
      return
    }

    if (!window.confirm("Are you sure you want to approve this project completion request?")) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://localhost:7053/api/request-for-project-completion/handle-request/${currentRequest.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify("ACCEPTED"), // The status should be "ACCEPTED" as per the API
        },
      )

      if (res.ok) {
        toast.success("Project completion approved. Please proceed to payment to complete the project.")
        // Update local project state to reflect payment pending status instead of completed
        setProject((prev) => (prev ? { ...prev, status: "PaymentPending" } : prev))
        // Remove the current request
        setCurrentRequest(null)
        // Refresh completion requests
        if (expertProfile) {
          await fetchCompletionRequests(expertProfile.indExptId)
        }

        // Show payment button
        toast.info("Please click the 'Make Payment' button to complete the transaction.", {
          autoClose: 10000, // Keep this message visible longer
        })
      } else {
        const errorText = await res.text()
        console.error("Failed to approve project completion:", res.status, errorText)
        toast.error(`Failed to approve project completion: ${errorText || res.status}`)
      }
    } catch (err) {
      console.error("Error approving project completion:", err)
      toast.error(`Error approving project completion: ${err || "Unknown error"}`)
    }
  }

  // -----------------------------
  // 11) Handle Reject Project Completion (Expert rejects student's request)
  // -----------------------------
  const handleRejectCompletion = async () => {
    if (!currentRequest) {
      toast.error("No completion request found for this project")
      return
    }

    if (!window.confirm("Are you sure you want to reject this project completion request?")) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://localhost:7053/api/request-for-project-completion/handle-request/${currentRequest.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify("REJECTED"), // The status should be "REJECTED" as per the API
        },
      )

      if (res.ok) {
        toast.success("Project completion request rejected. The project is now back to active status.")
        // Update local project state to reflect active status
        setProject((prev) => (prev ? { ...prev, status: "Active" } : prev))
        // Remove the current request
        setCurrentRequest(null)
        // Refresh completion requests
        if (expertProfile) {
          await fetchCompletionRequests(expertProfile.indExptId)
        }
      } else {
        const errorText = await res.text()
        console.error("Failed to reject project completion:", res.status, errorText)
        toast.error(`Failed to reject project completion: ${errorText || res.status}`)
      }
    } catch (err) {
      console.error("Error rejecting project completion:", err)
      toast.error(`Error rejecting project completion: ${err || "Unknown error"}`)
    }
  }

  // Manually check for completion requests
  const handleManualRefresh = async () => {
    if (!expertProfile) {
      toast.error("Expert profile not loaded yet")
      return
    }

    setDebugInfo("Manually refreshing completion requests...")
    toast.info("Refreshing completion requests...")

    await fetchCompletionRequests(expertProfile.indExptId)

    // Also check if the current project status is PendingCompletion
    if (project?.status === "PendingCompletion") {
      await fetchCompletionRequestByProject()
    }

    toast.success("Refresh complete")
  }

  // Fetch tasks when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  // When project becomes complete, fetch reviews
  useEffect(() => {
    if (project?.status === "Completed") {
      fetchReviews()
    }
  }, [project])

  // Check for completion requests when project status changes to PendingCompletion
  useEffect(() => {
    if (project?.status === "PendingCompletion" && expertProfile) {
      // If project status is PendingCompletion, try to fetch completion requests again
      fetchCompletionRequests(expertProfile.indExptId)
    }
  }, [project?.status, expertProfile])

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading project data...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-green-400">Project Milestones</h1>
        <div className="mt-4 bg-gray-800 p-4 rounded">
          <p className="mb-1">
            <strong className="text-green-300">Title:</strong> {project?.title}
          </p>
          <p className="mb-1">
            <strong className="text-green-300">Description:</strong> {project?.description}
          </p>
          <p className="mb-1">
            <strong className="text-green-300">Status:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                project?.status === "Completed"
                  ? "bg-green-900 text-green-300"
                  : project?.status === "PendingCompletion"
                    ? "bg-yellow-900 text-yellow-300"
                    : project?.status === "PaymentPending"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-gray-700 text-gray-300"
              }`}
            >
              {project?.status}
            </span>
          </p>
          <p className="mb-1">
            <strong className="text-green-300">End Date:</strong> {project?.endDate}
          </p>
          <p className="mb-1">
            <strong className="text-green-300">Student:</strong> {project?.studentName}
          </p>
          <p className="mb-1">
            <strong className="text-green-300">Industry Expert:</strong> {project?.expertName || "N/A"}
          </p>
        </div>

        {/* Manual refresh button for completion requests */}
        {project?.status === "PendingCompletion" && !currentRequest && (
          <div className="mt-4 bg-yellow-900 border border-yellow-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-yellow-300 font-semibold">Project is pending completion</span>
            </div>
            <p className="text-gray-300 mb-4">
              This project has a pending completion request, but the details couldn't be loaded. Click the button below
              to refresh and check for completion requests.
            </p>
            <button
              onClick={handleManualRefresh}
              className="py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Completion Requests
            </button>
          </div>
        )}

        {/* Project Completion Request Actions */}
        {currentRequest && (
          <div className="mt-4 bg-yellow-900 border border-yellow-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-yellow-300 font-semibold">Completion request received from student</span>
            </div>
            <p className="text-gray-300 mb-2">
              <strong>Request ID:</strong> {currentRequest.id}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Student:</strong> {currentRequest.studentName}
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Request Date:</strong> {new Date(currentRequest.requestDate).toLocaleString()}
            </p>
            <p className="text-gray-300 mb-4">
              The student has requested to mark this project as complete. Please review the project milestones and tasks
              before approving or rejecting this request.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleApproveCompletion}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve Completion
              </button>
              <button
                onClick={handleRejectCompletion}
                className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject Request
              </button>
            </div>
          </div>
        )}

        {(isProjectComplete || project?.status === "PaymentPending") && (
          <div className="mt-4 bg-green-900 border border-green-700 text-green-300 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {project?.status === "PaymentPending" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                )}
              </svg>
              <span>
                {project?.status === "PaymentPending"
                  ? "Project completion approved. Payment is required to finalize the project."
                  : "This project is complete. Editing is disabled."}
              </span>
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  console.log("Project ID for payment:", projectId)
                  if (projectId) {
                    router.push(`/industryexpert/payment/${projectId}`)
                  } else {
                    toast.error("Project ID is missing. Cannot proceed to payment.")
                  }
                }}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {project?.status === "PaymentPending" ? "Make Payment" : "View Payment Details"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Debug Information (only visible during development) */}
      {debugInfo && (
        <div className="max-w-4xl mx-auto mb-8 bg-gray-800 p-4 rounded border border-gray-700">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">Debug Information</h3>
          <pre className="whitespace-pre-wrap text-xs text-gray-400">{debugInfo}</pre>
          <button
            onClick={() => setDebugInfo(null)}
            className="mt-2 px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600"
          >
            Clear Debug Info
          </button>
        </div>
      )}

      {/* All Completion Requests Section */}
      {completionRequests.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-4">All Completion Requests</h2>
          <div className="bg-gray-800 p-4 rounded overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Project</th>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completionRequests.map((request) => (
                  <tr key={request.id} className={request.projectId === projectId ? "bg-gray-700" : ""}>
                    <td className="px-4 py-2">{request.projectTitle}</td>
                    <td className="px-4 py-2">{request.studentName}</td>
                    <td className="px-4 py-2">{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
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
                    <td className="px-4 py-2">
                      {request.projectId !== projectId && (
                        <button
                          onClick={() => router.push(`/industryexpert/projects/milestone/${request.projectId}`)}
                          className="text-green-400 hover:text-green-300"
                        >
                          View Project
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

      {/* Milestones Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Milestones</h2>
        {milestones.length === 0 ? (
          <p className="text-gray-400 bg-gray-800 p-4 rounded">No milestones found for this project.</p>
        ) : (
          <div className="space-y-4">
            {milestones.map((mile) => (
              <div key={mile.id} className="p-4 bg-gray-800 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{mile.title}</h3>
                    <p className="text-gray-300 mt-1">{mile.description}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      <strong>Target date:</strong> {new Date(mile.achievementDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          mile.isCompleted ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {mile.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button to load comments */}
                <button
                  onClick={() => {
                    setCurrentMilestoneId(mile.id)
                    fetchComments(mile.id)
                  }}
                  className="mt-3 text-green-400 hover:text-green-300 hover:underline flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  {currentMilestoneId === mile.id ? "Hide Comments" : "View Comments"}
                </button>

                {currentMilestoneId === mile.id && (
                  <div className="mt-4 border-t border-gray-700 pt-3">
                    <h4 className="text-lg font-bold text-green-300 mb-2">Comments</h4>

                    {comments[mile.id]?.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {comments[mile.id].map((c) => (
                          <div key={c.id} className="p-3 bg-gray-700 rounded">
                            <p className="text-gray-200">{c.comment}</p>
                            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                              <span>{c.commenterName}</span>
                              <span>{new Date(c.commentDate).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mb-4">No comments yet</p>
                    )}

                    {!isProjectComplete && (
                      <>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full mt-3 p-3 rounded bg-gray-700 text-white border border-gray-600"
                          placeholder="Add a comment..."
                          rows={3}
                        />
                        <button
                          onClick={handleAddComment}
                          className="mt-2 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
                        >
                          Submit Comment
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>

        {/* Add Task Form */}
        {!isProjectComplete && (
          <div className="mb-6 p-4 bg-gray-800 rounded shadow">
            <h3 className="text-xl font-bold mb-3">Add New Task</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task title"
                  className="p-3 rounded w-full bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Task Description</label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="p-3 rounded w-full bg-gray-700 text-white border border-gray-600"
                  rows={3}
                />
              </div>

              <button
                onClick={handleAddTask}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
              >
                Add Task
              </button>
            </div>
          </div>
        )}

        {/* List of Tasks */}
        {tasks.length === 0 ? (
          <p className="text-gray-400 bg-gray-800 p-4 rounded">No tasks assigned to this project yet.</p>
        ) : (
          <div className="bg-gray-800 rounded p-4">
            <ul className="divide-y divide-gray-700">
              {tasks.map((task) => (
                <li key={task.id} className="py-3 flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={task.taskStatus === "COMPLETED"}
                      onChange={() => handleTaskToggle(task)}
                      className="h-5 w-5 rounded border-gray-600 text-green-500 focus:ring-green-500"
                      disabled={isProjectComplete || task.taskStatus === "COMPLETED"}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p
                      className={`font-medium ${
                        task.taskStatus === "COMPLETED" ? "line-through text-gray-500" : "text-white"
                      }`}
                    >
                      {task.task}
                    </p>
                    {task.description && (
                      <p
                        className={`mt-1 text-sm ${
                          task.taskStatus === "COMPLETED" ? "line-through text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.taskStatus === "COMPLETED"
                          ? "bg-green-900 text-green-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {task.taskStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Review Section (Visible only when project is Completed) */}
      {isProjectComplete && (
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-green-300 mb-4">Reviews</h2>

          {/* Existing Reviews */}
          {reviews.length === 0 ? (
            <p className="text-gray-400 bg-gray-800 p-4 rounded mb-4">No reviews have been submitted yet.</p>
          ) : (
            <div className="space-y-3 mb-6">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-gray-800 rounded">
                  <div className="flex justify-between">
                    <p className="font-bold">
                      {r.reviewerName} - Rating: {r.rating}/5
                    </p>
                    <span className="text-sm text-gray-400">{new Date(r.datePosted).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2">{r.review}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Review Form */}
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-xl font-bold mb-3">Add a Review</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Your Review</label>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rating (1-5)</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReviewRating(rating)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        newReviewRating >= rating ? "bg-yellow-500 text-yellow-900" : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddReview}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Section */}
      {expertProfile?.userId && studentDetails?.stdUserId && (
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-4">Chat with Student</h2>
          <div className="bg-gray-800 rounded overflow-hidden">
            <ChatForIndustry expertId={expertProfile.userId} studentId={studentDetails.stdUserId} />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default MilestonePage
