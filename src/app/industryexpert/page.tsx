"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface IndustryExpertProfile {
  userId: string;
  indExptId: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  imageData: string; // Base64 image data (can be empty)
  post: string;      // Post of the expert (can be empty)
}

const IndustryExpertPage: React.FC = () => {
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        // Fetch the user profile information
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          // Fetch the industry expert data using the userId
          const expertResponse = await fetch(`https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (expertResponse.ok) {
            const expertData = await expertResponse.json();
            setExpertProfile({
              userId: expertData.userId,
              indExptId: expertData.indExptId,
              companyId: expertData.companyId,
              firstName: expertData.firstName,
              lastName: expertData.lastName,
              email: expertData.email,
              companyName: expertData.companyName,
              address: expertData.address,
              contact: expertData.contact,
              imageData: expertData.imageData,
              post: expertData.post,
            });
          } else {
            console.error('Failed to fetch industry expert profile:', expertResponse.statusText);
            router.push('/unauthorized');
          }
        } else {
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        router.push('/unauthorized');
      }
    }

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-user');
  };

  const goToProfile = () => {
    router.push('/industry-expert/profile');
  };

  const goToChangePassword = () => {
    router.push('/industry-expert/profile/manageexpert');
  };

  const goToUpdatePhoto = () => {
    router.push('/industry-expert/profile/manageexpert');
  };

  const goToEditProfile = () => {
    router.push('/industry-expert/profile/editexpert');
  };

  if (!expertProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-800 text-gray-200">
      {/* Navbar */}
      <nav className="bg-gray-700 text-gray-100 w-full p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Industry Expert Dashboard</h1>
          <ul className="flex space-x-6">
            <li>
              <button onClick={goToProfile} className="hover:text-gray-400">
                Profile
              </button>
            </li>
            <li>
              <button onClick={goToChangePassword} className="hover:text-gray-400">
                Update Password
              </button>
            </li>
            <li>
              <button onClick={goToUpdatePhoto} className="hover:text-gray-400">
                Update Photo
              </button>
            </li>
            <li>
              <button onClick={goToEditProfile} className="hover:text-gray-400">
                Edit Profile
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:text-gray-400">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {expertProfile.firstName} {expertProfile.lastName}
        </h1>
        <p className="text-lg mb-4">Company: {expertProfile.companyName}</p>
        <p className="text-lg mb-4">Contact: {expertProfile.contact}</p>
        <p className="text-lg mb-6">User ID: {expertProfile.userId}</p>
        
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button
            onClick={goToProfile}
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
          >
            View Profile
          </button>
          <button
            onClick={goToChangePassword}
            className="w-full py-3 px-6 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Update Password
          </button>
          <button
            onClick={goToUpdatePhoto}
            className="w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Update Photo
          </button>
          <button
            onClick={goToEditProfile}
            className="w-full py-3 px-6 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryExpertPage;
