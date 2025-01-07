"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Image from "next/image";

interface FacultyData {
  firstName: string;
  lastName: string;
  email: string;
  post: string;
  interest: string[];
  description: string;
  department: string;
  universityName: string;
  address: string;
  uniId: string;
}

const UpdateFacultyPage: React.FC = () => {
  const [facultyData, setFacultyData] = useState<FacultyData>({
    firstName: "",
    lastName: "",
    email: "",
    post: "",
    interest: [],
    description: "",
    department: "",
    universityName: "",
    address: "",
    uniId: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFacultyData() {
      const token = localStorage.getItem("jwtToken");

      try {
        // Step 1: Fetch authorized user info
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

          // Step 2: Fetch faculty data using userId
          const facultyResponse = await fetch(
            `https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (facultyResponse.ok) {
            const data = await facultyResponse.json();
            setFacultyData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              post: data.post || "",
              interest: data.interest || [],
              description: data.description || "",
              department: data.department || "",
              universityName: data.universityName || "",
              address: data.address || "",
              uniId: data.uniId || "",
            });
          } else {
            toast.error("Failed to load faculty data.", {
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

    fetchFacultyData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFacultyData({ ...facultyData, [name]: value });
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacultyData({ ...facultyData, interest: e.target.value.split(",") });
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
        `https://localhost:7053/api/faculties/update-faculty/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: facultyData.firstName,
            lastName: facultyData.lastName,
            email: facultyData.email,
            post: facultyData.post,
            interest: facultyData.interest,
            description: facultyData.description,
            department: facultyData.department,
            universityName: facultyData.universityName,
            address: facultyData.address,
            universityId: facultyData.uniId,
          }),
        }
      );

      if (response.ok) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        router.push("/faculty/profile");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update profile: ${errorData.message}`, {
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
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between bg-gray-900 text-gray-200 p-8 space-x-8">
  {/* Left Side with Gradient Text, Logo, and Edit Image */}
  <div className="flex flex-col items-center lg:items-start lg:ml-16">
    <h1 className="text-6xl font-extrabold text-white mb-4 flex items-center">
      {/* Logo Image */}
      <Image
        src="/logo.jpg"
        alt="Logo"
        width={100}
        height={100}
        className="mx-4"
      />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        Edit
      </span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 ml-2">
        Profile
      </span>
    </h1>
    {/* Edit Profile Image */}
    <div className="mt-6">
      <Image
        src="/editpr.png"
        alt="Edit Profile"
        width={400}
        height={300}
        className="rounded-lg"
      />
    </div>
  </div>

  {/* Right Side with Form */}
  <div className="w-full lg:max-w-xl p-6 rounded-lg shadow-lg bg-gray-800">
    <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
      Update Profile
    </h1>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-300">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={facultyData.firstName}
          onChange={handleInputChange}
          className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-300">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={facultyData.lastName}
          onChange={handleInputChange}
          className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-300">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={facultyData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Post */}
      <div>
        <label className="block text-sm font-semibold text-gray-300">
          Post
        </label>
        <input
          type="text"
          name="post"
          value={facultyData.post}
          onChange={handleInputChange}
          className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Interest */}
      <div>
        <label className="block text-sm font-semibold text-gray-300">
          Interest (separated by commas)
        </label>
        <input
          type="text"
          name="interest"
          value={facultyData.interest.join(",")}
          onChange={handleInterestChange}
          className="mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
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
    {/* Back to Profile Button */}
    <button
      onClick={() => router.push("/faculty/profile")}
      className="mt-6 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300 w-full"
    >
      Back to Profile
    </button>
  </div>
  <ToastContainer />
</div>

  );
};

export default UpdateFacultyPage;
