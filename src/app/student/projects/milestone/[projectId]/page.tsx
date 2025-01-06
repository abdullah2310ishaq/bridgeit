"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ChatSignalR from "@/app/common_components/ChatSignalR";
import ChatForStudent from "@/app/common_components/ChatforStudent";
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline";

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

// For milestone comments
interface MilestoneComment {
  id: string;
  comment: string;
  commentDate: string;
  commenterName: string;
  commenter_id: string;
  milestone_id: string;
}

const ProjectProgressTracker: React.FC = () => {
  const { projectId } = useParams();

  // ------------------- State -------------------
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [studentUserId, setStudentUserId] = useState<string>("");
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [comments, setComments] = useState<Record<string, MilestoneComment[]>>({});
  const [currentCommentItem, setCurrentCommentItem] = useState<ProgressItem | null>(null);
  const[expertUserId, setExpertUserId] = useState<string>("");

  
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<ProgressItem | null>(null);
  const [newUpdate, setNewUpdate] = useState({ content: "", date: new Date().toISOString().split("T")[0] });

  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null); // if null => adding
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  });

  const [loading, setLoading] = useState(true);

  // ------------------- Fetch Project & Milestones -------------------
  useEffect(() => {
    const fetchProjectAndProgress = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setLoading(false);
        return;
      }

      
      try {


        const authRes = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (authRes.ok) {
          const authData = await authRes.json();
          setStudentUserId(authData.userId);
        }
        
        // 1) Fetch project details
        const resProject = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resProject.ok) {
          const projectData = await resProject.json();
          setProject(projectData);
          setExpertUserId(projectData.iExptUserId);

        }

        // 2) Fetch milestones
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
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectAndProgress();
  }, [projectId]);

  // ------------------- Refresh Progress Items -------------------
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
        // keep existing local updates
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

  // ------------------- Add / Edit a Progress Item -------------------
  const handleOpenModal = (item?: ProgressItem) => {
    // If item is provided, we are editing
    if (item) {
      setEditItemId(item.id);
      setItemFormData({
        title: item.title,
        description: item.description,
        achievementDate: item.achievementDate,
      });
    } else {
      // otherwise, adding
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
        // editing
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
        if (!res.ok) {
          console.error("Failed to update item. Status:", res.status);
        } else {
          await refreshProgressItems();
        }
      } else {
        // adding
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
        if (!res.ok) {
          console.error("Failed to add item. Status:", res.status);
        } else {
          await refreshProgressItems();
        }
      }
    } catch (err) {
      console.error("Error saving item:", err);
    } finally {
      setShowModal(false);
      setItemFormData({ title: "", description: "", achievementDate: "" });
    }
  };

  // ------------------- Local "Follow-up" Update -------------------
  const handleAddLocalUpdate = () => {
    if (!currentItem) return;
    const updateObj: ProgressUpdate = {
      id: Date.now().toString(),
      content: newUpdate.content,
      date: newUpdate.date,
    };
    const updated = progressItems.map((p) =>
      p.id === currentItem.id
        ? { ...p, updates: [...(p.updates || []), updateObj] }
        : p
    );
    setProgressItems(updated);
    setShowUpdateModal(false);
    setNewUpdate({ content: "", date: new Date().toISOString().split("T")[0] });
  };

  // ------------------- Fetch Comments for a Milestone -------------------
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

  // ------------------- Render -------------------
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        Loading...
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
      </div>

      {/* Progress Items */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-300">Milestones</h2>
          <button
            onClick={() => handleOpenModal()}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm"
          >
            + Add Milestone
          </button>
        </div>
        {progressItems.length > 0 && (
  <div className="mt-4 mb-8">
    <h2 className="text-xl font-bold text-green-300 mb-2">Overall Timeline</h2>
    <MilestoneTimeline milestones={progressItems} />
  </div>
)}
        {progressItems.length === 0 ? (
          <div className="text-center text-gray-300">
            <p>No milestones found.</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-500 text-white mt-3 px-4 py-2 rounded text-sm"
            >
              Add First Milestone
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {progressItems.map((item) => (
              <div key={item.id} className="bg-gray-800 p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-green-400">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </div>
                  {item.isCompleted ? (
                    <span className="text-xs bg-green-700 text-green-100 px-2 py-1 rounded">
                      Done
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Target Date: {item.achievementDate}
                </p>

                {/* Action Buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Edit Milestone */}
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="text-blue-400 text-xs hover:underline"
                  >
                    Edit
                  </button>

                  {/* Local Update */}
                  <button
                    onClick={() => {
                      setCurrentItem(item);
                      setShowUpdateModal(true);
                    }}
                    className="text-yellow-400 text-xs hover:underline"
                  >
                    + Follow-up
                  </button>

                  {/* View Comments */}
                  <button
                    onClick={() => {
                      setCurrentCommentItem(item);
                      fetchComments(item.id);
                    }}
                    className="text-purple-400 text-xs hover:underline"
                  >
                    Comments
                  </button>
                </div>

                {/* Existing Local "updates" */}
                {item.updates && item.updates.length > 0 && (
                  <div className="mt-3 border-l border-gray-700 pl-3">
                    <p className="text-sm font-semibold text-green-300 mb-1">
                      Updates:
                    </p>
                    {item.updates.map((u) => (
                      <div key={u.id} className="text-xs text-gray-200 mb-2">
                        <p>- {u.content}</p>
                        <p className="text-gray-500">{u.date}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* If we're viewing comments for THIS milestone, show them */}
                {currentCommentItem && currentCommentItem.id === item.id && (
                  <div className="mt-3 border-l border-gray-700 pl-3">
                    <p className="text-sm font-semibold text-purple-300 mb-1">
                      Comments:
                    </p>
                    {comments[item.id]?.length ? (
                      comments[item.id].map((c) => (
                        <div
                          key={c.id}
                          className="bg-gray-700 p-2 rounded mb-2 text-sm"
                        >
                          <p className="text-gray-200">{c.comment}</p>
                          <p className="text-gray-400 text-xs">
                            {c.commenterName} on{" "}
                            {new Date(c.commentDate).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-xs">
                        No comments found.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Unified Modal for Add/Edit Milestone ---------- */}
      {showModal && (
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
              className="w-full p-2 mb-2 bg-gray-700 rounded focus:outline-none"
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
              className="w-full p-2 mb-2 bg-gray-700 rounded focus:outline-none"
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

      {/* ---------- Modal for a "Follow-up" Update ---------- */}
      {showUpdateModal && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 w-full max-w-md rounded shadow-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              Follow-up for: {currentItem.title}
            </h3>
            <textarea
              placeholder="What's the update?"
              value={newUpdate.content}
              onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
              className="w-full p-2 mb-2 bg-gray-700 rounded focus:outline-none"
            />
            <input
              type="date"
              value={newUpdate.date}
              onChange={(e) => setNewUpdate({ ...newUpdate, date: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 rounded focus:outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleAddLocalUpdate}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setNewUpdate({ content: "", date: new Date().toISOString().split("T")[0] });
                }}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
   {studentUserId && project?.iExptUserId ? (
  <div className="mt-6">
    <ChatForStudent studentId={studentUserId} expertId={project.iExptUserId} />
  </div>
) : (
  <p className="text-gray-400">Chat is unavailable at the moment.</p>
)}


    </div>
  );
};

export default ProjectProgressTracker;
