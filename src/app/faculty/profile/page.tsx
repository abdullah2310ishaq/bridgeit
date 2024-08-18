"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FacultyProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string; // Base64 image data
  universityName: string;
  post: string;
  interest: string[];
}

const FacultyProfilePage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFacultyProfile() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/unauthorized');
        return;
      }

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

          const facultyResponse = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();

            setFacultyProfile({
              userId: facultyData.userId,
              firstName: facultyData.firstName || 'N/A',
              lastName: facultyData.lastName || 'N/A',
              email: facultyData.email || 'N/A',
              imageData: facultyData.imageData || '',
              universityName: facultyData.universityName || 'N/A',
              post: facultyData.post || 'N/A',
              interest: facultyData.interest || [], // Default to empty array if undefined
            });
          } else {
            console.error('Failed to fetch faculty profile:', facultyResponse.statusText);
            router.push('/unauthorized');
          }
        } else {
          console.error('Failed to fetch user info:', profileResponse.statusText);
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('An error occurred while fetching the faculty profile:', error);
        router.push('/unauthorized');
      }
    }

    fetchFacultyProfile();
  }, [router]);

  const goBack = () => {
    router.push('/faculty');
  };

  const editProfile = () => {
    router.push('/faculty/profile/edit');
  };

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 p-8">
      <h1 className="text-5xl font-bold mb-8 text-white">Faculty Profile</h1>
      <img
        src={`data:image/jpeg;base64,${facultyProfile.imageData}`}
        alt={`${facultyProfile.firstName}'s profile picture`}
        className="w-40 h-40 rounded-full mb-6 shadow-lg border-4 border-gray-700"
      />
      <p className="text-3xl font-semibold mb-2 text-white">{facultyProfile.firstName} {facultyProfile.lastName}</p>
      <p className="text-lg mb-4 text-gray-400">{facultyProfile.email}</p>
      <div className="text-lg space-y-2 text-gray-300 mb-8">
        <p><strong>University:</strong> {facultyProfile.universityName}</p>
        <p><strong>Post:</strong> {facultyProfile.post}</p>
        <p><strong>Interest:</strong> {facultyProfile.interest.length > 0 ? facultyProfile.interest.join(', ') : 'No interests available'}</p>
      </div>
      <div className="flex space-x-6">
        <button
          onClick={goBack}
          className="py-2 px-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300"
        >
          Back
        </button>
        <button
          onClick={editProfile}
          className="py-2 px-8 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition duration-300"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default FacultyProfilePage;
