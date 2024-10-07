"use client";
import React from "react";
import { motion } from "framer-motion";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  rollNumber: string;
  imageData: string;
  uniImage: string;
}

interface Props {
  userProfile: UserProfile;
  goToEditProfile: () => void;
  gotoProfile: () => void;
}

const ProfileSection: React.FC<Props> = ({ userProfile, goToEditProfile, gotoProfile }) => {
  return (
    <div
      className="relative flex flex-col md:flex-row items-center p-16 mb-10 rounded-xl shadow-lg"
      style={{
        backgroundImage: `url('data:image/jpeg;base64,${userProfile.uniImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay to Dim Background for Better Readability */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Profile Image in Rectangle */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 1 }}
        className="relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0"
      >
        <img
          src={`data:image/jpeg;base64,${userProfile.imageData}`} 
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
        <h2 className="text-5xl font-bold text-green-300 leading-tight drop-shadow-lg">
          Welcome, {userProfile.firstName} {userProfile.lastName}
        </h2>
        
        <p className="text-lg mt-4 text-gray-200 font-light">
          Roll Number: <span className="font-bold text-white">{userProfile.rollNumber}</span>
        </p>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-white">About Me:</h3>
          <p className="text-gray-300 mt-2 text-lg leading-relaxed">
            {userProfile.description}
          </p>
        </div>

        {/* Divider Line */}
        <div className="w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 my-8"></div>

        {/* Buttons */}
        <div className="flex justify-center md:justify-start space-x-6 mt-4">
          <button
            onClick={goToEditProfile}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
          >
            Edit Profile
          </button>
          <button
            onClick={gotoProfile}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-600 transition duration-300 transform hover:scale-105"
          >
            View Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSection;
