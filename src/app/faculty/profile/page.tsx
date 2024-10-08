"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Mail, Briefcase, Book, School, MapPin } from "lucide-react"

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
<div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold">Faculty Profile</h1>
            <div className="flex space-x-4">
              <button
                onClick={goBack}
                className="px-4 py-2 bg-gray-800 text-gray-100 rounded-full hover:bg-gray-700 transition duration-300 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={editProfile}
                className="px-4 py-2 bg-blue-500 text-gray-100 rounded-full hover:bg-blue-400 transition duration-300 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="flex justify-center -mb-20">
            <img
              src={`data:image/jpeg;base64,${facultyProfile.imageData}`}
              alt={`${facultyProfile.firstName}'s profile picture`}
              className="w-40 h-40 rounded-full border-4 border-gray-800 shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="pt-24 px-6 sm:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Faculty Info */}
            <div className="bg-gray-700 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
                <Briefcase className="w-6 h-6 mr-2" />
                Personal Information
              </h2>
              <p className="text-lg mb-2"><strong>Name:</strong> {facultyProfile.firstName} {facultyProfile.lastName}</p>
              <p className="text-lg mb-2 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-400" />
                <strong>Email:</strong> {facultyProfile.email}
              </p>
              <p className="text-lg mb-2 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
                <strong>Post:</strong> {facultyProfile.post}
              </p>
              <p className="text-lg mb-2 flex items-start">
                <Book className="w-5 h-5 mr-2 mt-1 text-gray-400" />
                <span>
                  <strong>Interest:</strong> {facultyProfile.interest.length > 0 ? facultyProfile.interest.join(', ') : 'No interests available'}
                </span>
              </p>
            </div>

            {/* University Info */}
            <div className="bg-gray-700 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
                <School className="w-6 h-6 mr-2" />
                University Information
              </h2>
              <p className="text-lg mb-2 flex items-center">
                <School className="w-5 h-5 mr-2 text-gray-400" />
                <strong>University:</strong> {facultyProfile.universityName}
              </p>
              <p className="text-lg mb-2 flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1 text-gray-400" />
                <span>
                  <strong>Address:</strong> {facultyProfile.address}
                </span>
              </p>
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
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center pb-8">
          <button
            onClick={editProfile}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-gray-100 font-bold rounded-full shadow-md hover:from-blue-700 hover:to-purple-700 transition duration-300 flex items-center"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfilePage;
