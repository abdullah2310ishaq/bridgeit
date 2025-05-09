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
  status: number | null; // 1 = Accepted, 0 = Rejected, null = Pending
}

const IdeaRequestHistoryPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        setRequests(data.flatMap((group: any) => group.requests));
        setFilteredRequests(data.flatMap((group: any) => group.requests));
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

  const filterRequests = (status: string) => {
    setActiveFilter(status);
    if (status === "all") {
      setFilteredRequests(requests);
    } else if (status === "pending") {
      setFilteredRequests(requests.filter((req) => req.status === null));
    } else if (status === "accepted") {
      setFilteredRequests(requests.filter((req) => req.status === 1));
    } else if (status === "rejected") {
      setFilteredRequests(requests.filter((req) => req.status === 0));
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading requests...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Request History</h1>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeFilter === "all" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => filterRequests("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeFilter === "pending" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => filterRequests("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeFilter === "accepted" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => filterRequests("accepted")}
        >
          Accepted
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeFilter === "rejected" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => filterRequests("rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Requests Table */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`p-4 border rounded-lg ${
                request.status === 1
                  ? "bg-green-800"
                  : request.status === 0
                  ? "bg-red-800"
                  : "bg-gray-800"
              }`}
            >
              <p>
                <strong>Idea Name:</strong> {request.ideaName}
              </p>
              <p>
                <strong>Student Name:</strong> {request.studentName}
              </p>
              <p>
                <strong>Department:</strong> {request.studentDept}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {request.status === 1
                  ? "Accepted"
                  : request.status === 0
                  ? "Rejected"
                  : "Pending"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No requests found.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default IdeaRequestHistoryPage;
