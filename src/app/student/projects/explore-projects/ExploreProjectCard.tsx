"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaUserGraduate } from "react-icons/fa";
import { Layers } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  studentName?: string;
  budget?: number;
  hasPending?: boolean;  
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
  hasPending = false,
  onClick,
}) => {
  return (
    <motion.div
      onClick={!hasPending ? onClick : undefined}
      className={`
        bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-2xl p-6 
        transition-all duration-300 relative group overflow-hidden
        ${hasPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-2xl"}
      `}
      whileHover={!hasPending ? { scale: 1.03, y: -5 } : {}}
      whileTap={!hasPending ? { scale: 0.98 } : {}}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

      {/* Expert & Status */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{expertName || "No Expert"}</h3>
        {status && (
          <span className="text-sm text-yellow-400 border border-yellow-400 px-2 py-0.5 rounded">
            {status}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
        {title}
      </h2>

      {/* Description */}
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
      {typeof budget === "number" && (
        <p className="text-sm text-green-400 mb-2">
          <strong>Budget:</strong> ${budget}
        </p>
      )}

      {/* Student Name */}
      {studentName && (
        <div className="flex items-center text-gray-300 mt-2">
          <FaUserGraduate className="mr-2 text-blue-400" />
          <span className="text-sm">{studentName}</span>
        </div>
      )}

      {/* If pending, show a small note */}
      {hasPending && (
        <div className="mt-2 text-yellow-300 text-sm font-semibold">
          You already have a pending proposal for this project
        </div>
      )}

      {/* Decorative gradient circles */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-green-400 opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-400 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
    </motion.div>
  );
};

export default ProjectCard;
