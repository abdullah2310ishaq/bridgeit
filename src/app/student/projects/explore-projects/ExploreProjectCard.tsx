"use client";
import React from "react";
import { motion } from "framer-motion"
import { FaUserGraduate } from "react-icons/fa"
import { Code2, Layers } from "lucide-react"

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stack?: string;
  expertName?: string;
  studentName?: string;
  expertImageData?: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  stack,
  expertName,
  studentName,
  expertImageData,
  onClick,
}) => {
  return (
    <motion.div
    className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative group"
    whileHover={{ scale: 1.03, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    
    {/* Expert Info */}
    <div className="flex items-center mb-6 relative z-10">
      <div className="relative">
        {expertImageData ? (
          <img
            src={`data:image/jpeg;base64,${expertImageData}`}
            alt={`${expertName}'s photo`}
            className="w-16 h-16 rounded-full border-2 border-green-400 shadow-md"
          />
        ) : (
          <img
            //src="/default-avatar.png"
            //alt="Default Avatar"
            className="w-16 h-16 rounded-full border-2 border-green-400 shadow-md"
          />
        )}
        <div className="absolute bottom-0 right-0 bg-green-400 rounded-full p-1">
          <Code2 className="w-4 h-4 text-gray-900" />
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-bold text-white">{expertName}</h3>
        {studentName && (
          <div className="flex items-center text-gray-300 mt-1">
            <FaUserGraduate className="mr-2 text-blue-400" />
            <span className="text-sm">{studentName}</span>
          </div>
        )}
      </div>
    </div>

    {/* Project Title */}
    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-3">
      {title}
    </h2>

    {/* Project Description */}
    <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>

    {/* Tech Stack */}
    {stack && (
      <div className="flex items-center mt-4 text-sm">
        <Layers className="w-5 h-5 mr-2 text-blue-400" />
        <span className="font-medium text-blue-400 mr-2">Tech Stack:</span>
        <span className="text-gray-300">{stack}</span>
      </div>
    )}

    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-green-400 opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-400 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
  </motion.div>
  );
};

export default ProjectCard;