import React from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaExclamationCircle, FaUserTie, FaUserGraduate } from "react-icons/fa";
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
      className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Check if expert image data exists and display the image */}
      {expertImageData ? (
  <img
    src={`data:image/jpeg;base64,${expertImageData}`} // Base64 encoded image
    alt={`${expertName}'s photo`}
    className="w-12 h-12 rounded-full mb-4"
  />
) : (
  <img
    src="/heroimage.png" // Placeholder image if no imageData is available
    alt="Default Avatar"
    className="w-12 h-12 rounded-full mb-4"
  />
)}


      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-500 mb-4 line-clamp-3">{description}</p>

      {stack && (
        <div className="mb-4">
          <span className="font-medium text-blue-500">Tech Stack:</span> <span>{stack}</span>
        </div>
      )}

      {status && <div className="mb-4">{renderStatusBadge(status)}</div>}

      {expertName && (
        <div className="flex items-center mb-2 text-gray-600">
          <FaUserTie className="text-blue-500 mr-2" />
          <span>Expert: {expertName}</span>
        </div>
      )}

      {studentName && (
        <div className="flex items-center mb-4 text-gray-600">
          <FaUserGraduate className="text-green-500 mr-2" />
          <span>Company: {studentName}</span>
        </div>
      )}

      <button
        className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300"
        onClick={handleViewDetails}
      >
        View Details
      </button>
    </motion.div>
  );
};

export default ProjectCard;
