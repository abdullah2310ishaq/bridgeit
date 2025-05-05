"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
}

const StudentProposalStatusPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchStudentProfile() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // Step 1: Fetch authorized user info
        const authResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!authResponse.ok) throw new Error("Unauthorized. Please log in again.");

        const authData = await authResponse.json();
        const userId = authData.userId;

        // Step 2: Fetch student profile using userId
        const studentResponse = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!studentResponse.ok) throw new Error("Failed to fetch student profile.");

        const studentData = await studentResponse.json();

        setUserProfile({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          universityName: studentData.universityName,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudentProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-20">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">FYP Proposal Status</h1>

      {userProfile && (
        <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">
            Hello, {userProfile.firstName} {userProfile.lastName}!
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            We are reviewing your FYP proposal. You will receive an email with the status of your proposal as soon as it has been reviewed.
          </p>
          <p className="text-gray-400 text-lg mb-4">
            <strong>University:</strong> {userProfile.universityName}
          </p>
          <p className="text-lg text-purple-400 font-bold mb-6">
            <strong>Registered Email:</strong> {userProfile.email}
          </p>
          <button
            onClick={() => window.open(`mailto:${userProfile.email}`, "_blank")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Check Your Email
          </button>
        </div>
      )}

      <div className="text-center mt-12 text-gray-400">
        <p className="text-sm">
          Didnot receive an email? Make sure to check your spam/junk folder or contact your university administrator for assistance.
        </p>
      </div>
    </div>
  );
};

export default StudentProposalStatusPage;
