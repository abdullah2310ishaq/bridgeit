"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChatForStudent from "@/app/common_components/ChatforStudent";
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --------- Interfaces ---------
interface ProgressUpdate {
  id: string;
  content: string;
  date: string;
}

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  achievementDate: string;
  isCompleted?: boolean;
  updates?: ProgressUpdate[];
}

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  status: string;
  endDate: string;
  expertName: string;
  indExpertId: string;
  iExptUserId: string;
}

interface MilestoneComment {
  id: string;
  comment: string;
  commentDate: string;
  commenterName: string;
  commenter_id: string;
  milestone_id: string;
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

// This interface extends project details with student info (if needed)
interface ProjectDetailsExtended extends ProjectDetails {
  studentId: string;
  stdUserId: string;
  studentName: string;
}

const ProjectProgressTracker: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();

  // State for project details and user info
  const [project, setProject] = useState<ProjectDetailsExtended | null>(null);
  const [studentUserId, setStudentUserId] = useState<string>("");
  const [expertUserId, setExpertUserId] = useState<string>("");
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [comments, setComments] = useState<Record<string, MilestoneComment[]>>({});
  const [currentCommentItem, setCurrentCommentItem] = useState<ProgressItem | null>(null);
  // Tasks state – tasks can be added by the expert and toggled by both expert and student (if allowed)
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  // Review state (displayed when project is completed)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<number>(0);

