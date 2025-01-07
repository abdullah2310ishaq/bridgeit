'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FacultyProfileProps {
  facultyProfile: FacultyProfileData;
  onViewProfile: () => void;
  onEditProfile: () => void;
}

interface FacultyProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string | null; // Nullable to handle missing image
  description: string;
  department: string;
  interest: string[];
  post: string;
  universityName: string;
  address: string;
  uniImage: string;
}

const FacultyProfile: React.FC<FacultyProfileProps> = ({ onEditProfile, onViewProfile }) => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFacultyProfile = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        // Fetch user profile data
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          // Fetch faculty details by userId
          const facultyResponse = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();
            setFacultyProfile({
              id: facultyData.id,
              userId: facultyData.userId,
              firstName: facultyData.firstName,
              lastName: facultyData.lastName,
              email: facultyData.email,
              imageData: facultyData.imageData
                ? `data:image/jpeg;base64,${facultyData.imageData}`
                : null, // Handle missing image
              description: facultyData.description,
              department: facultyData.department,
              interest: facultyData.interest,
              post: facultyData.post,
              universityName: facultyData.universityName,
              address: facultyData.address,
              uniImage: facultyData.uniImage
                ? `data:image/jpeg;base64,${facultyData.uniImage}`
                : '/unknown.jpg', // Placeholder if university image is missing
            });
          } else {
            console.error('Failed to fetch faculty details.');
          }
        } else {
          console.error('Failed to fetch user profile.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchFacultyProfile();
  }, [router]);

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div
      className="relative flex flex-col md:flex-row items-center p-16 mb-10 rounded-xl shadow-lg"
      style={{
        backgroundImage: `url('${facultyProfile.uniImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-70"></div>

      {/* Profile Image */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0"
      >
        <img
          src={facultyProfile.imageData || '/unknown.jpg'} // Use placeholder if no image is available
          alt={`${facultyProfile.firstName} ${facultyProfile.lastName}`}
          className="w-64 h-64 rounded-lg object-cover shadow-2xl border-4 border-blue-400 cursor-pointer"
        />
      </motion.div>

      {/* Profile Details */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-white flex-grow text-center md:text-left md:pl-12"
      >
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {facultyProfile.firstName} {facultyProfile.lastName}
        </h2>

        <p className="text-lg mt-4 text-gray-200 font-light">
          Post: <span className="font-bold text-white">{facultyProfile.post}</span>
        </p>
        <p className="text-lg mt-4 text-gray-200 font-light">
          Department: <span className="font-bold text-white">{facultyProfile.department}</span>
        </p>
        <p className="text-lg mt-4 text-gray-200 font-light">
          Interests:{" "}
          <span className="font-bold text-white">{facultyProfile.interest.join(", ")}</span>
        </p>
        <p className="text-lg mt-4 text-gray-200 font-light">
          University: <span className="font-bold text-white">{facultyProfile.universityName}</span>
        </p>

        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 my-8"></div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
          <button
            onClick={onEditProfile}
            className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="flex items-center justify-center">
              <Edit className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
              Edit Profile
            </span>
          </button>
          <button
            onClick={onViewProfile}
            className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <span className="flex items-center justify-center">
              <User className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              View Profile
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyProfile;
