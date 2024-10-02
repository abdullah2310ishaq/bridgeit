import React from "react";
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
  expertImageData?: string;
  onSelectProject: () => void; // Callback to handle project selection
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  stack,
  status,
  expertName,
  studentName,
  expertImageData,
  onSelectProject,
}) => {
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
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <motion.div
        className="bg-gray-900 text-gray-200 shadow-xl rounded-2xl p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 w-full lg:w-[550px] h-[220px]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelectProject}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {expertImageData ? (
              <img
                src={`data:image/jpeg;base64,${expertImageData}`}
                alt={`${expertName}'s photo`}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-800 shadow-lg"
              />
            ) : (
              <img
                src="/heroimage.png"
                alt="Default Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-800 shadow-lg"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-400">{title}</h3>
            {expertName && (
              <div className="flex items-center mt-2 text-sm text-gray-300">
                <FaUserTie className="text-blue-500 mr-2" />
                <span>Expert: {expertName}</span>
              </div>
            )}
            {studentName && (
              <div className="flex items-center mt-2 text-sm text-gray-300">
                <FaUserGraduate className="text-green-400 mr-2" />
                <span>Company: {studentName}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-4 line-clamp-2">{description}</p>
        {stack && (
          <div className="mt-4">
            <span className="font-medium text-blue-400">Tech Stack:</span>{" "}
            <span>{stack}</span>
          </div>
        )}
        {status && <div className="mt-4">{renderStatusBadge(status)}</div>}
      </motion.div>
    </div>
  );
};

export default ProjectCard;
