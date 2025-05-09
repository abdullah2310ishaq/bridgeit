"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IndustryExpertProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  description: string;
}

const EditIndustryExpertProfile: React.FC = () => {
  const [profile, setProfile] = useState<IndustryExpertProfile>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    address: "",
    contact: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/unauthorized");
        return;
      }

      try {
        const response = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const { userId } = await response.json();

        const profileResponse = await fetch(
          `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await profileResponse.json();

        setProfile({
          userId: data.userId,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          companyName: data.companyName || "",
          address: data.address || "",
          contact: data.contact || "",
          description: data.description || "",
        });
      } catch (error) {
        toast.error("An error occurred while fetching profile.");
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7053/api/edit-user-profile/update-user-data/${profile.userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Firstname: profile.firstName,
            Lastname: profile.lastName,
            description: profile.description,
          }),
        }
      );

      if (response.ok) {
        toast.success("Profile updated successfully!");
        router.push("/industryexpert/profile");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 p-8">
      <div className="w-full max-w-xl bg-gray-700 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-white">Edit Profile</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Contact</label>
            <input
              type="text"
              name="contact"
              value={profile.contact}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Description</label>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
          </div>
          <button
            type="button"
            onClick={handleSaveChanges}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditIndustryExpertProfile;
