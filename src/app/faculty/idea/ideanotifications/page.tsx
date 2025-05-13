"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Request {
  id: string;
  ideaId: string;
  studentId: string;
  facultyId: string;
  stdUserId: string;
  facUserId: string;
  ideaName: string;
  studentName: string;
  studentDept: string;
}

interface IdeaRequests {
  ideaId: string;
  ideaName: string;
  requests: Request[];
}

const IdeaNotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<IdeaRequests[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // States to control the accept modal
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [meetingTime, setMeetingTime] = useState<string>(""); // store date/time as ISO string or any format you prefer

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        toast.error("Please log in to access this page.", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/auth/login-user");
        return;
      }

      try {
        // 1) Fetch faculty ID from authorized-user-info
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!profileResponse.ok) {
          throw new Error("Authorization failed. Please log in again.");
        }
        const profileData = await profileResponse.json();
        const facultyId = profileData.userId;

        // 2) Fetch the requests
        const response = await fetch(
          `https://localhost:7053/api/interested-for-idea/get-interested-students-requests/${facultyId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch requests.");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        toast.error((error as Error).message || "Failed to fetch requests.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  // ---------- Modal Flow ----------
  // 1) Faculty clicks "Accept" => open modal
  const openAcceptModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setMeetingTime(""); 
    setAcceptModalOpen(true);
  };

  // 2) Faculty selects date/time, then "Confirm" => call handleAccept with selected time
  const confirmAccept = async () => {
    if (!selectedRequestId) return;
    await handleAccept(selectedRequestId, meetingTime);
    setAcceptModalOpen(false);
  };

  const handleAccept = async (requestId: string, time: string) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      // Send the chosen date/time as the request body
      const response = await fetch(
        `https://localhost:7053/api/interested-for-idea/accept-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(time), 
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to accept request.");
      }

      toast.success("Request accepted successfully.", {
        position: "top-center",
        autoClose: 3000,
      });

      // Remove the accepted request from the UI
      setRequests((prevRequests) =>
        prevRequests.map((idea) => ({
          ...idea,
          requests: idea.requests.filter((r) => r.id !== requestId),
        }))
      );
    } catch (error) {
      toast.error((error as Error).message || "Failed to accept request.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  // Reject request as before (no changes needed)
  const handleReject = async (requestId: string) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const response = await fetch(
        `https://localhost:7053/api/interested-for-idea/reject-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to reject request.");
      }

      toast.success("Request rejected successfully.", {
        position: "top-center",
        autoClose: 3000,
      });

      setRequests((prevRequests) =>
        prevRequests.map((idea) => ({
          ...idea,
          requests: idea.requests.filter((r) => r.id !== requestId),
        }))
      );
    } catch (error) {
      toast.error((error as Error).message || "Failed to reject request.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading requests...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Idea Notifications</h1>
      {requests.length > 0 ? (
        requests.map((idea) => (
          <div key={idea.ideaId} className="mb-6">
            <h2 className="text-lg font-semibold text-green-400 mb-4">
              Idea: {idea.ideaName}
            </h2>
            {idea.requests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-gray-800 border border-gray-700 rounded-lg mb-4"
              >
               <p>
  <strong>Student Name:</strong>{" "}
  <span
    onClick={() => router.push(`/faculty/student/${request.studentId}`)}
    className="text-blue-400 underline cursor-pointer"
  >
    {request.studentName}
  </span>
</p>
                <p>
                  <strong>Department:</strong> {request.studentDept}
                </p>
                <p>
                  <strong>Request ID:</strong> {request.id}
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => openAcceptModal(request.id)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No requests found.</p>
      )}

      {/* ------------------ Accept Modal ------------------ */}
      {acceptModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 w-full max-w-md rounded shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              Schedule Meeting Time
            </h3>
            <label className="block mb-2 text-sm text-gray-300">
              Select Meeting Date/Time
            </label>
            <input
              type="datetime-local"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded focus:outline-none text-gray-100"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={confirmAccept}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setAcceptModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-white"
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

export default IdeaNotificationsPage;