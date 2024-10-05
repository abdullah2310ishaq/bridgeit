"use client";
import React from "react";
import { FaUserTie, FaUserGraduate } from "react-icons/fa";
import { motion } from "framer-motion";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stack?: string;
  expertName?: string;
  studentName?: string;
  expertImageData?: string;
  onSelectProject: () => void;
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
  const renderStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const statusClass =
      status.toLowerCase()
 === "completed"
        ? "bg-green-500 text-white"
        : status.toLowerCase() === "pending"
        ? "bg-yellow-500 text-white"
        : "bg-red-500 text-white";

    const statusIcon =
      status.toLowerCase() === "completed" ? (
        <FaCheckCircle className="mr-1" />
      ) : status.toLowerCase() === "pending" ? (
        <FaExclamationCircle className="mr-1" />
      ) : null;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
      >
        {statusIcon} {status}
      </span>
    );
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Expert Image */}
      <div className="flex items-center mb-4">
        {expertImageData ? (
          <img
            src={`data:image/jpeg;base64,${expertImageData}`}
            alt={`${expertName}'s photo`}
            className="w-12 h-12 rounded-full mr-4"
          />
        ) : (
          <img
            src="/default-avatar.png"
            alt="Default Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-200">{expertName}</h3>
          {studentName && (
            <div className="flex items-center text-gray-400">
              <FaUserGraduate className="mr-1" />
              <span>{studentName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Project Title */}
      <h2 className="text-2xl font-bold text-green-400 mb-2">{title}</h2>

      {/* Project Description */}
      <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>

      {/* Tech Stack */}
      {stack && (
        <div className="mb-4">
          <span className="font-medium text-blue-400">Tech Stack:</span>{" "}
          <span>{stack}</span>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;