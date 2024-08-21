"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
 
  rollNumber: string;
}

interface University {
  id: string;
  name: string;
}

const UpdateStudentPage: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    firstName: "",
    lastName: "",
    email: "",
    
    rollNumber: "",
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentData() {
      const token = localStorage.getItem("jwtToken");

      try {
        // Step 1: Fetch authorized user info
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId; // Assuming userId corresponds to the authenticated user
          
          // Step 2: Fetch student data using userId (to get studentId)
          const studentResponse = await fetch(
            `https://localhost:7053/api/get-student/student-by-id/${userId}`, // Adjust the endpoint to retrieve student by userId
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (studentResponse.ok) {
            const data = await studentResponse.json();
            setStudentId(data.id); // Set the studentId from the fetched student data
            setStudentData({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
            
              rollNumber: data.rollNumber,
            });
          } else {
            toast.error("Failed to load student data.", {
              position: "top-center",
              autoClose: 3000,
            });
          }

          // Step 3: Fetch all universities
          const universityResponse = await fetch(
            `https://localhost:7053/api/universities/get-all-universities`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (universityResponse.ok) {
            const universitiesData = await universityResponse.json();
            setUniversities(universitiesData);
          } else {
            toast.error("Failed to load universities.", {
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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!studentId) {
      toast.error("Student ID not found. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `https://localhost:7053/api/students/update-student/${studentId}`,
        {
          method: "PUT", // Use PUT method to match the backend
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-8">
      <div className="w-full max-w-xl p-6 rounded-lg shadow-lg bg-gray-800">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-white">Update Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300">First Name</label>
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
            <label className="block text-sm font-semibold text-gray-300">Last Name</label>
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
            <label className="block text-sm font-semibold text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={studentData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
           
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={studentData.rollNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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