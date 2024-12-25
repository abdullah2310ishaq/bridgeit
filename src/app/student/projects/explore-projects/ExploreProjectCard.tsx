"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaUserGraduate } from "react-icons/fa";
import { Code2, Layers } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  studentName?: string; // from your API if assigned
  budget?: number;      // new field
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  stack,
  status,
  expertName,
  studentName,
  budget,
  onClick,
}) => {
  return (
    <motion.div
      onClick={onClick}
      className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative group"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

      {/* Top row: Expert Name & status, or other fields */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{expertName || "No Expert"}</h3>
        {status && (
          <span className="text-sm text-yellow-400 border border-yellow-400 px-2 py-0.5 rounded">
            {status}
          </span>
        )}
      </div>

      {/* Project Title */}
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
        {title}
      </h2>

      {/* Project Description */}
      <p className="text-gray-300 mb-3 line-clamp-3">{description}</p>

      {/* Tech Stack */}
      {stack && (
        <div className="flex items-center text-sm mb-2">
          <Layers className="w-5 h-5 mr-2 text-blue-400" />
          <span className="font-medium text-blue-400 mr-2">Tech Stack:</span>
          <span className="text-gray-300">{stack}</span>
        </div>
      )}

      {/* Budget */}
      {budget !== undefined && (
        <p className="text-sm text-green-400 mb-2">
          <strong>Budget:</strong> ${budget}
        </p>
      )}

      {/* Student Name (if assigned) */}
      {studentName && (
        <div className="flex items-center text-gray-300 mt-2">
          <FaUserGraduate className="mr-2 text-blue-400" />
          <span className="text-sm">{studentName}</span>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-green-400 opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-400 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
    </motion.div>
  );
};

export default ProjectCard;
