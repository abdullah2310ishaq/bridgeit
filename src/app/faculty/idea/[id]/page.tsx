"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const IdeaDetailsPage = ({ params }: { params: { id: string } }) => {
  const [idea, setIdea] = useState<IdeaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const ideaId = params.id; // Access the `id` from `params`

    if (!ideaId) {
      toast.error("Invalid idea ID provided.", {
        position: "top-center",
        autoClose: 3000,
      });
      router.push("/faculty/idea"); // Redirect if `id` is missing
      return;
    }

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
        const response = await fetch(
          `https://localhost:7053/api/ideas/get-idea-by-id/${ideaId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch idea details: ${errorText}`);
        }

        const data: IdeaDetails[] = await response.json();

        // Ensure valid response
        if (data && data.length > 0) {
          setIdea(data[0]); // Only set the first element (idea details)
        } else {
          throw new Error("Idea not found. Please verify the idea ID.");
        }
      } catch (error: unknown) {
        // Handle errors gracefully
        if (error instanceof Error) {
          toast.error(error.message, {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error("An unexpected error occurred.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
        router.push("/faculty/idea");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [params.id, router]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (!idea) {
    return <div className="text-center text-gray-400">Idea not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">{idea.title}</h1>
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h2 className="text-lg font-semibold">Details</h2>
        <p className="text-sm text-gray-400">Technology: {idea.technology}</p>
        <p className="mt-2">{idea.description}</p>
      </div>
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mt-6">
        <h2 className="text-lg font-semibold">Faculty Details</h2>
        <p className="text-sm text-gray-400">Faculty: {idea.facultyName}</p>
        <p className="text-sm text-gray-400">Email: {idea.email}</p>
      </div>
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mt-6">
        <h2 className="text-lg font-semibold">University</h2>
        <p className="text-sm text-gray-400">University: {idea.uniName}</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default IdeaDetailsPage;
