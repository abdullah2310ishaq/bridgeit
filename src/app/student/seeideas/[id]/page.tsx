"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IdeaDetails {
  id: string;
  title: string;
  technology: string;
  description: string;
  facultyName: string;
  email: string;
  uniName: string;
}

interface UserProfile {
  stdId: string;
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
}

const IdeaDetailsPage: React.FC = () => {
  const [idea, setIdea] = useState<IdeaDetails | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestPlaced, setRequestPlaced] = useState(false);

  const { id } = useParams(); 
  const router = useRouter();

  useEffect(() => {
    const fetchIdeaDetails = async () => {
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
        // 1) Fetch idea details
        const ideaResponse = await fetch(
          `https://localhost:7053/api/ideas/get-idea-by-id/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!ideaResponse.ok) {
          throw new Error("Failed to fetch idea details.");
        }

        const ideaData: IdeaDetails[] = await ideaResponse.json();
        if (ideaData.length > 0) {
          setIdea(ideaData[0]);
        } else {
          throw new Error("Idea not found.");
        }

        // 2) Fetch user profile (to get stdId)
        const profileRes = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileRes.ok) {
          throw new Error("Authorization failed. Please log in again.");
        }

        const profileData = await profileRes.json();
        const userId = profileData.userId;

        // 3) Fetch student details
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
        setUserProfile({
          stdId: studentData.id,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          universityName: studentData.universityName,
        });
      } catch (error) {
        toast.error((error as Error).message || "Failed to fetch idea details.", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/student/seeideas");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [id, router]);

  const handleExpressInterest = async () => {
    if (!userProfile || !idea) return;

    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        `https://localhost:7053/api/interested-for-idea/student-interested-for-idea/${userProfile.stdId}/${idea.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to place request.");
      }

      toast.success("Your interest has been successfully expressed.", {
        position: "top-center",
        autoClose: 3000,
      });

      setRequestPlaced(true);
    } catch (error) {
      toast.error((error as Error).message || "Failed to place request.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (!idea) {
    return <div className="text-center text-gray-400">Idea not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">{idea.title}</h1>

      {/* Idea Basic Info */}
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h2 className="text-lg font-semibold">Details</h2>
        <p className="text-sm text-gray-400">Technology: {idea.technology}</p>
        <p className="mt-2">{idea.description}</p>
      </div>

      {/* Faculty Info */}
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mt-6">
        <h2 className="text-lg font-semibold">Faculty Details</h2>
        <p className="text-sm text-gray-400">Faculty: {idea.facultyName}</p>
        <p className="text-sm text-gray-400">Email: {idea.email}</p>
      </div>

      {/* University Info */}
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mt-6">
        <h2 className="text-lg font-semibold">University</h2>
        <p className="text-sm text-gray-400">University: {idea.uniName}</p>
      </div>

      {/* Express Interest Button */}
      <div className="mt-6">
        <button
          onClick={handleExpressInterest}
          disabled={requestPlaced}
          className={`px-4 py-2 rounded-lg font-semibold ${
            requestPlaced ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {requestPlaced ? "Request Placed" : "Express Interest"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default IdeaDetailsPage;
