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
        // Step 1: Fetch admin profile
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

        // Fetch admin details to get universityId
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

        // Step 2: Fetch FYP requests
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
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-300">FYP Requests</h1>

        {/* Filter Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as "All" | "Pending" | "Approved" | "Rejected")}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors ${
                filter === status
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* FYP Request Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRequests.map((fyp) => (
            <div
              key={fyp.fId}
              onClick={() => router.push(`/uniadmin/fyprequests/${fyp.fId}`)}
              className="cursor-pointer bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <div className="flex items-center justify-center h-20 w-20 bg-purple-700 rounded-full mx-auto mb-4">
                <FaProjectDiagram className="text-4xl text-white" />
              </div>
              <h2 className="text-lg font-bold text-center text-purple-200 mb-2">{fyp.title}</h2>
              <p className="text-sm text-gray-300 text-center">
                <strong>Batch:</strong> {fyp.batch}
              </p>
              <p className="text-sm text-gray-300 text-center">
                <strong>Technology:</strong> {fyp.technology}
              </p>
              <p
                className={`mt-4 text-center text-lg font-bold ${
                  fyp.status === "Pending"
                    ? "text-yellow-400"
                    : fyp.status === "Approved"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {fyp.status}
              </p>
              <p className="text-sm text-gray-400 text-center mt-2">
                <strong>Student:</strong> {fyp.studentName}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FypRequestsPage;
