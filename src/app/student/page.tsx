"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage: string; // Base64 image data for the profile picture
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        const response = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            profileImage: data.profileImage || '', // Assuming the API returns a Base64 image string
          });
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
    router.push('/student/profile');
  };

  const goToManagement = () => {
    router.push('/student/profile/management');
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
      <img
        src={`data:image/jpeg;base64,${userProfile.profileImage}`}
        alt={`${userProfile.firstName}'s profile picture`}
        className="w-32 h-32 rounded-full mb-4"
      />
      <h1 className="text-2xl font-bold mb-4">
        {userProfile.firstName} {userProfile.lastName}
      </h1>
      <p className="mb-2">Role: {userProfile.role}</p>
      <p className="mb-4">User ID: {userProfile.userId}</p>
      <button
        onClick={goToProfile}
        className="mb-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
      >
        View Profile
      </button>
      <button
        onClick={goToManagement}
        className="mb-4 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
      >
        Go to Management
      </button>
      <button
        onClick={handleLogout}
        className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentPage;
