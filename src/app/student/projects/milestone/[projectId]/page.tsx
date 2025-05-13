"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import ChatForStudent from "@/app/common_components/ChatforStudent"
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Star,
  User,
  X,
  CheckSquare,
  Square,
  Plus,
  ArrowLeft,
  Award,
  MessageSquare,
} from "lucide-react"

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

  // Active tab state
  const [activeTab, setActiveTab] = useState<"milestones" | "tasks" | "reviews" | "chat">("milestones")

  // Determine if project is completed, pending completion, or payment pending
  const isProjectComplete = project?.status === "Completed"
  const isPendingCompletion = project?.status === "PendingCompletion"
  const isPaymentPending = project?.status === "PaymentPending"

  // Any of these statuses means the project is in final stages and editing should be disabled
  const isEditingDisabled = isProjectComplete || isPendingCompletion || isPaymentPending

  // Calculate project progress
  const calculateProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.taskStatus === "COMPLETED").length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  // Get project image based on title or description
  const getProjectImage = () => {
    if (!project) return "/project-management-teamwork.png"

    const title = project.title.toLowerCase()
    const description = project.description.toLowerCase()

    if (title.includes("web") || description.includes("web")) {
      return "/web-development-concept.png"
    } else if (
      title.includes("mobile") ||
      description.includes("mobile") ||
      title.includes("app") ||
      description.includes("app")
    ) {
      return "/mobile-app-development.png"
    } else if (
      title.includes("ai") ||
      description.includes("ai") ||
      title.includes("machine learning") ||
      description.includes("machine learning")
    ) {
      return "/artificial-intelligence-network.png"
    } else if (title.includes("data") || description.includes("data")) {
      return "/data-science-concept.png"
    } else {
      return "/technology-project.png"
    }
  }

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
  // 9) Handle Request Project Completion (Student requests completion)
  // -----------------------------
  const handleRequestCompletion = async () => {
    // Prevent sending another request if one is already pending
    if (isPendingCompletion || isPaymentPending || isProjectComplete) {
      toast.info("A completion request is already pending or the project is already completed.")
      return
    }

    if (
      !window.confirm(
        "Are you sure you want to request project completion? This will notify the industry expert for approval.",
      )
    )
      return
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
  // 10) Handle Payment Process (After project is completed)
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-300">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full border border-gray-700">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-900/30 rounded-full">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-200 mb-4">Error Loading Project</h2>
          <p className="text-gray-400 text-center mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getProjectImage() || "/placeholder.svg"}
            alt={project?.title || "Project Banner"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-gray-800/50 hover:bg-gray-800/70 backdrop-blur-sm text-white rounded-full p-2 transition duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            {project?.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 flex flex-wrap gap-2"
          >
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                project?.status === "Completed"
                  ? "bg-green-900/70 text-green-300"
                  : project?.status === "PendingCompletion"
                    ? "bg-yellow-900/70 text-yellow-300"
                    : project?.status === "PaymentPending"
                      ? "bg-blue-900/70 text-blue-300"
                      : "bg-gray-800/70 text-gray-300"
              }`}
            >
              {project?.status === "Completed" && <CheckCircle className="mr-1 h-4 w-4" />}
              {project?.status === "PendingCompletion" && <Clock className="mr-1 h-4 w-4" />}
              {project?.status === "PaymentPending" && <DollarSign className="mr-1 h-4 w-4" />}
              {project?.status}
            </span>
            <span className="bg-gray-800/70 text-gray-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Due: {new Date(project?.endDate || "").toLocaleDateString()}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-200 mb-4">Project Details</h2>
                <p className="text-gray-400 mb-6">{project?.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Student</p>
                      <p className="font-medium text-gray-300">{project?.studentName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry Expert</p>
                      <p className="font-medium text-gray-300">{project?.expertName || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-3">
                      <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium text-gray-300">
                        {new Date(project?.endDate || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 px-6 py-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-blue-400">{calculateProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Status Actions */}
            {!isEditingDisabled && (
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-200 mb-4">Project Actions</h3>
                  <button
                    onClick={handleRequestCompletion}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Request Project Completion
                  </button>
                </div>
              </div>
            )}

            {isPendingCompletion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border-l-4 border-yellow-500 border-t border-r border-b border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-900/50 rounded-full p-2 mr-3">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-200">Completion Request Pending</h3>
                  </div>
                  <p className="text-gray-400">
                    Your completion request has been sent to the industry expert. Editing is disabled until the request
                    is processed.
                  </p>
                </div>
              </motion.div>
            )}

            {isPaymentPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border-l-4 border-blue-500 border-t border-r border-b border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-900/50 rounded-full p-2 mr-3">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-200">Payment Pending</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Your completion request has been approved. The industry expert will now process the payment.
                  </p>
                </div>
              </motion.div>
            )}

            {isProjectComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border-l-4 border-green-500 border-t border-r border-b border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-900/50 rounded-full p-2 mr-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-200">Project Completed</h3>
                  </div>
                  <p className="text-gray-400 mb-4">This project is complete. Editing is disabled.</p>
                  <Link
                    href={`/student/project-certificate/${projectId}`}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <Award className="mr-2 h-5 w-5" />
                    View Completion Certificate
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
              <div className="border-b border-gray-700">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("milestones")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "milestones"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    Milestones
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "tasks"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    Tasks
                  </button>
                  {(isProjectComplete || isPaymentPending) && (
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-4 px-6 font-medium text-sm border-b-2 ${
                        activeTab === "reviews"
                          ? "border-blue-500 text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      Reviews
                    </button>
                  )}
                  {studentUserId && expertUserId && (
                    <button
                      onClick={() => setActiveTab("chat")}
                      className={`py-4 px-6 font-medium text-sm border-b-2 ${
                        activeTab === "chat"
                          ? "border-blue-500 text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      Chat
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Milestones Tab */}
                {activeTab === "milestones" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-200">Project Milestones</h2>
                      {!isEditingDisabled && (
                        <button
                          onClick={() => handleOpenModal()}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center"
                        >
                          <Plus className="w-5 h-5 mr-1" />
                          Add Milestone
                        </button>
                      )}
                    </div>

                    {progressItems.length > 0 ? (
                      <div>
                        <div className="mt-4 mb-8">
                          <h3 className="text-lg font-bold text-gray-200 mb-4">Overall Timeline</h3>
                          <MilestoneTimeline milestones={progressItems} />
                        </div>

                        {/* Individual Milestones with Comments */}
                        <div className="space-y-6">
                          {progressItems.map((milestone, index) => (
                            <motion.div
                              key={milestone.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
                            >
                              <div className="p-5">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start">
                                    <div
                                      className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                                        milestone.isCompleted ? "bg-green-900/30" : "bg-yellow-900/30"
                                      }`}
                                    >
                                      {milestone.isCompleted ? (
                                        <CheckCircle className={`h-5 w-5 text-green-400`} />
                                      ) : (
                                        <Clock className={`h-5 w-5 text-yellow-400`} />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-200">{milestone.title}</h3>
                                      <p className="text-gray-400 mt-1">{milestone.description}</p>
                                      <div className="flex items-center mt-2">
                                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                        <p className="text-sm text-gray-500">
                                          Target date: {new Date(milestone.achievementDate).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        milestone.isCompleted
                                          ? "bg-green-900/50 text-green-300"
                                          : "bg-yellow-900/50 text-yellow-300"
                                      }`}
                                    >
                                      {milestone.isCompleted ? "Completed" : "In Progress"}
                                    </span>
                                    {!isEditingDisabled && (
                                      <button
                                        onClick={() => handleOpenModal(milestone)}
                                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Comments Section */}
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Expert Comments</h4>
                                  {comments[milestone.id] && comments[milestone.id].length > 0 ? (
                                    <div className="space-y-3">
                                      {comments[milestone.id].map((comment) => (
                                        <div key={comment.id} className="bg-gray-700 p-3 rounded">
                                          <p className="text-sm text-gray-300">{comment.comment}</p>
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
                                    <p className="text-sm text-gray-500 italic">No comments yet</p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-gray-800 rounded-lg border border-gray-700">
                        <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-6">No milestones found for this project.</p>
                        {!isEditingDisabled && (
                          <button
                            onClick={() => handleOpenModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Your First Milestone
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tasks Tab */}
                {activeTab === "tasks" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-200">Project Tasks</h2>
                    </div>

                    {tasks.length === 0 ? (
                      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
                        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No tasks assigned to this project yet.</p>
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg border border-gray-700">
                        <ul className="divide-y divide-gray-700">
                          {tasks.map((task, index) => (
                            <motion.li
                              key={task.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 hover:bg-gray-700/50"
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 pt-1">
                                  <button
                                    onClick={() => handleTaskToggle(task)}
                                    disabled={isEditingDisabled || task.taskStatus === "COMPLETED"}
                                    className="focus:outline-none"
                                  >
                                    {task.taskStatus === "COMPLETED" ? (
                                      <CheckSquare className="h-5 w-5 text-green-400" />
                                    ) : (
                                      <Square className="h-5 w-5 text-gray-500" />
                                    )}
                                  </button>
                                </div>
                                <div className="ml-3 flex-1">
                                  <p
                                    className={`font-medium ${
                                      task.taskStatus === "COMPLETED" ? "line-through text-gray-500" : "text-gray-300"
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
                                        ? "bg-green-900/50 text-green-300"
                                        : "bg-yellow-900/50 text-yellow-300"
                                    }`}
                                  >
                                    {task.taskStatus}
                                  </span>
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (isProjectComplete || isPaymentPending) && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-200">Project Reviews</h2>
                    </div>

                    {/* Existing Reviews */}
                    {reviews.length === 0 ? (
                      <div className="bg-gray-800 rounded-lg p-6 text-center mb-6 border border-gray-700">
                        <Star className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No reviews have been submitted yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6">
                        {reviews.map((review, index) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-5"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-200">{review.reviewerName}</p>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-400">{review.rating}/5</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.datePosted).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-3 text-gray-300">{review.review}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Add Review Form */}
                    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-200 mb-4">Add a Review</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="review-text" className="block text-sm font-medium text-gray-300 mb-1">
                            Your Review
                          </label>
                          <textarea
                            id="review-text"
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setNewReviewRating(rating)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  newReviewRating >= rating
                                    ? "bg-yellow-500 text-yellow-900"
                                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleAddReview}
                          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                        >
                          <Star className="mr-2 h-5 w-5" />
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Tab */}
                {activeTab === "chat" && studentUserId && expertUserId && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-200">Chat with Expert</h2>
                    </div>

                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="p-4 bg-gray-700 flex items-center">
                        <div className="bg-blue-900/30 rounded-full p-2 mr-3">
                          <MessageSquare className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-200">
                          {project?.expertName ? `Chat with ${project.expertName}` : "Expert Chat"}
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-400 mb-4">
                          Use the chat button in the bottom right corner to communicate with your industry expert.
                        </p>
                        <ChatForStudent
                          studentId={studentUserId}
                          expertId={expertUserId}
                          expertName={project?.expertName}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Modal */}
      {!isEditingDisabled && showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 p-6 w-full max-w-md rounded-lg shadow-xl border border-gray-700"
          >
            <h3 className="text-xl font-bold text-blue-400 mb-4">{editItemId ? "Edit Milestone" : "Add Milestone"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Complete Research Phase"
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  placeholder="Describe what needs to be accomplished"
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={itemFormData.achievementDate}
                  onChange={(e) => setItemFormData({ ...itemFormData, achievementDate: e.target.value })}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
              >
                {editItemId ? "Update" : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer theme="dark" />
    </div>
  )
}

export default ProjectProgressTracker
