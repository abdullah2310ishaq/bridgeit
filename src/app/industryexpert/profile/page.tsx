"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface IndustryExpertProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string; // Base64 image data
  companyName: string;
  contact: string;
  address: string;
}

const IndustryExpertProfilePage: React.FC = () => {
  const [industryExpertProfile, setIndustryExpertProfile] = useState<IndustryExpertProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchIndustryExpertProfile() {
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

          const industryExpertResponse = await fetch(`https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (industryExpertResponse.ok) {
            const industryExpertData = await industryExpertResponse.json();

            setIndustryExpertProfile({
              userId: industryExpertData.userId,
              firstName: industryExpertData.firstName || 'N/A',
              lastName: industryExpertData.lastName || 'N/A',
              email: industryExpertData.email || 'N/A',
              imageData: industryExpertData.imageData || '',
              companyName: industryExpertData.companyName || 'N/A',
              contact: industryExpertData.contact || 'N/A',
              address: industryExpertData.address || 'N/A',
            });
          } else {
            console.error('Failed to fetch industry expert profile:', industryExpertResponse.statusText);
            router.push('/unauthorized');
          }
        } else {
          console.error('Failed to fetch user info:', profileResponse.statusText);
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('An error occurred while fetching the industry expert profile:', error);
        router.push('/unauthorized');
      }
    }

    fetchIndustryExpertProfile();
  }, [router]);

  const goBack = () => {
    router.push('/industry-expert');
  };

  const editProfile = () => {
    router.push('/industry-expert/profile/edit');
  };

  if (!industryExpertProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 p-8">
      <h1 className="text-5xl font-bold mb-8 text-white">Industry Expert Profile</h1>
      <img
        src={`data:image/jpeg;base64,${industryExpertProfile.imageData}`}
        alt={`${industryExpertProfile.firstName}'s profile picture`}
        className="w-40 h-40 rounded-full mb-6 shadow-lg border-4 border-gray-700"
      />
      <p className="text-3xl font-semibold mb-2 text-white">{industryExpertProfile.firstName} {industryExpertProfile.lastName}</p>
      <p className="text-lg mb-4 text-gray-400">{industryExpertProfile.email}</p>
      <div className="text-lg space-y-2 text-gray-300 mb-8">
        <p><strong>Company:</strong> {industryExpertProfile.companyName}</p>
        <p><strong>Contact:</strong> {industryExpertProfile.contact}</p>
        <p><strong>Address:</strong> {industryExpertProfile.address}</p>
      </div>
      <div className="flex space-x-6">
        <button
          onClick={goBack}
          className="py-2 px-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300"
        >
          Back
        </button>
        {/* <button
          onClick={editProfile}
          className="py-2 px-8 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition duration-300"
        >
          Edit Profile
        </button> */}
      </div>
    </div>
  );
};

export default IndustryExpertProfilePage;
