"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
  uniId: string;
  stdId: string;
}

interface Idea {
  id: string;
  title: string;
  technology: string;
  description: string;
  facultyName: string;
  email: string;
  uniName: string;
}

const IdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchIdeas = async () => {
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
        // Fetch user profile to get `userId`
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
        const userId = profileData.userId;

        // Fetch student details to retrieve `uniId` and `stdId`
        const studentResponse = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!studentResponse.ok) {
          throw new Error("Failed to fetch student details.");
        }

        const studentData = await studentResponse.json();
        const uniId = studentData.universityId;

        // Save user profile including stdId
        setUserProfile({
          userId: studentData.userId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          universityName: studentData.universityName,
          uniId: uniId,
          stdId: studentData.id,
        });

        // Fetch ideas by `uniId`
        const ideasResponse = await fetch(
          `https://localhost:7053/api/ideas/get-ideas-by-uni/${uniId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!ideasResponse.ok) {
          throw new Error("Failed to fetch ideas.");
        }

        const ideasData = await ideasResponse.json();
        setIdeas(ideasData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [router]);

  const handleIdeaClick = (id: string) => {
    router.push(`/student/seeideas/${id}`); // Navigate to the dynamic idea page
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.technology.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center text-gray-400">Loading ideas...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        <p>Error: {error}</p>
        <button
          onClick={() => router.push("/auth/login-user")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Ideas from Your University</h1>

      {/* User Profile Section */}
      {userProfile && (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mb-6">
          <h2 className="text-lg font-semibold">{userProfile.universityName}</h2>
          <p className="text-sm text-gray-400">
            Admin: {userProfile.firstName} {userProfile.lastName}
          </p>
          <p className="text-sm text-gray-400">Email: {userProfile.email}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search ideas by title or technology"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500"
        />
      </div>

      {/* Ideas List */}
      {filteredIdeas.length > 0 ? (
        <div className="space-y-4">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => handleIdeaClick(idea.id)}
              className="p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <h2 className="text-lg font-semibold">{idea.title}</h2>
              <p className="text-sm text-gray-400">Technology: {idea.technology}</p>
              <p className="mt-2">{idea.description}</p>
              <p className="text-sm text-gray-400 mt-2">
                Faculty: {idea.facultyName} ({idea.email})
              </p>
              <p className="text-sm text-gray-400">University: {idea.uniName}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No ideas found for your university.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default IdeasPage;
