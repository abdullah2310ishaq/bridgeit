"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  imageData: string;
  universityId: string;
  rollNumber: string;
}

const UpdateStudentPage: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    firstName: "",
    lastName: "",
    email: "",
    imageData: "",
    universityId: "",
    rollNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentData() {
      const token = localStorage.getItem("jwtToken");

      try {
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;
          setUserId(userId);

          const response = await fetch(
            `https://localhost:7053/api/get-student/student-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setStudentData({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              imageData: data.imageData,
              universityId: data.universityId,
              rollNumber: data.rollNumber,
            });
          } else {
            toast.error("Failed to load profile data.", {
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentData({ ...studentData, imageData: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {
      toast.error("User ID not found. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `https://localhost:7053/api/students/update-student/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (response.ok) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Upload profile image separately
        if (studentData.imageData) {
          await fetch(
            `https://localhost:7053/api/edit-user-profile/set-profile-image/${userId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ base64ImageData: studentData.imageData.split(",")[1] }),
            }
          );
        }

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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8 flex flex-col items-center">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Update Student Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={studentData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={studentData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={studentData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">University ID</label>
            <input
              type="text"
              name="universityId"
              value={studentData.universityId}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={studentData.rollNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">Profile Image</label>
            <input
              type="file"
              name="imageData"
              onChange={handleImageChange}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
            />
            {studentData.imageData && (
              <img src={studentData.imageData} alt="Profile" className="mt-4 w-32 h-32 rounded-full mx-auto shadow-lg" />
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
        <button
          onClick={() => router.push("/student/profile")}
          className="mt-6 py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
        >
          Back to Profile
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateStudentPage;
