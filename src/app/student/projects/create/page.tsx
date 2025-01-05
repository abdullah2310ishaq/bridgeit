"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateProjectPage: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTeam, setProjectTeam] = useState(0);
  const [projectStack, setProjectStack] = useState(''); // Stack field
  const [projectStatus, setProjectStatus] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [projectLink, setProjectLink] = useState(''); // Link field
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function authorizeUserAndFetchStudentId() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const userResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          const studentResponse = await fetch(
            `https://localhost:7053/api/get-student/student-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            setStudentId(studentData.id);
          } else {
            router.push("/unauthorized");
          }
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error:", error);
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    }

    authorizeUserAndFetchStudentId();
  }, [router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      toast.error("Failed to create project. Student ID is missing.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        "https://localhost:7053/api/projects/student-add-projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: projectTitle,
            description: projectDescription,
            team: projectTeam,
            stack: projectStack, // Sending Stack
            currentStatus: projectStatus,
            startDate: projectStartDate,
            endDate: projectEndDate,
            studentId: studentId,
            link: projectLink, // Sending Link
          }),
        }
      );

      if (response.ok) {
        toast.success("Project created successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/student");
      } else {
        toast.error("Failed to create project.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while creating the project.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Create Your Project
        </h1>
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Link (Optional)
            </label>
            <input
              type="url"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              placeholder="https://your-project-link.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Technology Stack
            </label>
            <input
              type="text"
              value={projectStack}
              onChange={(e) => setProjectStack(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Team Size
            </label>
            <input
              type="number"
              value={projectTeam}
              onChange={(e) => setProjectTeam(Number(e.target.value))}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Current Status
            </label>
            <input
              type="text"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={projectStartDate}
              onChange={(e) => setProjectStartDate(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={projectEndDate}
              onChange={(e) => setProjectEndDate(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700"
          >
            Launch Project
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateProjectPage;
