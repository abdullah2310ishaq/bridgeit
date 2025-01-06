"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Edit, User } from "lucide-react";

interface IndustryProfileProps {
  companyLogo: string; // Base64 string
  companyName: string;
  userId: string;
  description: string;
  indExptId: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  contact: string;
}

const IndustryProfile: React.FC<IndustryProfileProps> = ({
  companyLogo,
  companyName,
  firstName,
  lastName,
  description,
  indExptId,
  email,
  address,
  contact,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleEditProfile = () => {
    router.push(`/industryexpert/profile/editexpert`);
  };

  const handleViewProjects = () => {
    router.push(`/industryexpert/projects`);
  };

  const handleAddProjects = () => {
    router.push(`/industryexpert/projects/create`);
  };

  const profileImageSrc = companyLogo
    ? `data:image/jpeg;base64,${companyLogo}`
    : "/default-profile.png";

  const companyBackgroundImageSrc = "/studenttop.jpg";

  return (
    <div>
      {/* Profile Section */}
      <div
        className="relative flex flex-col md:flex-row items-center p-16 mb-10 rounded-xl shadow-lg"
        style={{
          backgroundImage: `url('${companyBackgroundImageSrc}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay to Dim Background for Better Readability */}
        <div className="absolute inset-0 bg-gray-900 opacity-70"></div>

        {/* Profile Image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0"
        >
          <img
            src={profileImageSrc}
            alt={`${firstName} ${lastName}`}
            className="w-64 h-64 rounded-lg object-cover shadow-2xl border-4 border-green-400 cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          />
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white flex-grow text-center md:text-left md:pl-12"
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {firstName} {lastName}
          </h2>

          {/* Company and Contact Info */}
          <p className="text-lg mt-4 text-gray-200 font-light">
            Company: <span className="font-bold text-white">{companyName}</span>
          </p>
          <p className="text-lg mt-1 text-gray-200 font-light">
            Contact: <span className="font-bold text-white">{contact}</span>
          </p>
          <p className="text-lg mt-1 text-gray-200 font-light">
            Email: <span className="font-bold text-white">{email}</span>
          </p>
          <p className="text-lg mt-1 text-gray-200 font-light">
            Address: <span className="font-bold text-white">{address}</span>
          </p>
          <p className="text-lg mt-1 text-gray-200 font-light">
            Description: <span className="font-bold text-white">{description}</span>
          </p>

          {/* Divider Line */}
          <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 my-8"></div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
            <button
              onClick={handleEditProfile}
              className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center">
                <Edit className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
                Edit Profile
              </span>
            </button>

            <button
              onClick={handleViewProjects}
              className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center">
                <User className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                View Projects
              </span>
            </button>

            <button
              onClick={handleAddProjects}
              className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-green-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 transform group-hover:rotate-45 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Projects
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal for Enlarged Profile Image */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
            >
              ✕
            </button>
            <img
              src={profileImageSrc}
              alt="Enlarged Profile"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryProfile;
