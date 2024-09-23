"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostProjectForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(""); // For date in "yyyy-MM-dd" format
  const [indExpertId, setIndExpertId] = useState<string | null>(null); // Store fetched IndExptId
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For submit button disabling
  const router = useRouter();

  // Fetch the IndExptId when the user logs in
  useEffect(() => {
    const fetchIndExpertId = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("You must be logged in to post a project.");
        return;
      }

      try {
        // Fetch authorized user profile
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId; // Ensure we have the userId from the profile

          // Fetch the IndExptId using the userId
          const expertResponse = await fetch(
            `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (expertResponse.ok) {
            const expertData = await expertResponse.json();
            console.log("Fetched Expert Data:", expertData);

            // Ensure the response contains the IndExptId
            if (expertData.indExptId) {
              setIndExpertId(expertData.indExptId); // Store the fetched IndExptId
            } else {
              toast.error("Unable to fetch your expert ID.");
            }
          } else {
            toast.error("Failed to fetch expert data.");
          }
        } else {
          toast.error("Failed to fetch user profile.");
        }
      } catch (error) {
        console.error("Error fetching expert data:", error);
        toast.error("An error occurred while fetching expert data.");
      }
    };

    fetchIndExpertId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input fields
    if (!title || !description || !endDate) {
      toast.error("Please fill in all the required fields");
      return;
    }

    if (!indExpertId) {
      toast.error("Unable to fetch your expert ID.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://localhost:7053/api/projects/expert-post-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          endDate,
          indExpertId, // Use the fetched IndExptId from state
        }),
      });

      if (response.ok) {
        toast.success("Project posted successfully!");
        setTimeout(() => {
          router.push("/industryexpert/dashboard"); // Redirect after successful project posting
        }, 2000);
      } else {
        toast.error("Failed to post the project");
      }
    } catch (error) {
      console.error("Error posting the project:", error);
      toast.error("Error occurred while posting the project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Post a New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Project Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Describe the project"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              placeholder="End Date"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white ${
              isSubmitting ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Post Project"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default PostProjectForm;
