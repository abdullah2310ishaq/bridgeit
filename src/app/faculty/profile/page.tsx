"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FacultyProfile {
  userId: string;
  uniId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string; // Base64 string
  interest: string[];
  post: string;
  universityName: string;
  address: string;
  uniImage: string; // Base64 string
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
              uniId: facultyData.uniId,
              firstName: facultyData.firstName || 'N/A',
              lastName: facultyData.lastName || 'N/A',
              email: facultyData.email || 'N/A',
              imageData: facultyData.imageData || '',
              interest: facultyData.interest || [],
              post: facultyData.post || 'N/A',
              universityName: facultyData.universityName || 'N/A',
              address: facultyData.address || 'N/A',
              uniImage: facultyData.uniImage || '',
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Faculty Profile</h1>
          <div className="flex space-x-4">
            <button
              onClick={goBack}
              className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300"
            >
              Back
            </button>
            <button
              onClick={editProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mb-10">
          <img
            src={`data:image/jpeg;base64,${facultyProfile.imageData}`}
            alt={`${facultyProfile.firstName}'s profile picture`}
            className="w-48 h-48 rounded-full shadow-lg object-cover"
          />
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Faculty Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <p className="text-lg mb-2"><strong>Name:</strong> {facultyProfile.firstName} {facultyProfile.lastName}</p>
            <p className="text-lg mb-2"><strong>Email:</strong> {facultyProfile.email}</p>
            <p className="text-lg mb-2"><strong>Post:</strong> {facultyProfile.post}</p>
            <p className="text-lg mb-2"><strong>Interest:</strong> {facultyProfile.interest.length > 0 ? facultyProfile.interest.join(', ') : 'No interests available'}</p>
          </div>

          {/* University Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">University Information</h2>
            <p className="text-lg mb-2"><strong>University:</strong> {facultyProfile.universityName}</p>
            <p className="text-lg mb-2"><strong>Address:</strong> {facultyProfile.address}</p>
            {facultyProfile.uniImage && (
              <div className="mt-6">
                <img
                  src={`data:image/jpeg;base64,${facultyProfile.uniImage}`}
                  alt={`${facultyProfile.universityName} image`}
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center mt-10">
          <button
            onClick={editProfile}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfilePage;
