"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// --------- Interfaces ---------
interface MilestoneUpdate {
  id: string;
  content: string;
  date: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  achievementDate: string;
  isCompleted?: boolean;     // added to track completion
  updates?: MilestoneUpdate[]; // new field for milestone updates
}

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  status: string;
  endDate: string;
  expertName: string;
  indExpertId: string; // Industry Expert ID
}

const ProjectMilestonePage: React.FC = () => {
  const { projectId } = useParams();

  // --------- State ---------
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For Add/Edit Milestone
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editMilestoneId, setEditMilestoneId] = useState<string | null>(null);

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    achievementDate: "",
  });

  // For Adding an Update (Follow-up) to a Milestone
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [newUpdate, setNewUpdate] = useState({
    content: "",
    date: new Date().toISOString().split("T")[0], // default: today's date
  });

  // --------- Fetch Project & Milestones ---------
  useEffect(() => {
    const fetchProjectAndMilestones = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        // -- 1) Fetch Project Details
        const projectRes = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!projectRes.ok) throw new Error("Failed to fetch project details.");
        const projectData = await projectRes.json();
        setProject(projectData);

        // -- 2) Fetch Milestones
        const milestonesRes = await fetch(
          `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!milestonesRes.ok)
          throw new Error("Failed to fetch milestones for the project.");
        const milestonesData = await milestonesRes.json();

        // For demonstration, add `isCompleted` and empty `updates` array.
        // You might base 'completed' logic on real fields or statuses from your DB.
        const today = new Date().toISOString().split("T")[0];
        const updatedMilestones: Milestone[] = milestonesData.map((m: Milestone) => {
          return {
            ...m,
            isCompleted: m.achievementDate <= today, // example logic
            updates: [],
          };
        });
        setMilestones(updatedMilestones);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectAndMilestones();
  }, [projectId]);

  // --------- Add Milestone ---------
  const addMilestone = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(
        `https://localhost:7053/api/milestone/add-milestone/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMilestone),
        }
      );
      if (!res.ok) throw new Error("Failed to add milestone.");

      // Refresh
      await refreshMilestones();

      // Close Modal & reset
      setShowAddModal(false);
      setNewMilestone({ title: "", description: "", achievementDate: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // --------- Update Milestone ---------
  const updateMilestone = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(
        `https://localhost:7053/api/milestone/update-milestone?milesstoneId=${editMilestoneId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMilestone),
        }
      );
      if (!res.ok) throw new Error("Failed to update milestone.");

      // Refresh
      await refreshMilestones();

      // Close Modal & reset
      setShowEditModal(false);
      setNewMilestone({ title: "", description: "", achievementDate: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // --------- Helper: Refresh Milestones ---------
  const refreshMilestones = async () => {
    const token = localStorage.getItem("jwtToken");
    const res = await fetch(
      `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const today = new Date().toISOString().split("T")[0];

    // Keep any existing updates from local state by matching IDs
    const updated: Milestone[] = data.map((m: Milestone) => {
      const existing = milestones.find((x) => x.id === m.id);
      return {
        ...m,
        isCompleted: m.achievementDate <= today,
        updates: existing?.updates || [],
      };
    });
    setMilestones(updated);
  };

  // --------- Add a "Follow-up" Update to a Milestone (Local Demo) ---------
  const addUpdate = () => {
    if (!currentMilestone) return;
    // If you want to persist, you'd do a POST request to an "add update" endpoint here

    const newUpdateObj: MilestoneUpdate = {
      id: Date.now().toString(), // or from backend
      content: newUpdate.content,
      date: newUpdate.date,
    };

    // Update local state
    const updatedMilestones = milestones.map((m) => {
      if (m.id === currentMilestone.id) {
        // Append new update
        const updatedUpdates = m.updates ? [...m.updates, newUpdateObj] : [newUpdateObj];
        return {
          ...m,
          updates: updatedUpdates,
        };
      }
      return m;
    });

    setMilestones(updatedMilestones);

    // Close modal & reset
    setShowUpdateModal(false);
    setNewUpdate({
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // --------- Overall Project Progress (for Circular Bar) ---------
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.isCompleted).length;
  const progressFraction =
    totalMilestones > 0 ? completedMilestones / totalMilestones : 0;
  const progressPercent = Math.round(progressFraction * 100);

  // For the circular progress bar: let's define the circle’s circumference
  const circleRadius = 36;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - circleCircumference * progressFraction;

  // --------- Render ---------
  if (loading) return <div className="text-gray-300">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6">
      {/* Project Overview */}
      <h1 className="text-4xl font-bold text-green-400 mb-2">
        {project?.title}
      </h1>
      <p className="text-gray-400 mb-4">{project?.description}</p>

      <div className="mb-4">
        <p>
          <strong>Status:</strong> {project?.status}
        </p>
        <p>
          <strong>End Date:</strong> {project?.endDate}
        </p>
        <p>
          <strong>Industry Expert:</strong>{" "}
          <Link
            href={`/student/industry-profile/${project?.indExpertId}`}
            className="text-blue-400 hover:underline"
          >
            {project?.expertName}
          </Link>
        </p>
      </div>

      {/* --------- Circular Progress Bar (Overall Project) --------- */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-gray-700"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={circleRadius}
              cx="40"
              cy="40"
            />
            <circle
              className="text-green-400"
              strokeWidth="6"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={circleRadius}
              cx="40"
              cy="40"
              style={{ transition: "stroke-dashoffset 0.35s" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-green-400">
              {progressPercent}%
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-green-300">Overall Progress</p>
          <p className="text-sm text-gray-400">
            {completedMilestones} / {totalMilestones} milestones completed
          </p>
        </div>
      </div>

      {/* --------- Milestone Section --------- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-green-300">
          Project Milestones
        </h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAddModal(true)}
        >
          + Add Milestone
        </button>
      </div>

      {milestones.length > 0 ? (
        <div className="border-l border-gray-700 pl-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative mb-8">
              {/* Dot on the timeline */}
              <div
                className={`absolute w-4 h-4 rounded-full -left-6 top-2 ${
                  milestone.isCompleted ? "bg-green-500" : "bg-gray-500"
                }`}
              />

              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                {/* Header row: Title + Status */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl text-green-400 font-bold">
                    {milestone.title}
                  </h3>
                  {milestone.isCompleted ? (
                    <span className="text-sm text-green-400 px-2 py-1 border border-green-400 rounded">
                      Completed
                    </span>
                  ) : (
                    <span className="text-sm text-yellow-400 px-2 py-1 border border-yellow-400 rounded">
                      Pending
                    </span>
                  )}
                </div>

                <p className="text-gray-400 mb-2">{milestone.description}</p>
                <small className="text-gray-300">
                  Achievement Date: {milestone.achievementDate}
                </small>

                {/* Buttons */}
                <div className="flex gap-6 mt-4">
                  <button
                    onClick={() => {
                      // Open Edit Modal
                      setShowEditModal(true);
                      setEditMilestoneId(milestone.id);
                      setNewMilestone({
                        title: milestone.title,
                        description: milestone.description,
                        achievementDate: milestone.achievementDate,
                      });
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // Open "Add Update" Modal
                      setCurrentMilestone(milestone);
                      setShowUpdateModal(true);
                    }}
                    className="text-yellow-400 hover:underline"
                  >
                    + Update
                  </button>
                </div>

                {/* Follow-ups / Updates */}
                {milestone.updates && milestone.updates.length > 0 && (
                  <div className="mt-4 border-l border-gray-700 pl-4">
                    <h4 className="text-md text-green-300 font-semibold mb-2">
                      Follow-ups / Updates:
                    </h4>
                    {milestone.updates.map((upd) => (
                      <div key={upd.id} className="mb-2">
                        <p className="text-gray-300">{upd.content}</p>
                        <small className="text-gray-500">{upd.date}</small>
                        <hr className="border-gray-700 my-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vertical line connector for the timeline (except the last milestone) */}
              {index < milestones.length - 1 && (
                <div className="absolute border-l border-gray-700 left-[-2px] top-[2.5rem] bottom-0"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No milestones available for this project.</p>
      )}

      {/* --------- Add/Edit Milestone Modal --------- */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl text-green-400 mb-4">
              {showAddModal ? "Add Milestone" : "Edit Milestone"}
            </h3>
            <input
              type="text"
              placeholder="Title"
              value={newMilestone.title}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, title: e.target.value })
              }
              className="w-full p-2 mb-2 bg-gray-700 rounded"
            />
            <textarea
              placeholder="Description"
              value={newMilestone.description}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, description: e.target.value })
              }
              className="w-full p-2 mb-2 bg-gray-700 rounded"
            />
            <input
              type="date"
              value={newMilestone.achievementDate}
              onChange={(e) =>
                setNewMilestone({
                  ...newMilestone,
                  achievementDate: e.target.value,
                })
              }
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={showAddModal ? addMilestone : updateMilestone}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setNewMilestone({
                    title: "",
                    description: "",
                    achievementDate: "",
                  });
                }}
                className="text-gray-400 ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------- Add Update (Follow-up) Modal --------- */}
      {showUpdateModal && currentMilestone && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl text-yellow-400 mb-4">
              Add Update for <span className="text-white">{currentMilestone.title}</span>
            </h3>
            <textarea
              placeholder="What's the update?"
              value={newUpdate.content}
              onChange={(e) =>
                setNewUpdate({ ...newUpdate, content: e.target.value })
              }
              className="w-full p-2 mb-2 bg-gray-700 rounded"
            />
            <input
              type="date"
              value={newUpdate.date}
              onChange={(e) =>
                setNewUpdate({ ...newUpdate, date: e.target.value })
              }
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={addUpdate}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Save Update
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setNewUpdate({
                    content: "",
                    date: new Date().toISOString().split("T")[0],
                  });
                }}
                className="text-gray-400 ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMilestonePage;
