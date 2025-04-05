"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChatForIndustry from "@/app/common_components/ChatforIndustry";
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --------- Interfaces ---------
interface IndustryExpertProfile {
  userId: string;
  indExptId: string; // We'll use this as the "expertId"
  firstName: string;
  lastName: string;
  email: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  achievementDate: string;
}

interface StudentDetails {
  studentId: string;
  firstName: string;
  lastName: string;
  stdUserId: string;
}

interface Comment {
  id: string;
  comment: string;
  commenterName: string;
  commentDate: string;
}

interface TaskItem {
  id: string;
  projectId: string;
  task: string;
  description: string;
  taskStatus: string;
}

interface Review {
  id: string;
  review: string;
  rating: number;
  datePosted: string;
  reviewerName: string;
}

interface ProjectDetailsExtended {
  studentId: string;
  stdUserId: string;
  studentName: string;
  status?: string;
  title: string;
  description: string;
  endDate: string;
  expertName: string;
  indExpertId: string;
  iExptUserId: string;
}

const MilestonePage: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();

  // Logged-in industry expert profile (if available)
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null);
  // Project details and student info
  const [project, setProject] = useState<ProjectDetailsExtended | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  // Milestones and comments
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [currentMilestoneId, setCurrentMilestoneId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  // New Task inputs (visible only to industry experts)
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  // Review state (if needed when project is completed)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<number>(0);
  // Modal state for adding/editing milestones
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  });
  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if the project is completed
  const isProjectComplete = project?.status === "Completed";

  // -----------------------------
  // 1) Fetch Expert, Project Details, and Milestones
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }
      if (!projectId) return;

      try {
        // Get authorized user info
        const authRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!authRes.ok) throw new Error("Failed to get authorized user info.");
        const authData = await authRes.json();

        // Fetch industry expert profile using logged-in user ID
        const expertRes = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${authData.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!expertRes.ok) throw new Error("Failed to fetch industry expert profile.");
        const expertData = await expertRes.json();
        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId,
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          email: expertData.email,
        });

        // Fetch project details (includes student info)
        const projectRes = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!projectRes.ok) throw new Error("Failed to fetch project details.");
        const projectData = await projectRes.json();
        setProject(projectData);
        setStudentDetails({
          studentId: projectData.studentId,
          stdUserId: projectData.stdUserId,
          firstName: projectData.studentName.split(" ")[0] ?? "",
          lastName: projectData.studentName.split(" ")[1] ?? "",
        });

        // Fetch milestones
        const milestonesRes = await fetch(
          `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!milestonesRes.ok) throw new Error("Failed to fetch milestones.");
        const milestonesData = await milestonesRes.json();
        setMilestones(milestonesData);
      } catch (err) {
        console.error(err);
        setError("No progress for now");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, router]);

  // -----------------------------
  // 2) Fetch Comments for a Milestone
  // -----------------------------
  const fetchComments = async (milestoneId: string) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    try {
      const res = await fetch(
        `https://localhost:7053/api/milestone-comment/get-milestone-comments/?milestoneId=${milestoneId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => ({ ...prev, [milestoneId]: typeof data === "string" && data.includes("No comments") ? [] : data }));
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // -----------------------------
  // 3) Add a new comment
  // -----------------------------
  const handleAddComment = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !expertProfile || !currentMilestoneId) return;
    if (!newComment.trim()) return;
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
        }
      );
      if (res.ok) {
        setNewComment("");
        await fetchComments(currentMilestoneId);
      } else {
        console.error("Failed to add comment:", res.status);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // -----------------------------
  // 4) Fetch Tasks
  // -----------------------------
  const fetchTasks = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    try {
      const res = await fetch(
        `https://localhost:7053/api/project-progress/get-tasks/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks:", res.status);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // -----------------------------
  // 5) Handle Task Toggle (Update Task Status)
  // -----------------------------
  const handleTaskToggle = async (task: TaskItem) => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    const newStatus = task.taskStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      const res = await fetch(
        `https://localhost:7053/api/project-progress/update-task/${projectId}/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskStatus: newStatus }),
        }
      );
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, taskStatus: newStatus } : t
          )
        );
      } else {
        console.error("Failed to update task status:", res.status);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // -----------------------------
  // 6) Handle Add Task (Industry Expert adds a new task)
  // -----------------------------
  const handleAddTask = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    if (!newTask.trim() || !newTaskDescription.trim()) {
      toast.error("Please provide both task title and description.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7053/api/project-progress/add-tasks/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ task: newTask, description: newTaskDescription }),
        }
      );
      if (res.ok) {
        toast.success("Task added successfully.");
        setNewTask("");
        setNewTaskDescription("");
        await fetchTasks();
      } else {
        console.error("Failed to add task:", res.status);
        toast.error("Failed to add task.");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Error adding task.");
    }
  };

  // -----------------------------
  // 7) Fetch Reviews (if project is completed)
  // -----------------------------
  const fetchReviews = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    try {
      const res = await fetch(
        `https://localhost:7053/api/reviews/get-reviews/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        console.error("Failed to fetch reviews:", res.status);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // -----------------------------
  // 8) Handle Add Review (Industry Expert adds a review)
  // -----------------------------
  const handleAddReview = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId || !expertProfile) return;
    if (newReviewRating < 1 || newReviewRating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7053/api/reviews/add-review/${projectId}`,
        {
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
        }
      );
      if (res.ok) {
        toast.success("Review added successfully.");
        setNewReviewText("");
        setNewReviewRating(0);
        await fetchReviews();
      } else {
        toast.error("Failed to add review.");
      }
    } catch (err) {
      console.error("Error adding review:", err);
      toast.error("Error adding review.");
    }
  };

  // -----------------------------
  // 9) Handle Mark Project as Complete (Student requests completion)
  // -----------------------------
  const handleCompleteProject = async () => {
    if (
      !window.confirm(
        "Are you sure you want to mark this project as complete? This will send a completion request for industry expert approval."
      )
    )
      return;
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    try {
      const res = await fetch(
        `https://localhost:7053/api/projects/${projectId}/complete`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success("Completion request sent. Await industry expert approval.");
        // Update local project status to indicate pending completion
        setProject((prev) =>
          prev ? { ...prev, status: "PendingCompletion" } : prev
        );
      } else {
        console.error("Failed to request project completion:", res.status);
        toast.error("Failed to send completion request.");
      }
    } catch (err) {
      console.error("Error sending completion request:", err);
      toast.error("Error sending completion request.");
    }
  };

  // Fetch tasks when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  // When project becomes complete, fetch reviews
  useEffect(() => {
    if (project?.status === "Completed") {
      fetchReviews();
    }
  }, [project]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <p>{error}</p>
      </div>
    );
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
            <strong className="text-green-300">Status:</strong> {project?.status}
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
        </div>
        {/* Show student’s "Mark Project as Complete" button only if not pending/completed */}
        {project?.status !== "Completed" && project?.status !== "PendingCompletion" && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCompleteProject}
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500 transition"
            >
              Mark Project as Complete
            </button>
          </div>
        )}
        {project?.status === "PendingCompletion" && (
          <div className="mt-4 text-center text-lg font-semibold text-yellow-500">
            Completion request sent. Awaiting industry expert approval.
          </div>
        )}
        {project?.status === "Completed" && (
          <div className="mt-4 text-center text-lg font-semibold text-green-500">
            This project is complete. Editing is disabled.
          </div>
        )}
      </div>

      {/* Milestones Section */}
      <h2 className="text-2xl font-bold mb-4">Milestones</h2>
      {milestones.length === 0 ? (
        <p className="text-gray-400">No progress for now</p>
      ) : (
        milestones.map((mile) => (
          <div key={mile.id} className="mb-4 p-4 bg-gray-800 rounded shadow">
            <h3 className="text-xl font-semibold">{mile.title}</h3>
            <p>{mile.description}</p>
            <p>
              <strong>Achievement Date:</strong> {mile.achievementDate}
            </p>
            {/* Button to load comments */}
            <button
              onClick={() => {
                setCurrentMilestoneId(mile.id);
                fetchComments(mile.id);
              }}
              className="mt-2 text-blue-400 hover:underline"
            >
              View Comments
            </button>
            {currentMilestoneId === mile.id && (
              <div className="mt-4">
                <h4 className="text-lg font-bold">Comments:</h4>
                {comments[mile.id]?.map((c) => (
                  <div key={c.id} className="mt-2 p-2 bg-gray-700 rounded">
                    <p>{c.comment}</p>
                    <small>
                      - {c.commenterName} on {new Date(c.commentDate).toLocaleString()}
                    </small>
                  </div>
                ))}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full mt-3 p-2 rounded bg-gray-800 text-white"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={handleAddComment}
                  className="mt-2 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
                >
                  Submit Comment
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Tasks Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">To-Do Tasks</h2>
      {/* If the logged-in user is an industry expert, show the Add Task form */}
      {expertProfile && (
        <div className="mb-6 p-4 bg-gray-800 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Add New Task</h3>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task Title"
            className="p-2 rounded w-full bg-gray-700 text-white mb-2"
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task Description"
            className="p-2 rounded w-full bg-gray-700 text-white mb-2"
          />
          <button
            onClick={handleAddTask}
            className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Add Task
          </button>
        </div>
      )}
      {/* List of Tasks */}
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks assigned.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center">
              <input
                type="checkbox"
                checked={task.taskStatus === "COMPLETED"}
                onChange={() => handleTaskToggle(task)}
                className="mr-2"
                disabled={project?.status === "Completed"}
              />
              <div>
                <span
                  className={
                    task.taskStatus === "COMPLETED"
                      ? "line-through text-gray-500 font-bold"
                      : "font-bold"
                  }
                >
                  {task.task}
                </span>
                {task.description && (
                  <p
                    className={
                      task.taskStatus === "COMPLETED"
                        ? "line-through text-gray-500"
                        : "text-gray-400"
                    }
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Review Section (Visible only when project is Completed) */}
      {project?.status === "Completed" && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-green-300 mb-4">Reviews</h2>
          <div>
            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet.</p>
            ) : (
              <ul>
                {reviews.map((r) => (
                  <li key={r.id} className="mb-2 p-2 bg-gray-800 rounded">
                    <p className="font-bold">
                      {r.reviewerName} - Rating: {r.rating}
                    </p>
                    <p>{r.review}</p>
                    <small>{new Date(r.datePosted).toLocaleDateString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Add a Review</h3>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-2 bg-gray-700 rounded mb-2"
            />
            <input
              type="number"
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
              placeholder="Rating (1-5)"
              className="w-full p-2 bg-gray-700 rounded mb-2"
              min={1}
              max={5}
            />
            <button
              onClick={handleAddReview}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Chat Section */}
      {expertProfile?.userId && studentDetails?.stdUserId ? (
        <div className="mt-6">
          <ChatForIndustry expertId={expertProfile.userId} studentId={studentDetails.stdUserId} />
        </div>
      ) : (
        <p className="text-gray-400">Chat is unavailable at the moment.</p>
      )}

      {/* Milestone Modal for Adding/Editing Milestones */}
      {project?.status !== "Completed" && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 w-full max-w-md rounded shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              {editItemId ? "Edit Milestone" : "Add Milestone"}
            </h3>
            <input
              type="text"
              placeholder="Title"
              value={itemFormData.title}
              onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
              className="w-full p-2 mb-2 bg-gray-700 rounded focus:outline-none"
            />
            <textarea
              placeholder="Description"
              value={itemFormData.description}
              onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
              className="w-full p-2 mb-2 bg-gray-700 rounded focus:outline-none"
            />
            <input
              type="date"
              value={itemFormData.achievementDate}
              onChange={(e) =>
                setItemFormData({ ...itemFormData, achievementDate: e.target.value })
              }
              className="w-full p-2 mb-4 bg-gray-700 rounded focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                // onClick={handleSaveItem}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setItemFormData({ title: "", description: "", achievementDate: "" });
                }}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MilestonePage;
