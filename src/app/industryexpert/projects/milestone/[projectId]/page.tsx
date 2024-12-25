"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Milestone {
  id: string;
  title: string;
  description: string;
  achievementDate: string;
}

interface Comment {
  id: string;
  comment: string;
  commenterName: string;
  commentDate: string;
}

const MilestonePage: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<string>("");
  const [currentMilestoneId, setCurrentMilestoneId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          router.push("/auth/login-user");
          return;
        }

        // Fetch milestones for the project
        const response = await fetch(
          `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch milestones");

        const data = await response.json();
        setMilestones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [projectId, router]);

  const fetchComments = async (milestoneId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://localhost:7053/api/milestone-comment/get-milestone-comments/?milestoneId=${milestoneId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments((prev) => ({ ...prev, [milestoneId]: data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentMilestoneId) {
      console.error("Comment or milestone ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const expertId = localStorage.getItem("expertId");

      if (!token || !expertId) {
        console.error("Token or expertId is missing.");
        return;
      }

      const response = await fetch(
        `https://localhost:7053/api/milestone-comment/add-milestone-comment?milestoneId=${currentMilestoneId}&expertId=${expertId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
          body: newComment, // Send comment as a raw string
        }
      );

      if (response.ok) {
        setNewComment(""); // Clear input field
        await fetchComments(currentMilestoneId); // Refresh comments
      } else {
        const errorText = await response.text();
        console.error("Error adding comment:", errorText);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text p-3 bg-gradient-to-r from-blue-500 to-green-500">Project Milestones</h1>

      {/* Milestones Section */}
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded shadow">
            <h3 className="text-xl font-semibold">{milestone.title}</h3>
            <p>{milestone.description}</p>
            <p>
              <strong>Achievement Date:</strong>{" "}
              {new Date(milestone.achievementDate).toLocaleDateString()}
            </p>

            {/* Comments Section */}
            <button
              onClick={() => {
                setCurrentMilestoneId(milestone.id);
                fetchComments(milestone.id);
              }}
              className="mt-2 text-blue-400"
            >
              View Comments
            </button>

            {currentMilestoneId === milestone.id && (
              <div className="mt-4">
                <h4 className="text-lg font-bold">Comments</h4>
                <div className="space-y-2">
                  {comments[milestone.id]?.map((comment) => (
                    <div key={comment.id} className="p-2 bg-gray-700 rounded">
                      <p>{comment.comment}</p>
                      <small>
                        - {comment.commenterName} on{" "}
                        {new Date(comment.commentDate).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full mt-2 p-2 bg-gray-800 text-white rounded"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={handleAddComment}
                  className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center w-full md:w-auto"
                >
                  Submit Comment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestonePage;
