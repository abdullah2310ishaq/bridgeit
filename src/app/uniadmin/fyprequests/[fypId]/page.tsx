"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaCheck, FaTimes, FaBook, FaUsers, FaCog, FaUserTie } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FacultyDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  post: string;
}

interface FypDetails {
  id: string;
  fypId: string;
  title: string;
  members: number;
  batch: string;
  technology: string;
  description: string;
  status: string;
  faculty: { id: string } | null; // Holds only faculty ID
}

const FypDetailPage: React.FC = () => {
  const [fypDetails, setFypDetails] = useState<FypDetails | null>(null);
  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(null); // Faculty details state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { fypId } = useParams(); // Get fypId from dynamic route

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      router.push("/auth/login-user");
      return;
    }

    const fetchFypDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7053/api/fyp/get-detailed-fyp-by-id/${fypId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch FYP details.");

        const data = await response.json();
        setFypDetails(data);

        // Fetch faculty details if faculty is assigned
        if (data.faculty && data.faculty.id) {
          fetchFacultyDetails(data.faculty.id, token);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFacultyDetails = async (facultyId: string, token: string) => {
      try {
        const response = await fetch(
          `https://localhost:7053/api/get-faculty/faculty-by-faculity-id/${facultyId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch faculty details.");

        const facultyData = await response.json();
        setFacultyDetails(facultyData);
      } catch (err) {
        toast.error("Failed to load faculty details.");
      }
    };

    fetchFypDetails();
  }, [fypId, router]);

  const handleApprove = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        `https://localhost:7053/api/uni-admin-for-fyp/approve-fyp?fypId=${fypId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("FYP approved successfully!");
        setFypDetails((prev) => prev && { ...prev, status: "Approved" });
      } else {
        const errorData = await response.text();
        toast.error(`Failed to approve FYP: ${errorData}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        `https://localhost:7053/api/uni-admin-for-fyp/reject-fyp?fypId=${fypId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.error("FYP rejected.");
        setFypDetails((prev) => prev && { ...prev, status: "Rejected" });
      } else {
        const errorData = await response.text();
        toast.error(`Failed to reject FYP: ${errorData}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-6">FYP Details</h1>
        {fypDetails && (
          <>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaBook className="text-purple-400 text-xl mr-3" />
                <span className="text-lg">Title: {fypDetails.title}</span>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-green-400 text-xl mr-3" />
                <span className="text-lg">Members: {fypDetails.members}</span>
              </div>
              <div className="flex items-center">
                <FaCog className="text-blue-400 text-xl mr-3" />
                <span className="text-lg">Technology: {fypDetails.technology}</span>
              </div>
              <div className="flex items-center">
                <FaBook className="text-yellow-400 text-xl mr-3" />
                <span className="text-lg">Batch: {fypDetails.batch}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Description:</h3>
                <p className="text-gray-300">{fypDetails.description}</p>
              </div>

              {/* Faculty Details Section */}
              {facultyDetails && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Faculty Details:</h3>
                  <p className="text-gray-300">
                    <strong>Name:</strong> {facultyDetails.firstName} {facultyDetails.lastName}
                    <br />
                    <strong>Email:</strong> {facultyDetails.email}
                    <br />
                    <strong>Department:</strong> {facultyDetails.department}
                    <br />
                    <strong>Post:</strong> {facultyDetails.post}
                  </p>
                </div>
              )}
            </div>

            {/* Approve/Reject Buttons */}
            {fypDetails.status === "Pending" && (
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleApprove}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 flex items-center space-x-2"
                >
                  <FaCheck />
                  <span>Approve</span>
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default FypDetailPage;
