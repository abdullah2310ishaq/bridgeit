"use client";
import React from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';

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
      // Add more cases for other user types if needed
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
    return '/default-profile.jpg'; // Provide a default image if none exists
  };

  const notAvailable = (value: string | undefined) => {
    return value ? value : "Not Available";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-10">
      <motion.div
        className="max-w-full text-white space-y-6 flex flex-col md:flex-row justify-between"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Section - Profile Information */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-extrabold">{profile.firstName} {profile.lastName}</h1>
          <p className="text-lg text-gray-300">{notAvailable(profile.email)}</p>
          {profile.description && (
            <p className="text-gray-400 italic text-xl mb-4">{notAvailable(profile.description)}</p>
          )}

          <div className="space-y-4">
            <p className="text-lg text-yellow-400">Roll Number: {notAvailable(profile.rollNumber)}</p>
          </div>

          {/* Additional Info: Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {profile.department && (
              <motion.div
                className="p-6 bg-gray-800 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-green-400">Department</h2>
                <p className="text-gray-300">{notAvailable(profile.department)}</p>
              </motion.div>
            )}
            {profile.universityName && (
              <motion.div
                className="p-6 bg-gray-800 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-blue-400">University</h2>
                <p className="text-gray-300">{notAvailable(profile.universityName)}</p>
              </motion.div>
            )}
            {profile.companyName && (
              <motion.div
                className="p-6 bg-gray-800 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-purple-400">Company</h2>
                <p className="text-gray-300">{notAvailable(profile.companyName)}</p>
              </motion.div>
            )}
            {profile.address && (
              <motion.div
                className="p-6 bg-gray-800 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-pink-400">Address</h2>
                <p className="text-gray-300">{notAvailable(profile.address)}</p>
              </motion.div>
            )}
            {profile.contact && (
              <motion.div
                className="p-6 bg-gray-800 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-red-400">Contact</h2>
                <p className="text-gray-300">{notAvailable(profile.contact)}</p>
              </motion.div>
            )}
          </div>

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-600 text-white py-2 px-4 rounded-full shadow-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Section - Profile Picture */}
        <motion.div
          className="md:ml-10 mt-10 md:mt-0 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative rounded-full w-56 h-56 overflow-hidden border-4 border-blue-600 shadow-lg"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={formatImageSrc(profile.imageData)}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