  // Modal state for add/edit milestone
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  });
  // New Task inputs (visible only to industry experts)
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if project is completed
  const isProjectComplete = project?.status === "Completed";

  // -----------------------------
  // 1) Fetch Project Details, Milestones, and Authorized User Info
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
        // Get authorized user info (student's userId)
        const authRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (authRes.ok) {
          const authData = await authRes.json();
          setStudentUserId(authData.userId);
        }
        // Fetch project details (which includes student info and expert info)
        const resProject = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resProject.ok) {
          const projectData = await resProject.json();
          setProject(projectData);
          setExpertUserId(projectData.iExptUserId);
        }
        // Fetch milestones
        const resMilestones = await fetch(
          `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resMilestones.ok) {
          const data = await resMilestones.json();
          const today = new Date().toISOString().split("T")[0];
          const items = data.map((m: ProgressItem) => ({
            ...m,
            isCompleted: m.achievementDate <= today,
            updates: [],
          }));
          setProgressItems(items);
        } else {
          setProgressItems([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchData();
  }, [projectId, router]);

  // -----------------------------
  // 2) Refresh Milestones
  // -----------------------------
  const refreshProgressItems = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    try {
      const res = await fetch(
        `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const today = new Date().toISOString().split("T")[0];
        const updated = data.map((m: ProgressItem) => {
          const existing = progressItems.find((x) => x.id === m.id);
          return {
            ...m,
            isCompleted: m.achievementDate <= today,
            updates: existing?.updates || [],
          };
        });
        setProgressItems(updated);
      } else {
        setProgressItems([]);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  // -----------------------------
  // 3) Milestone Modal: Add / Edit
  // -----------------------------
  const handleOpenModal = (item?: ProgressItem) => {
    if (item) {
      setEditItemId(item.id);
      setItemFormData({
        title: item.title,
        description: item.description,
        achievementDate: item.achievementDate,
      });
    } else {
      setEditItemId(null);
      setItemFormData({ title: "", description: "", achievementDate: "" });
    }
    setShowModal(true);
  };

  const handleSaveItem = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;
    try {
      if (editItemId) {
        // Edit milestone
        const res = await fetch(
          `https://localhost:7053/api/milestone/update-milestone?milesstoneId=${editItemId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(itemFormData),
          }
        );
        if (!res.ok) console.error("Failed to update milestone. Status:", res.status);
        else await refreshProgressItems();
      } else {
        // Add milestone
        const res = await fetch(
          `https://localhost:7053/api/milestone/add-milestone/${projectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(itemFormData),
          }
        );
        if (!res.ok) console.error("Failed to add milestone. Status:", res.status);
        else await refreshProgressItems();
      }
    } catch (err) {
      console.error("Error saving milestone:", err);
    } finally {
      setShowModal(false);
      setItemFormData({ title: "", description: "", achievementDate: "" });
    }
  };

  // -----------------------------
  // 4) Fetch Comments for a Milestone
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
        setComments((prev) => ({
          ...prev,
          [milestoneId]:
            typeof data === "string" && data.includes("No comments") ? [] : data,
        }));
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // -----------------------------
  // 5) Fetch Tasks
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
  // 6) Handle Task Toggle (Update Task Status)
  // -----------------------------
  const handleTaskToggle = async (task: TaskItem) => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    // Toggle task status
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
          prev.map((t) => (t.id === task.id ? { ...t, taskStatus: newStatus } : t))
        );
      } else {
        console.error("Failed to update task status:", res.status);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // -----------------------------
  // 7) Handle Add Task (Industry Expert adds a new task)
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
  // 8) Handle Add Review (Industry Expert adds review)
  // -----------------------------
  const handleAddReview = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    if (newReviewRating < 1 || newReviewRating > 5 || !newReviewText.trim()) {
      toast.error("Please enter a valid review and a rating between 1 and 5.");
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
            ReviewerId: expertUserId,
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
  // 9) Fetch Reviews (if project is completed)
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
  // 10) Handle Mark Project as Complete (Student requests completion)
  // -----------------------------
  const handleCompleteProject = async () => {
    if (!window.confirm("Are you sure you want to mark this project as complete? Once complete, editing will be disabled.")) return;
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
        toast.success("Project marked as complete.");
        // Update local project state to reflect complete status
        setProject((prev) =>
          prev ? { ...prev, status: "Completed", endDate: new Date().toISOString().split("T")[0] } : prev
        );
      } else {
        console.error("Failed to complete project:", res.status);
        toast.error("Failed to mark project as complete.");
      }
    } catch (err) {
      console.error("Error completing project:", err);
      toast.error("Error marking project as complete.");
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
        {project?.status !== "Completed" && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCompleteProject}
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500 transition"
            >
              Mark Project as Complete
            </button>
          </div>
        )}
        {project?.status === "Completed" && (
          <div className="mt-4 text-center text-lg font-semibold text-green-500">
            This project is complete. Editing is disabled.
          </div>
        )}
      </div>

      {/* Milestones Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-300">Milestones</h2>
          {project?.status !== "Completed" && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm"
            >
              + Add Milestone
            </button>
          )}
        </div>
        {progressItems.length > 0 ? (
          <div className="mt-4 mb-8">
            <h2 className="text-xl font-bold text-green-300 mb-2">Overall Timeline</h2>
            <MilestoneTimeline milestones={progressItems} />
          </div>
        ) : (
          <div className="text-center text-gray-300">
            <p>No milestones found.</p>
            {project?.status !== "Completed" && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-blue-600 hover:bg-blue-500 text-white mt-3 px-4 py-2 rounded text-sm"
              >
                Add First Milestone
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-semibold text-green-300">Tasks</h2>
        {/* Add Task form visible only to industry experts */}
        {expertUserId && (
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
                  className="mt-1 mr-2"
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
      </div>

      {/* Review Section (visible when project is completed) */}
      {project?.status === "Completed" && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-green-300 mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="p-4 bg-gray-700 rounded shadow">
                  <p className="font-bold">
                    {r.reviewerName} - Rating: {r.rating}
                  </p>
                  <p className="mt-2">{r.review}</p>
                  <small className="text-gray-400">
                    Posted on: {new Date(r.datePosted).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
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
      {studentUserId && project?.iExptUserId ? (
        <div className="mt-6">
          <ChatForStudent studentId={studentUserId} expertId={project.iExptUserId} />
        </div>
      ) : (
        <p className="text-gray-400">Chat is unavailable at the moment.</p>
      )}

      {/* Milestone Modal */}
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
                onClick={handleSaveItem}
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

export default ProjectProgressTracker;
