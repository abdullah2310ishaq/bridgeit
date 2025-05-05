"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ChatForStudent from "@/app/common_components/ChatforStudent"
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// --------- Interfaces ---------
interface ProgressUpdate {
  id: string
  content: string
  date: string
}

interface ProgressItem {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
  updates?: ProgressUpdate[]
}

interface ProjectDetails {
  id: string
  title: string
  description: string
  status: string
  endDate: string
  expertName: string
  indExpertId: string
  iExptUserId: string

  link?: string
}

interface MilestoneComment {
  id: string
  comment: string
  commentDate: string
  commenterName: string
  commenter_id: string
  milestone_id: string
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

// This interface extends project details with student info
interface ProjectDetailsExtended extends ProjectDetails {
  studentId: string
  stdUserId: string
  studentName: string
}

const ProjectProgressTracker: React.FC = () => {
  const { projectId } = useParams()
  const router = useRouter()

  // State for project details and user info
  const [project, setProject] = useState<ProjectDetailsExtended | null>(null)
  const [studentUserId, setStudentUserId] = useState<string>("")
  const [expertUserId, setExpertUserId] = useState<string>("")
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([])
  const [comments, setComments] = useState<Record<string, MilestoneComment[]>>({})
  const [currentCommentItem, setCurrentCommentItem] = useState<ProgressItem | null>(null)
  // Tasks state – tasks can be added by the expert and toggled by both expert and student (if allowed)
  const [tasks, setTasks] = useState<TaskItem[]>([])
  // Review state (displayed when project is completed)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReviewText, setNewReviewText] = useState("")
  const [newReviewRating, setNewReviewRating] = useState<number>(0)
  // Project link for deployment
  const [projectLink, setProjectLink] = useState<string>("")
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false)

