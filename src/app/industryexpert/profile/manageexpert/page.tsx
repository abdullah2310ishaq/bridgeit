"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IndustryExpertProfileManagement: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [imageData, setImageData] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/auth/login-user');
      return;
    }

    async function fetchUserProfile() {
      try {
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserId(profileData.userId);
        } else {
          toast.error('Failed to fetch user profile.', {
            position: 'top-center',
            autoClose: 3000,
          });
          router.push('/auth/login-user');
        }
      } catch (error) {
        toast.error('An error occurred while fetching the user profile.', {
          position: 'top-center',
          autoClose: 3000,
        });
        router.push('/auth/login-user');
      }
    }

    fetchUserProfile();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const confirmResponse = await fetch(`https://localhost:7053/api/edit-user-profile/confirm-current-password/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPassword),
      });

      if (!confirmResponse.ok) {
        toast.error("Current password is incorrect.");
        return;
      }

      const response = await fetch(`https://localhost:7053/api/edit-user-profile/change-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassword),
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
      } else {
        toast.error("Failed to change password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !imageData) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const base64Image = imageData.split(",")[1]; // Ensure we send only the base64 part
      const response = await fetch(`https://localhost:7053/api/edit-user-profile/set-profile-image/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(base64Image),
      });

      if (response.ok) {
        toast.success("Profile image updated successfully!");
      } else {
        toast.error("Failed to update profile image.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 p-6">
      <div className="w-full max-w-lg p-8 bg-gray-700 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-white">Profile Management</h1>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              Change Password
            </button>
          </div>
        </form>

        <form onSubmit={handleImageUpload} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300">Upload Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {imageData && (
              <img
                src={imageData}
                alt="Profile Preview"
                className="mt-4 w-32 h-32 rounded-full mx-auto border-4 border-gray-600 shadow-lg"
              />
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              Upload Image
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default IndustryExpertProfileManagement;
