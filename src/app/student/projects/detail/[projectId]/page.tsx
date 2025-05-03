"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { CalendarDays, Award, Star, CheckCircle, MessageSquare, Download, Printer } from "lucide-react"

// Types
interface ProgressItem {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
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
  studentName: string
  stack?: string
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
  review1: string
  rating: number
  datePosted: string
  reviewerName: string
}

const CompletedProjectDetails = () => {
  const { projectId } = useParams()
  const router = useRouter()

  // State
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [milestones, setMilestones] = useState<ProgressItem[]>([])
  const [comments, setComments] = useState<Record<string, MilestoneComment[]>>({})
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch project details
        const projectRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (!projectRes.ok) {
          throw new Error("Failed to fetch project details")
        }

        const projectData = await projectRes.json()
        setProject(projectData)

        // Verify project is completed
        if (projectData.status !== "Completed") {
          router.push(`/student/projects/milestone/${projectId}`)
          return
        }

        // Fetch milestones
        const milestonesRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/get-project-milestones/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (milestonesRes.ok) {
          const milestonesData = await milestonesRes.json()
          setMilestones(
            milestonesData.map((m: ProgressItem) => ({
              ...m,
              isCompleted: true, // All milestones are completed in a completed project
            })),
          )

          // Fetch comments for each milestone
          for (const milestone of milestonesData) {
            await fetchComments(milestone.id)
          }
        }

        // Fetch tasks
        const tasksRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-progress/get-tasks/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }

        // Fetch reviews
        const reviewsRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/reviews/get-reviews/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          setReviews(reviewsData)
        }
      } catch (err) {
        console.error("Error fetching project data:", err)
        setError("Failed to load project data")
        toast.error("Failed to load project data")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId, router])

  // Fetch comments for a milestone
  const fetchComments = async (milestoneId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone-comment/get-milestone-comments/?milestoneId=${milestoneId}`,
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

  // Toggle milestone expansion
  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId)
  }

  // Handle print certificate
  const handlePrintCertificate = () => {
    router.push(`/student/project-certificate/${projectId}`)
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
      ))
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-400 mb-6">Error</h1>
          <p>{error || "Project not found"}</p>
          <button
            onClick={() => router.push("/student")}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with completion badge */}
        <div className="relative mb-8">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-green-400">Completed Project</h1>
            <Link href="/student" className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
              Back to Dashboard
            </Link>
          </div>
          <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full transform rotate-12 shadow-lg">
            Completed!
          </div>
        </div>

        {/* Project details card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-2">{project.title}</h2>
            <p className="text-gray-300 mb-4">{project.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-gray-300">
                  <span className="font-semibold">Completed on:</span> {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center">
                <Award className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-gray-300">
                  <span className="font-semibold">Expert:</span>{" "}
                  <Link
                    href={`/student/industry-profile/${project.indExpertId}`}
                    className="text-green-400 hover:underline"
                  >
                    {project.expertName}
                  </Link>
                </span>
              </div>

              {project.stack && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-300">Tech Stack:</span>
                  <span className="ml-2 text-gray-300">{project.stack}</span>
                </div>
              )}

              <div className="flex items-center">
                <span className="font-semibold text-gray-300">Student:</span>
                <span className="ml-2 text-gray-300">{project.studentName}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handlePrintCertificate}
                className="flex items-center py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
              >
                <Award className="w-5 h-5 mr-2" />
                View Certificate
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print Details
              </button>
            </div>
          </div>
        </div>

        {/* Completed Milestones Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            Achieved Milestones
          </h2>

          {milestones.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">No milestones were recorded for this project.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-200">
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleMilestone(milestone.id)}
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-green-400">{milestone.title}</h3>
                      <p className="text-sm text-gray-400">
                        Achieved on: {new Date(milestone.achievementDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-green-700 text-white text-xs px-3 py-1 rounded-full">Completed</div>
                  </div>

                  {expandedMilestone === milestone.id && (
                    <div className="px-4 pb-4 border-t border-gray-700 pt-3">
                      <p className="text-gray-300 mb-4">{milestone.description}</p>

                      <h4 className="text-sm font-semibold text-green-300 mb-2">Expert Comments:</h4>
                      {comments[milestone.id]?.length > 0 ? (
                        <div className="space-y-3">
                          {comments[milestone.id].map((comment) => (
                            <div key={comment.id} className="bg-gray-700 p-3 rounded">
                              <p className="text-gray-200">{comment.comment}</p>
                              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                <span>{comment.commenterName}</span>
                                <span>{new Date(comment.commentDate).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No comments for this milestone.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            Completed Tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">No tasks were recorded for this project.</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6">
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{task.task}</h4>
                      {task.description && <p className="text-gray-400 text-sm">{task.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Project Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">No reviews have been submitted for this project.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{review.reviewerName}</h3>
                      <div className="flex mt-1">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-sm text-gray-400">{new Date(review.datePosted).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300">{review.review1}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Completion Certificate */}
        <div className="bg-gray-800 rounded-lg p-6 text-center mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Project Completion Certificate</h2>
          <p className="text-gray-300 mb-4">
            Congratulations on completing this project! You can view and download your certificate of completion.
          </p>
          <button
            onClick={handlePrintCertificate}
            className="inline-flex items-center py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            View Certificate
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CompletedProjectDetails
