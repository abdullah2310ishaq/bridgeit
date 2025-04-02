"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, User } from "lucide-react";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  rollNumber: string;
  imageData?: string;
  uniImage?: string;
}

interface Props {
  userProfile: UserProfile;
  goToEditProfile: () => void;
  gotoProfile: () => void;
}

const ProfileSection: React.FC<Props> = ({ userProfile, goToEditProfile, gotoProfile }) => {
  const [showModal, setShowModal] = useState(false);

  const profileImageSrc = userProfile.imageData
    ? `data:image/jpeg;base64,${userProfile.imageData}`
    : "/unknown.jpg";

  const backgroundImageUrl = userProfile.uniImage
    ? `url('data:image/jpeg;base64,${userProfile.uniImage}')`
    : "url('/unknown.jpg')";

  return (
    <>
      <div
        className="relative flex flex-col md:flex-row items-center p-10 mb-10 rounded-xl shadow-lg overflow-hidden"
        style={{
          backgroundImage: backgroundImageUrl,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 backdrop-sm"></div>

        {/* Profile Image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0"
        >
          <img
            src={profileImageSrc}
            alt={`${userProfile.firstName} ${userProfile.lastName}`}
            className="w-52 h-52 rounded-full object-cover shadow-xl border-4 border-blue-500 cursor-pointer hover:scale-105 transition"
            onClick={() => setShowModal(true)}
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-gray-800 flex-grow text-center md:text-left md:pl-12"
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            Welcome, {userProfile.firstName} {userProfile.lastName}
          </h2>
          <p className="text-base text-gray-700 mt-1">
            <strong>Roll No:</strong> {userProfile.rollNumber}
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {userProfile.description}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-blue-300 my-6" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={goToEditProfile}
              className="group px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
            >
              <span className="flex items-center justify-center gap-2">
                <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Edit Profile
              </span>
            </button>
            <button
              onClick={gotoProfile}
              className="group px-6 py-2 bg-white border border-blue-500 text-blue-700 rounded-full shadow hover:bg-blue-50 transition"
            >
              <span className="flex items-center justify-center gap-2">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                View Profile
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 font-bold text-xl"
            >
              &times;
            </button>
            <img
              src={profileImageSrc}
              alt="Profile Full"
              className="w-full h-auto rounded-lg object-cover"
            />
            <p className="text-center mt-4 text-gray-700 font-semibold">
              {userProfile.firstName} {userProfile.lastName}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSection;
