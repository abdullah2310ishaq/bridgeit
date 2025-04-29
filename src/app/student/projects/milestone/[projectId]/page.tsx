// File: src/app/student/projects/milestone/[projectId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChatForStudent from "@/app/common_components/ChatforStudent";
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------- TypeScript Interfaces ---------- */
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
  taskStatus: "PENDING" | "COMPLETED";
}
interface Review {
  id: string;
  review: string;
  rating: number;
  datePosted: string;
  reviewerName: string;
}
interface ProjectDetailsExtended {
  id: string;
  title: string;
  description: string;
  status: "Active" | "PendingCompletion" | "Completed";
  endDate: string | null;
  indExpertId: string | null;
  iExptUserId: string | null;
  expertName: string | null;
  studentId: string;
  stdUserId: string;
  studentName: string;
}

/* ---------- Component ---------- */
const ProjectProgressTracker: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  /* ----- State ----- */
  const [project, setProject] = useState<ProjectDetailsExtended | null>(null);
  const [studentUserId, setStudentUserId] = useState("");
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [comments, setComments] = useState<Record<string, MilestoneComment[]>>(
    {}
  );
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<number>(0);

  /* ----- Modal (Add / Edit Milestone) ----- */
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  });

  /* ----- UI & Error ----- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ----- Helpers ----- */
  const token = () => localStorage.getItem("jwtToken") ?? "";
  const disableEditing = project?.status !== "Active";

  /* =========================================================
     1) INITIAL LOAD  (project ▸ milestones ▸ comments ▸ tasks)
     ========================================================= */
  useEffect(() => {
    const load = async () => {
      if (!token()) {
        router.push("/auth/login-user");
        return;
      }
      try {
        /* Auth-user info (gets student userId) */
        const auth = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token()}` } }
        ).then((r) => (r.ok ? r.json() : null));
        if (auth) setStudentUserId(auth.userId);

        /* Project details */
        const pj: ProjectDetailsExtended = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token()}` } }
        ).then((r) => {
          if (!r.ok) throw new Error("Project load failed");
          return r.json();
        });
        setProject(pj);

        /* Milestones */
        await refreshMilestones();

        /* Tasks */
        await fetchTasks();

        /* Reviews (if already completed) */
        if (pj.status === "Completed") await fetchReviews();
      } catch (e) {
        console.error(e);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };
    if (projectId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  /* =========================================================
     2) REFRESH MILESTONES (+ pull comments per milestone)
     ========================================================= */
  const refreshMilestones = async () => {
    try {
      const ms: ProgressItem[] = await fetch(
        `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
        { headers: { Authorization: `Bearer ${token()}` } }
      ).then((r) => (r.ok ? r.json() : []));
      const today = new Date().toISOString().split("T")[0];
      setProgressItems(
        ms.map((m) => ({
          ...m,
          isCompleted: m.achievementDate <= today,
          updates: [],
        }))
      );
      /* comments for each milestone */
      for (const m of ms) await fetchComments(m.id);
    } catch (e) {
      console.error(e);
    }
  };

  /* ---- fetchComments ---- */
  const fetchComments = async (milestoneId: string) => {
    try {
      const data: MilestoneComment[] = await fetch(
        `https://localhost:7053/api/milestone-comment/get-milestone-comments/?milestoneId=${milestoneId}`,
        { headers: { Authorization: `Bearer ${token()}` } }
      ).then((r) => (r.ok ? r.json() : []));
      setComments((prev) => ({ ...prev, [milestoneId]: data }));
    } catch (e) {
      console.error(e);
    }
  };

  /* =========================================================
     3) PROJECT COMPLETION REQUEST  (student → expert)
     ========================================================= */
  const handleRequestCompletion = async () => {
    if (disableEditing) return;
    if (
      !window.confirm(
        "Submit completion request to the industry expert? Editing will be disabled."
      )
    )
      return;
    try {
      const res = await fetch(
        `https://localhost:7053/api/projects/request-completion/${projectId}`,
        { method: "POST", headers: { Authorization: `Bearer ${token()}` } }
      );
      if (!res.ok) throw new Error();
      toast.success("Completion request sent. Awaiting approval.");
      setProject((p) => (p ? { ...p, status: "PendingCompletion" } : p));
    } catch {
      toast.error("Failed to send completion request.");
    }
  };

  /* =========================================================
     4) MILESTONE  (Add / Edit)   — industry expert creates;
                                   student only views, but we keep
                                   edit functionality guarded by
                                   disableEditing flag
     ========================================================= */
  const openModal = (item?: ProgressItem) => {
    if (disableEditing) return;
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

  const saveMilestone = async () => {
    if (disableEditing) return;
    try {
      const endpoint = editItemId
        ? `https://localhost:7053/api/milestone/update-milestone?milesstoneId=${editItemId}`
        : `https://localhost:7053/api/milestone/add-milestone/${projectId}`;
      const method = editItemId ? "PUT" : "POST";

      await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(itemFormData),
      });
      await refreshMilestones();
      toast.success(editItemId ? "Milestone updated." : "Milestone added.");
    } catch {
      toast.error("Failed to save milestone.");
    } finally {
      setShowModal(false);
      setItemFormData({ title: "", description: "", achievementDate: "" });
    }
  };

  /* =========================================================
     5) TASKS (student can mark COMPLETE / PENDING only)
     ========================================================= */
  const fetchTasks = async () => {
    const data: TaskItem[] = await fetch(
      `https://localhost:7053/api/project-progress/get-tasks/${projectId}`,
      { headers: { Authorization: `Bearer ${token()}` } }
    ).then((r) => (r.ok ? r.json() : []));
    setTasks(data);
  };

  const toggleTask = async (task: TaskItem) => {
    try {
      await fetch(
        `https://localhost:7053/api/project-progress/marks-as-complete/${projectId}/${task.id}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token()}` } }
      );
      await fetchTasks();
    } catch {
      toast.error("Failed to update task status.");
    }
  };

  /* =========================================================
     6) REVIEWS  (visible + add when Completed)
     ========================================================= */
  const fetchReviews = async () => {
    const data: Review[] = await fetch(
      `https://localhost:7053/api/reviews/get-reviews/${projectId}`,
      { headers: { Authorization: `Bearer ${token()}` } }
    ).then((r) => (r.ok ? r.json() : []));
    setReviews(data);
  };

  const addReview = async () => {
    if (
      newReviewRating < 1 ||
      newReviewRating > 5 ||
      !newReviewText.trim()
    ) {
      toast.error("Please enter review text and rating 1-5.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7053/api/reviews/add-review/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({
            Review: newReviewText,
            Rating: newReviewRating,
          }),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Review added.");
      setNewReviewText("");
      setNewReviewRating(0);
      fetchReviews();
    } catch {
      toast.error("Failed to add review.");
    }
  };

  /* =========================================================
     7) CONDITIONAL FETCH  (reviews after completion)
     ========================================================= */
  useEffect(() => {
    if (project?.status === "Completed") fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.status]);

  /* =========================================================
     RENDER
     ========================================================= */
  if (loading)
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      {/* ---------- Header ---------- */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-green-400">
          Project Progress
        </h1>
        <div className="mt-4 bg-gray-800 p-4 rounded">
          <p className="mb-1">
            <strong className="text-green-300">Title:</strong>{" "}
            {project?.title}
          </p>
          <p className="mb-1">
            <strong className="text-green-300">Description:</strong>{" "}
            {project?.description}
          </p>
          <p className="mb-1">
            <strong className="text-green-300">Status:</strong>{" "}
            {project?.status}
          </p>
          {project?.endDate && (
            <p className="mb-1">
              <strong className="text-green-300">End Date:</strong>{" "}
              {new Date(project.endDate).toLocaleDateString()}
            </p>
          )}
          {project?.indExpertId && project.expertName && (
            <p className="mb-1">
              <strong className="text-green-300">Industry Expert:</strong>{" "}
              <Link
                href={`/student/industry-profile/${project.indExpertId}`}
                className="underline text-green-400 hover:text-green-300"
              >
                {project.expertName}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ---------- Pending Banner / Completion Button ---------- */}
      {project?.status === "PendingCompletion" && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-yellow-700 text-black rounded">
          Completion request sent. Awaiting industry expert approval.
        </div>
      )}
      {project?.status === "Active" && (
        <div className="max-w-4xl mx-auto flex justify-end mb-4">
          <button
            onClick={handleRequestCompletion}
            className="py-2 px-4 bg-red-600 rounded hover:bg-red-500 transition"
          >
            Request Project Completion
          </button>
        </div>
      )}

      {/* ---------- Milestones ---------- */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-300">
            Milestones
          </h2>
          {!disableEditing && (
            <button
              onClick={() => openModal()}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm"
            >
              + Add Milestone
            </button>
          )}
        </div>

        {progressItems.length > 0 ? (
          <MilestoneTimeline milestones={progressItems} />
        ) : (
          <p className="text-center text-gray-400">No milestones found.</p>
        )}

        {/* ------ Comments under each milestone ------ */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-green-300 mb-2">
            Comments
          </h3>
          {progressItems.map((m) => (
            <div key={m.id} className="mb-4 border-b border-gray-700 pb-2">
              <h4 className="font-semibold">{m.title}</h4>
              {(comments[m.id] || []).length > 0 ? (
                comments[m.id].map((c) => (
                  <div key={c.id} className="ml-4 mt-2">
                    <p>{c.comment}</p>
                    <small className="text-gray-400">
                      – {c.commenterName},{" "}
                      {new Date(c.commentDate).toLocaleString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="ml-4 text-gray-500">No comments yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Tasks ---------- */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-semibold text-green-300 mb-2">
          Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks assigned.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-start">
                <input
                  type="checkbox"
                  checked={t.taskStatus === "COMPLETED"}
                  onChange={() => toggleTask(t)}
                  className="mr-2 mt-1"
                />
                <div>
                  <span
                    className={
                      t.taskStatus === "COMPLETED"
                        ? "line-through text-gray-500 font-semibold"
                        : "font-semibold"
                    }
                  >
                    {t.task}
                  </span>
                  {t.description && (
                    <p
                      className={
                        t.taskStatus === "COMPLETED"
                          ? "line-through text-gray-500"
                          : "text-gray-400"
                      }
                    >
                      {t.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- Reviews (after Completed) ---------- */}
      {project?.status === "Completed" && (
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="bg-gray-800 p-4 rounded shadow">
                  <p className="font-bold">
                    {r.reviewerName} – Rating: {r.rating}
                  </p>
                  <p className="mt-2">{r.review}</p>
                  <small className="text-gray-400">
                    {new Date(r.datePosted).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}

          {/* Add review form */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Add a Review</h3>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="Write your review…"
              className="w-full p-2 bg-gray-700 rounded mb-2"
            />
            <input
              type="number"
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(+e.target.value)}
              placeholder="Rating 1-5"
              min={1}
              max={5}
              className="w-full p-2 bg-gray-700 rounded mb-2"
            />
            <button
              onClick={addReview}
              className="py-2 px-4 bg-blue-600 rounded hover:bg-blue-500 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* ---------- Chat ---------- */}
      {studentUserId && project?.iExptUserId ? (
        <div className="max-w-4xl mx-auto mt-10">
          <ChatForStudent
            studentId={studentUserId}
            expertId={project.iExptUserId}
          />
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          Chat is unavailable at the moment.
        </p>
      )}

      {/* ---------- Add / Edit Milestone Modal ---------- */}
      {!disableEditing && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 w-full max-w-md rounded shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              {editItemId ? "Edit Milestone" : "Add Milestone"}
            </h3>
            <input
              type="text"
              placeholder="Title"
              value={itemFormData.title}
              onChange={(e) =>
                setItemFormData({ ...itemFormData, title: e.target.value })
              }
              className="w-full p-2 mb-2 bg-gray-700 rounded"
            />
            <textarea
              placeholder="Description"
              value={itemFormData.description}
              onChange={(e) =>
                setItemFormData({
                  ...itemFormData,
                  description: e.target.value,
                })
              }
              className="w-full p-2 mb-2 bg-gray-700 rounded"
            />
            <input
              type="date"
              value={itemFormData.achievementDate}
              onChange={(e) =>
                setItemFormData({
                  ...itemFormData,
                  achievementDate: e.target.value,
                })
              }
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={saveMilestone}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
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
