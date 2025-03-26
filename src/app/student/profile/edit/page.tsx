"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

interface StudentData {
  firstName: string;
  lastName: string;

  rollNumber: string;
  description: string;
}

const UpdateStudentPage: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    firstName: "",
    lastName: "",
   
    rollNumber: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentData() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("User not authenticated. Redirecting to login.", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch authenticated user info
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
          const userId = profileData.userId;
          setUserId(userId);

          // Fetch student-specific data
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
            const data = await studentResponse.json();
            setStudentId(data.id);
            setStudentData({
              firstName: data.firstName,
              lastName: data.lastName,
             
              rollNumber: data.rollNumber,
              description: data.description || "",
            });
          } else {
            toast.error("Failed to load student data.", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        } else {
          toast.error("Failed to fetch user profile.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error("An error occurred while fetching profile data.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }

    fetchStudentData();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!studentId || !userId) {
      toast.error("User ID not found. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwtToken");
    try {
      // Update student basic info
      const updateStudentResponse = await fetch(
        `https://localhost:7053/api/students/update-student/${studentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            
            rollNumber: studentData.rollNumber,
          }),
        }
      );

      // Update user description
      const updateDescriptionResponse = await fetch(
        `https://localhost:7053/api/edit-user-profile/update-user-data/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: studentData.description,
            Firstname: studentData.firstName,
            Lastname: studentData.lastName,
          }),
        }
      );

      if (updateStudentResponse.ok && updateDescriptionResponse.ok) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/student/profile");
      } else {
        toast.error("Failed to update profile.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-200 p-8">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
        Update Profile
      </h1>
      <div className="w-full lg:max-w-xl p-6 rounded-lg shadow-lg bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={studentData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={studentData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
         
          <div>
            <label className="block text-sm font-semibold text-gray-300">
              Roll Number
            </label>
            <input
              type="text"
              name="rollNumber"
              value={studentData.rollNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={studentData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Tell us something about yourself..."
            />
          </div>
          <div className="flex justify-center">
            <motion.button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </motion.button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateStudentPage;
