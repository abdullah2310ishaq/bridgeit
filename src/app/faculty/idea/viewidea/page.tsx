"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FacultyProfileData {
  id: string; // FacultyId
  userId: string;
  uniId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string; // Base64 string
  description: string;
  department: string;
  interest: string[];
  post: string;
  universityName: string;
  address: string;
  uniImage: string; // Base64 string
  role: string;
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

const FacultyIdeasPage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfileData | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndIdeas() {
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
        // Step 1: Fetch the authorized user profile
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

        // Step 2: Fetch faculty details using userId
        const facultyResponse = await fetch(
          `https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!facultyResponse.ok) {
          throw new Error("Failed to fetch faculty details.");
        }

        const facultyData = await facultyResponse.json();

        setFacultyProfile({
          id: facultyData.id,
          userId: facultyData.userId,
          uniId: facultyData.uniId,
          firstName: facultyData.firstName,
          lastName: facultyData.lastName,
          email: facultyData.email,
          imageData: facultyData.imageData,
          description: facultyData.description,
          department: facultyData.department,
          interest: facultyData.interest,
          post: facultyData.post,
          universityName: facultyData.universityName,
          address: facultyData.address,
          uniImage: facultyData.uniImage,
          role: profileData.role,
        });

        // Step 3: Fetch ideas using facultyId
        const ideasResponse = await fetch(
          `https://localhost:7053/api/ideas/get-ideas-by-faculty-id/${facultyData.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!ideasResponse.ok) {
          const errorText = await ideasResponse.text();
          throw new Error(`Failed to fetch ideas: ${errorText}`);
        }

        const ideasData = await ideasResponse.json();
        setIdeas(ideasData);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        toast.error((error as Error).message || "An error occurred.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndIdeas();
  }, [router]);

  const handleIdeaClick = (id: string) => {
    router.push(`/faculty/idea/${id}`); // Navigate to the dynamic route for the idea
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">My Ideas</h1>
      {facultyProfile && (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mb-6">
          <h2 className="text-lg font-semibold">
            {facultyProfile.firstName} {facultyProfile.lastName}
          </h2>
          <p className="text-sm text-gray-400">Email: {facultyProfile.email}</p>
          <p className="text-sm text-gray-400">University: {facultyProfile.universityName}</p>
          <p className="text-sm text-gray-400">Department: {facultyProfile.department}</p>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold">Ideas</h2>
        {ideas.length > 0 ? (
          <div className="space-y-4 mt-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => handleIdeaClick(idea.id)} // Navigate to the detail page
                className="p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700"
              >
                <h3 className="text-lg font-semibold">{idea.title}</h3>
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
          <p className="text-gray-400 mt-4">No ideas found for this faculty.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FacultyIdeasPage;