  // Modal state for add/edit milestone
  const [showModal, setShowModal] = useState(false)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  })
  // New Task inputs (visible only to industry experts)
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Determine if project is completed, pending completion, or payment pending
  const isProjectComplete = project?.status === "Completed"
  const isPendingCompletion = project?.status === "PendingCompletion"
  const isPaymentPending = project?.status === "PaymentPending"

  // Any of these statuses means the project is in final stages and editing should be disabled
  const isEditingDisabled = isProjectComplete || isPendingCompletion || isPaymentPending

  // -----------------------------
  // 1) Fetch Project Details, Milestones, and Authorized User Info
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
        // Get authorized user info (student's userId)
        const authRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (authRes.ok) {
          const authData = await authRes.json()
          setStudentUserId(authData.userId)
        }
        // Fetch project details (which includes student info and expert info)
        const resProject = await fetch(`https://localhost:7053/api/projects/get-project-by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (resProject.ok) {
          const projectData = await resProject.json()
          setProject(projectData)
          setExpertUserId(projectData.iExptUserId)
          if (projectData.link) {
            setProjectLink(projectData.link)
          }
        }
        // Fetch milestones
        const resMilestones = await fetch(`https://localhost:7053/api/milestone/get-project-milestones/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (resMilestones.ok) {
          const data = await resMilestones.json()
          const today = new Date().toISOString().split("T")[0]
          const items = data.map((m: ProgressItem) => ({
            ...m,
            isCompleted: m.achievementDate <= today,
            updates: [],
          }))
          setProgressItems(items)

          // Fetch comments for each milestone
          for (const milestone of items) {
            await fetchComments(milestone.id)
          }
        } else {
          setProgressItems([])
        }

        // Check completion request status
        await checkCompletionRequestStatus()

        // Fetch tasks
        await fetchTasks()

        // If project is completed, fetch reviews
        if (project && (project.status === "Completed" || project.status === "PaymentPending")) {
          await fetchReviews()
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load project data.")
      } finally {
        setLoading(false)
      }
    }
    if (projectId) fetchData()
  }, [projectId, router])

  // -----------------------------
  // 2) Refresh Milestones
  // -----------------------------
  const refreshProgressItems = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return
    try {
      const res = await fetch(`https://localhost:7053/api/milestone/get-project-milestones/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const today = new Date().toISOString().split("T")[0]
        const updated = data.map((m: ProgressItem) => {
          const existing = progressItems.find((x) => x.id === m.id)
          return {
            ...m,
            isCompleted: m.achievementDate <= today,
            updates: existing?.updates || [],
          }
        })
        setProgressItems(updated)

        // Refresh comments for each milestone
        for (const milestone of updated) {
          await fetchComments(milestone.id)
        }
      } else {
        setProgressItems([])
      }
    } catch (err) {
      console.error("Refresh error:", err)
    }
  }

  // -----------------------------
  // 3) Milestone Modal: Add / Edit
  // -----------------------------
  const handleOpenModal = (item?: ProgressItem) => {
    // Prevent editing if project is completed, pending completion, or payment pending
    if (isEditingDisabled) {
      toast.info("Editing is disabled while the project is pending completion, payment, or completed.")
      return
    }

    if (item) {
      setEditItemId(item.id)
      setItemFormData({
        title: item.title,
        description: item.description,
        achievementDate: item.achievementDate,
      })
    } else {
      setEditItemId(null)
      setItemFormData({ title: "", description: "", achievementDate: "" })
    }
    setShowModal(true)
  }

  const handleSaveItem = async () => {
    // Prevent saving if project is completed, pending completion, or payment pending
    if (isEditingDisabled) {
      toast.info("Editing is disabled while the project is pending completion, payment, or completed.")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    // Validate form data
    if (!itemFormData.title.trim()) {
      toast.error("Milestone title is required")
      return
    }
    if (!itemFormData.achievementDate) {
      toast.error("Target date is required")
      return
    }

    try {
      if (editItemId) {
        // Edit milestone
        const res = await fetch(`https://localhost:7053/api/milestone/update-milestone?milesstoneId=${editItemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemFormData),
        })
        if (!res.ok) {
          console.error("Failed to update milestone. Status:", res.status)
          toast.error("Failed to update milestone")
        } else {
          toast.success("Milestone updated successfully")
          await refreshProgressItems()
        }
      } else {
        // Add milestone
        const res = await fetch(`https://localhost:7053/api/milestone/add-milestone/${projectId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemFormData),
        })
        if (!res.ok) {
          console.error("Failed to add milestone. Status:", res.status)
          toast.error("Failed to add milestone")
        } else {
          toast.success("Milestone added successfully")
          await refreshProgressItems()
        }
      }
    } catch (err) {
      console.error("Error saving milestone:", err)
      toast.error("Error saving milestone")
    } finally {
      setShowModal(false)
      setItemFormData({ title: "", description: "", achievementDate: "" })
    }
  }

  // -----------------------------
  // 4) Fetch Comments for a Milestone
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
    // Prevent toggling if project is completed, pending completion, or payment pending
    if (isEditingDisabled) {
      toast.info("Task updates are disabled while the project is pending completion, payment, or completed.")
      return
    }

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
  // 7) Handle Add Review (Student adds review)
  // -----------------------------
  const handleAddReview = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    if (newReviewRating < 1 || newReviewRating > 5 || !newReviewText.trim()) {
      toast.error("Please enter a valid review and a rating between 1 and 5.")
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
          ReviewerId: studentUserId,
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
  // 9) Handle Project Link Submission
  // -----------------------------
  const handleSubmitProjectLink = async () => {
    if (!projectLink.trim()) {
      toast.error("Please enter a valid project link")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      const res = await fetch(`https://localhost:7053/api/projects/deployement/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectLink),
      })

      if (res.ok) {
        toast.success("Project link submitted successfully")
        setProject((prev) => (prev ? { ...prev, link: projectLink } : prev))
        setShowLinkModal(false)

        // Now proceed with the completion request
        await submitCompletionRequest()
      } else {
        const errorText = await res.text()
        console.error("Failed to submit project link:", res.status, errorText)
        toast.error(`Failed to submit project link: ${errorText || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Error submitting project link:", err)
      toast.error(`Error submitting project link: ${err || "Unknown error"}`)
    }
  }

  // -----------------------------
  // 10) Handle Request Project Completion (Student requests completion)
  // -----------------------------
  const handleRequestCompletion = async () => {
    // Prevent sending another request if one is already pending
    if (isPendingCompletion || isPaymentPending || isProjectComplete) {
      toast.info("A completion request is already pending or the project is already completed.")
      return
    }

    // Always show the link modal first when requesting completion
    setShowLinkModal(true)
  }

  // Add a new function to handle the actual completion request submission
  const submitCompletionRequest = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      // Using the correct API endpoint from the controller
      // The API expects a raw GUID in the request body, not a JSON object
      const res = await fetch(`https://localhost:7053/api/request-for-project-completion/put-completion-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectId), // Send the projectId as a raw string
      })

      if (res.ok) {
        toast.success("Completion request sent. Awaiting industry expert approval.")
        // Update local project state to reflect pending completion status
        setProject((prev) => (prev ? { ...prev, status: "PendingCompletion" } : prev))
      } else {
        // Log more detailed error information
        const errorText = await res.text()
        console.error("Failed to request project completion:", res.status, errorText)
        toast.error(`Failed to request project completion: ${res.status} ${errorText || ""}`)
      }
    } catch (err) {
      console.error("Error requesting project completion:", err)
      toast.error(`Error requesting project completion: ${err || "Unknown error"}`)
    }
  }

  // -----------------------------
  // 11) Handle Payment Process (After project is completed)
  // -----------------------------
  const handlePaymentProcess = async () => {
    if (!isProjectComplete) return

    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      // Redirect to payment page
      router.push(`/student/payment/${projectId}`)
    } catch (err) {
      console.error("Error initiating payment:", err)
      toast.error("Error initiating payment process.")
    }
  }

  // Add a function to check completion request status on component load
  const checkCompletionRequestStatus = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId || !studentUserId) return

    try {
      const res = await fetch(
        `https://localhost:7053/api/request-for-project-completion/get-completion-request/${studentUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.ok) {
        const data = await res.json()
        // Check if there's a pending request for this project
        const pendingRequest =
          Array.isArray(data) && data.find((req: any) => req.projectId === projectId && req.status === "PENDING")

        if (pendingRequest) {
          // Update local state to reflect pending completion status
          setProject((prev) => (prev ? { ...prev, status: "PendingCompletion" } : prev))
        }
      }
    } catch (err) {
      console.error("Error checking completion request status:", err)
    }
  }

  // Fetch tasks when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  // When project becomes complete or payment pending, fetch reviews
  useEffect(() => {
    if (project?.status === "Completed" || project?.status === "PaymentPending") {
      fetchReviews()
    }
  }, [project])

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

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-green-400">Project Progress</h1>
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
                      : "bg-blue-900 text-blue-300"
              }`}
            >
              {project?.status}
            </span>
          </p>
          <p className="mb-1">
            <strong className="text-green-300">End Date:</strong> {project?.endDate}
          </p>
          <p className="mb-1">
            <strong className="text-green-300">Industry Expert:</strong>{" "}
            {project?.indExpertId ? (
              <Link
                href={`/student/industry-profile/${project.indExpertId}`}
                className="underline text-green-400 hover:text-green-300"
              >
                {project.expertName}
              </Link>
            ) : (
              "N/A"
            )}
          </p>
          {project?.link && (
            <p className="mb-1">
              <strong className="text-green-300">Project Link:</strong>{" "}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-400 hover:text-green-300"
              >
                {project.link}
              </a>
            </p>
          )}
        </div>

        {/* Project Status Actions */}
        {!isEditingDisabled && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleRequestCompletion}
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500 transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Request Project Completion
            </button>
          </div>
        )}

        {isPendingCompletion && (
          <div className="mt-4 bg-yellow-900 border border-yellow-700 text-yellow-300 p-4 rounded-lg flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-semibold">Completion request pending</p>
              <p className="text-sm">
                Awaiting industry expert approval. Editing is disabled until the request is processed.
              </p>
            </div>
          </div>
        )}

        {isPaymentPending && (
          <div className="mt-4 bg-blue-900 border border-blue-700 text-blue-300 p-4 rounded-lg flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold">Payment pending</p>
              <p className="text-sm">
                Your completion request has been approved. The industry expert will now process the payment.
              </p>
            </div>
          </div>
        )}

        {isProjectComplete && (
          <div className="mt-4 flex flex-col space-y-4">
            <div className="bg-green-900 border border-green-700 text-green-300 p-4 rounded-lg flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>This project is complete. Editing is disabled.</span>
            </div>

            <Link
              href={`/student/project-certificate/${projectId}`}
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition self-end flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              View Completion Certificate
            </Link>
          </div>
        )}
      </div>

      {/* Milestones Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-300">Milestones</h2>
          {!isEditingDisabled && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Milestone
            </button>
          )}
        </div>
        {progressItems.length > 0 ? (
          <div>
            <div className="mt-4 mb-8">
              <h2 className="text-xl font-bold text-green-300 mb-2">Overall Timeline</h2>
              <MilestoneTimeline milestones={progressItems} />
            </div>

            {/* Individual Milestones with Comments */}
            <div className="space-y-6">
              {progressItems.map((milestone) => (
                <div key={milestone.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-green-400">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Target date: {new Date(milestone.achievementDate).toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            milestone.isCompleted ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"
                          }`}
                        >
                          {milestone.isCompleted ? "Completed" : "In Progress"}
                        </span>
                      </div>
                    </div>

                    {!isEditingDisabled && (
                      <button
                        onClick={() => handleOpenModal(milestone)}
                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded mt-2"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4 border-t border-gray-700 pt-3">
                    <h4 className="text-sm font-semibold text-green-300 mb-2">Expert Comments</h4>
                    {comments[milestone.id] && comments[milestone.id].length > 0 ? (
                      <div className="space-y-3">
                        {comments[milestone.id].map((comment) => (
                          <div key={comment.id} className="bg-gray-700 p-3 rounded">
                            <p className="text-sm">{comment.comment}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-400">{comment.commenterName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.commentDate).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-400 mb-6">No milestones found for this project.</p>
            {!isEditingDisabled && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Milestone
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-semibold text-green-300">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400 mt-4 bg-gray-800 p-4 rounded">No tasks assigned.</p>
        ) : (
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <ul className="divide-y divide-gray-700">
              {tasks.map((task) => (
                <li key={task.id} className="py-3 flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={task.taskStatus === "COMPLETED"}
                      onChange={() => handleTaskToggle(task)}
                      className="h-5 w-5 rounded border-gray-600 text-green-500 focus:ring-green-500"
                      disabled={isEditingDisabled}
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

      {/* Review Section (visible when project is completed) */}
      {(isProjectComplete || isPaymentPending) && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-green-300 mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400 bg-gray-800 p-4 rounded">No reviews have been submitted yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="p-4 bg-gray-700 rounded shadow">
                  <p className="font-bold">
                    {r.reviewerName} - Rating: {r.rating}
                  </p>
                  <p className="mt-2">{r.review}</p>
                  <small className="text-gray-400">Posted on: {new Date(r.datePosted).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 bg-gray-800 p-4 rounded">
            <h3 className="text-xl font-bold mb-2">Add a Review</h3>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-3 bg-gray-700 rounded mb-3 border border-gray-600"
              rows={4}
            />
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Rating</label>
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
      )}

      {/* Chat Section */}
      {studentUserId && project?.iExptUserId ? (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-xl font-semibold text-green-300 mb-4">Chat with Expert</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <ChatForStudent studentId={studentUserId} expertId={project.iExptUserId} />
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mt-8 text-center">Chat is unavailable at the moment.</p>
      )}

      {/* Milestone Modal */}
      {!isEditingDisabled && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 w-full max-w-md rounded shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-4">{editItemId ? "Edit Milestone" : "Add Milestone"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Complete Research Phase"
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  placeholder="Describe what needs to be accomplished"
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={itemFormData.achievementDate}
                  onChange={(e) => setItemFormData({ ...itemFormData, achievementDate: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false)
                  setItemFormData({ title: "", description: "", achievementDate: "" })
                }}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button onClick={handleSaveItem} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white">
                {editItemId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 w-full max-w-md rounded shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-4">Submit Project Link</h3>
            <p className="text-gray-300 mb-4">
              Please provide a link to your deployed project before requesting completion.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://your-project-url.com"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProjectLink}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
              >
                Submit & Request Completion
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default ProjectProgressTracker
