"use client";
import React from "react";
import { motion } from "framer-motion";
import { Edit, User } from "lucide-react"

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  rollNumber: string;
  imageData?: string; // Marking them as optional
  uniImage?: string;  // Marking them as optional
}

interface Props {
  userProfile: UserProfile;
  goToEditProfile: () => void;
  gotoProfile: () => void;
}

const ProfileSection: React.FC<Props> = ({ userProfile, goToEditProfile, gotoProfile }) => {
  const profileImageSrc = userProfile.imageData
    ? `data:image/jpeg;base64,${userProfile.imageData}`
    : "/unknown.jpg"; // Default image if imageData is missing

  const backgroundImageUrl = userProfile.uniImage
    ? `url('data:image/jpeg;base64,${userProfile.uniImage}')`
    : "url('/unknown.jpg')"; // Default background if uniImage is missing

  return (
    <div
      className="relative flex flex-col md:flex-row items-center p-16 mb-10 rounded-xl shadow-lg"
      style={{
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay to Dim Background for Better Readability */}
      <div className="absolute inset-0 bg-gray-900 opacity-70"></div>

      {/* Profile Image in Rectangle */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 1 }}
        className="relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0"
      >
        <img
          src={profileImageSrc} 
          alt={`${userProfile.firstName} ${userProfile.lastName}`} 
          className="w-64 h-64 rounded-lg object-cover shadow-2xl border-4 border-green-400 cursor-pointer"
        />
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-white flex-grow text-center md:text-left md:pl-12"
      >
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Welcome, {userProfile.firstName} {userProfile.lastName}
        </h2>
        
        <p className="text-lg mt-4 text-gray-200 font-light">
          Roll Number: <span className="font-bold text-white">{userProfile.rollNumber}</span>
        </p>

        {/* Description */}
        <div className="mt-6">
          <p className="text-gray-200 mt-2 text-lg leading-relaxed">
            {userProfile.description}
          </p>
        </div>

        {/* Divider Line */}
        <div className="w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 my-8"></div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
          <button
            onClick={goToEditProfile}
            className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="flex items-center justify-center">
              <Edit className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
              Edit Profile
            </span>
          </button>
          <button
            onClick={gotoProfile}
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

export default ProfileSection;
