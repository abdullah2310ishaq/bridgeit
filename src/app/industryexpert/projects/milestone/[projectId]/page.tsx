"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatForIndustry from "@/app/common_components/ChatforIndustry";

// ----- Interfaces -----
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

// New interface for To-Do Tasks (Project Progress Tasks)
interface TaskItem {
  id: string;
  projectId: string;
  task: string;
  description: string;
  taskStatus: string;
}

const MilestonePage: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();

  // Logged-in Industry Expert info
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null);

  // Project / Milestone data
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);

  // Comments
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [currentMilestoneId, setCurrentMilestoneId] = useState<string | null>(null);

  // To-Do Tasks (Project Progress Tasks)
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // 1) Check Auth & Fetch Expert, Milestones, and Project Details
  // -----------------------------
  useEffect(() => {
    const fetchExpertAndMilestones = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        // If no token, redirect to login
        router.push("/auth/login-user");
        return;
      }
      if (!projectId) return;

      try {
        // A) Get current user's ID
        const authRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!authRes.ok) {
          throw new Error("Failed to get authorized user info.");
        }
        const authData = await authRes.json();
        const userId = authData.userId;

        // B) Fetch the industry expert profile by userId
        const expertRes = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!expertRes.ok) {
          throw new Error("Failed to fetch industry expert profile.");
        }
        const expertData = await expertRes.json();
        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId, // We'll need this for adding a comment
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          email: expertData.email,
        });

        // C) Fetch the project details (including student info)
        const projectRes = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!projectRes.ok) {
          throw new Error("Failed to fetch project details.");
        }
        const projectData = await projectRes.json();
        setStudentDetails({
          studentId: projectData.studentId,
          stdUserId: projectData.stdUserId,
          firstName: projectData.studentName.split(" ")[0] ?? "",
          lastName: projectData.studentName.split(" ")[1] ?? "",
        });

        // D) Fetch project milestones
        const milestonesRes = await fetch(
          `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!milestonesRes.ok) {
          throw new Error("Failed to fetch milestones.");
        }
        const milestonesData = await milestonesRes.json();
        setMilestones(milestonesData);
      } catch (err) {
        console.error(err);
        setError("No progress for now");
      } finally {
        setLoading(false);
      }
    };

    fetchExpertAndMilestones();
  }, [projectId, router]);

  // -----------------------------
  // 2) Fetch Comments for a specific milestone
  // -----------------------------
  const fetchComments = async (milestoneId: string) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const res = await fetch(
        `https://localhost:7053/api/milestone-comment/get-milestone-comments/?milestoneId=${milestoneId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (typeof data === "string" && data.includes("No comments")) {
          setComments((prev) => ({ ...prev, [milestoneId]: [] }));
        } else {
          setComments((prev) => ({ ...prev, [milestoneId]: data }));
        }
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
    if (!token || !expertProfile) return; // need both token & expert

    if (!newComment.trim() || !currentMilestoneId) return;

    try {
      // We'll use the expertProfile.indExptId as the "expertId" param
      const res = await fetch(
        `https://localhost:7053/api/milestone-comment/add-milestone-comment?milestoneId=${currentMilestoneId}&expertId=${expertProfile.indExptId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // The server wants a raw JSON string in the body:
          body: JSON.stringify(newComment),
        }
      );

      if (res.ok) {
        // Clear the input
        setNewComment("");
        // Refresh comments for this milestone
        await fetchComments(currentMilestoneId);
      } else {
        console.error("Failed to add comment:", res.status);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // -----------------------------
  // 4) Fetch To-Do Tasks (Project Progress Tasks)
  // -----------------------------
  const fetchTasks = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    try {
      const res = await fetch(
        `https://localhost:7053/api/project-progress/get-tasks/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
  // 5) Add a new Task
  // -----------------------------
  const handleAddTask = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;
    if (!newTask.trim() || !newTaskDescription.trim()) return;

    try {
      const res = await fetch(
        `https://localhost:7053/api/project-progress/add-tasks/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task: newTask,
            description: newTaskDescription,
          }),
        }
      );

      if (res.ok) {
        // Clear the input fields
        setNewTask("");
        setNewTaskDescription("");
        // Refresh the tasks list
        await fetchTasks();
      } else {
        console.error("Failed to add task:", res.status);
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Optional: Navigate to the student's profile
  const handleViewStudentProfile = () => {
    if (studentDetails?.studentId) {
      router.push(`/industryexpert/student-profile/${studentDetails.studentId}`);
    }
  };

  // -----------------------------
  // Fetch tasks when projectId changes
  // -----------------------------
  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  // -----------------------------
  // 6) Handle Task Toggle (Update Task Status)
  // -----------------------------
  const handleTaskToggle = async (task: TaskItem) => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !projectId) return;

    // Toggle the status
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

  // =============================
  // Render
  // =============================
  if (loading) {
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Project Milestones</h1>

      {/* Student Info */}
      {studentDetails && (
        <div className="p-6 mb-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Assigned Student</h2>
          <p className="text-xl font-semibold">
            {studentDetails.firstName} {studentDetails.lastName}
          </p>
          <button
            onClick={handleViewStudentProfile}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            View Profile
          </button>
        </div>
      )}

      {/* Milestones */}
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

            {/* If this milestone is selected, show its comments & add-new-comment form */}
            {currentMilestoneId === mile.id && (
              <div className="mt-4">
                <h4 className="text-lg font-bold">Comments:</h4>
                {comments[mile.id]?.map((c) => (
                  <div key={c.id} className="mt-2 p-2 bg-gray-700 rounded">
                    <p>{c.comment}</p>
                    <small>
                      - {c.commenterName} on{" "}
                      {new Date(c.commentDate).toLocaleString()}
                    </small>
                  </div>
                ))}

                {/* Add a comment */}
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

      {/* To-Do Tasks Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">To-Do Tasks</h2>
      <div className="mb-6 p-4 bg-gray-800 rounded shadow">
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

      {/* List of Existing Tasks with Checkbox Toggle */}
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks added yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center">
              <input
                type="checkbox"
                checked={task.taskStatus === "COMPLETED"}
                onChange={() => handleTaskToggle(task)}
                className="mr-2"
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

      {/* Chat Section */}
      {expertProfile?.userId && studentDetails?.stdUserId ? (
        <div className="mt-6">
          <ChatForIndustry expertId={expertProfile.userId} studentId={studentDetails.stdUserId} />
        </div>
      ) : (
        <p className="text-gray-400">Chat is unavailable at the moment.</p>
      )}
    </div>
  );
};

export default MilestonePage;
