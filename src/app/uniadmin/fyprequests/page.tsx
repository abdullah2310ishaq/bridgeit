"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaProjectDiagram } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminProfile {
  universityId: string;
}

interface FypRequest {
  fId: string;
  title: string;
  fypId: string;
  members: string;
  batch: string;
  technology: string;
  description: string;
  status: string; // Pending, Approved, Rejected
  studentName: string;
  studentEmail: string;
  studentRollNo: string;
}

const FypRequestsPage: React.FC = () => {
  const [fypRequests, setFypRequests] = useState<FypRequest[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      router.push("/auth/login-user");
      return;
    }

    const fetchAdminAndFyps = async () => {
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
          throw new Error("Unauthorized. Please log in again.");
        }

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        const adminResponse = await fetch(
          `https://localhost:7053/api/get-uni-admins/admins-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!adminResponse.ok) throw new Error("Failed to fetch admin details.");

        const adminData = await adminResponse.json();
        if (!adminData.uniId) throw new Error("University ID missing. Please log in again.");

        setAdminProfile({ universityId: adminData.uniId });

        const fypResponse = await fetch(
          `https://localhost:7053/api/uni-admin-for-fyp/get-fyps-for-uniAdmin-for-approval?uniId=${adminData.uniId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!fypResponse.ok) throw new Error("Failed to fetch FYP requests.");

        const fypData = await fypResponse.json();
        setFypRequests(fypData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminAndFyps();
  }, [router]);

  const filteredRequests = fypRequests.filter((fyp) =>
    filter === "All" ? true : fyp.status === filter
  );

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400 mb-6">
          FYP Requests
        </h1>

        {/* Filter Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as "All" | "Pending" | "Approved" | "Rejected")}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-all ${
                filter === status
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* FYP Request Tiles */}
{filteredRequests.length > 0 ? (
  <div className="space-y-6">
    {filteredRequests.map((fyp) => (
      <div
        key={fyp.fId}
        onClick={() => router.push(`/uniadmin/fyprequests/${fyp.fId}`)}
        className="relative flex flex-col md:flex-row items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 p-6 border border-gray-700 overflow-hidden"
      >
        {/* Icon Section */}
        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-md">
          <FaProjectDiagram className="text-4xl text-white" />
        </div>

        {/* Content Section */}
        <div className="flex-grow ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">{fyp.title}</h2>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <strong>Batch:</strong> {fyp.batch}
            </p>
            <p>
              <strong>Technology:</strong> {fyp.technology}
            </p>
            <p>
              <strong>Student:</strong> {fyp.studentName}
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div
          className={`flex-shrink-0 mt-4 md:mt-0 py-2 px-4 rounded-full text-lg font-semibold ${
            fyp.status === "Pending"
              ? "bg-yellow-500 text-black"
              : fyp.status === "Approved"
              ? "bg-green-500 text-black"
              : "bg-red-500 text-white"
          }`}
        >
          {fyp.status}
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-transparent to-blue-500 opacity-0 hover:opacity-10 transition-opacity"></div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center text-gray-400 mt-10">
    <p className="text-lg">There are no FYP requests matching the selected filter.</p>
  </div>
)}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FypRequestsPage;
