import React from "react";
import { useRouter } from "next/navigation";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaUserTie,
  FaUserGraduate,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  studentName?: string;
  expertImageData?: string; // Image data in Base64
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  stack,
  status,
  expertName,
  studentName,
  expertImageData, // Image data for expert
}) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/student/projects/${id}`);
  };

  const renderStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const statusClass =
      status.toLowerCase() === "completed"
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
      className="bg-gray-900 text-gray-200 shadow-xl rounded-2xl p-6 flex items-start space-x-6 hover:shadow-2xl transition-shadow duration-300 max-w-3xl transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image on the Left */}
      <div className="flex-shrink-0">
        {expertImageData ? (
          <img
            src={`data:image/jpeg;base64,${expertImageData}`} // Base64 encoded image
            alt={`${expertName}'s photo`}
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg"
          />
        ) : (
          <img
            src="/heroimage.png" // Placeholder image if no imageData is available
            alt="Default Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg"
          />
        )}
      </div>

      {/* Right Side Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          {/* Title */}
          <h3 className="text-xl font-bold text-blue-400">{title}</h3>
          {/* Optional Close Button or other action */}
          <button className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        {/* Expert Name */}
        {expertName && (
          <div className="flex items-center mt-2 text-sm text-gray-300">
            <FaUserTie className="text-blue-500 mr-2" />
            <span>Expert: {expertName}</span>
          </div>
        )}

        {/* Student/Company Name */}
        {studentName && (
          <div className="flex items-center mt-2 text-sm text-gray-300">
            <FaUserGraduate className="text-green-400 mr-2" />
            <span>Company: {studentName}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-400 mt-4 line-clamp-2">{description}</p>

        {/* Tech Stack */}
        {stack && (
          <div className="mt-4">
            <span className="font-medium text-blue-400">Tech Stack:</span>{" "}
            <span>{stack}</span>
          </div>
        )}

        {/* Status Badge */}
        {status && <div className="mt-4">{renderStatusBadge(status)}</div>}

        {/* View Details Button */}
        <button
          className="mt-6 py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-lg transform hover:scale-105"
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
