"use client";
import React from 'react';
import { notFound } from 'next/navigation';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string | null;
  description: string;
  department?: string;
  universityName?: string;
  address?: string;
  companyName?: string;
  contact?: string;
  rollNumber?: string;
  skills?: string[];
}

async function fetchProfile(type: string, userId: string): Promise<UserProfile | null> {
  let response;
  try {
    switch (type) {
      case 'student':
        response = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`);
        break;
      case 'faculty':
        response = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`);
        break;
      case 'industry':
        response = await fetch(`https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`);
        break;
      default:
        throw new Error('Invalid type');
    }

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

const ProfilePage = async ({ params }: { params: { type: string; userId: string } }) => {
  const { type, userId } = params;

  const profile = await fetchProfile(type, userId);

  if (!profile) {
    notFound();
  }

  const formatImageSrc = (imageData: string | null) => {
    if (imageData) {
      return imageData.startsWith('data:image') ? imageData : `data:image/jpeg;base64,${imageData}`;
    }
    return '/default-profile.jpg'; // Provide a default image
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700">
          <div className="flex justify-center">
            <img
              src={formatImageSrc(profile.imageData)}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-600 shadow-md"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-center text-white mt-4">{profile.firstName} {profile.lastName}</h1>
          <p className="text-gray-300 text-center mt-2">Email: {profile.email}</p>

          {profile.description && <p className="text-gray-400 text-center mt-4">{profile.description}</p>}
          {profile.department && <p className="text-gray-400 text-center mt-2">Department: {profile.department}</p>}
          {profile.universityName && <p className="text-gray-400 text-center mt-2">University: {profile.universityName}</p>}
          {profile.companyName && <p className="text-gray-400 text-center mt-2">Company: {profile.companyName}</p>}
          {profile.rollNumber && <p className="text-gray-400 text-center mt-2">Roll Number: {profile.rollNumber}</p>}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-200">Skills</h2>
              <ul className="list-disc list-inside mt-2 text-gray-400">
                {profile.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          {profile.address && <p className="text-gray-400 text-center mt-2">Address: {profile.address}</p>}
          {profile.contact && <p className="text-gray-400 text-center mt-2">Contact: {profile.contact}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
