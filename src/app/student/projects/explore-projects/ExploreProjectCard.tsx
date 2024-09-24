import React from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaExclamationCircle, FaUserTie, FaUserGraduate } from "react-icons/fa"; // Icons for better UI

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  studentName?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  stack,
  status,
  expertName,
  studentName,
}) => {
  const router = useRouter();

  // Navigate to project details page
  const handleViewDetails = () => {
    router.push(`/student/projects/${id}`);
  };

  // Status badge with dynamic colors
  const renderStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const statusClass =
      status.toLowerCase() === "completed"
        ? "bg-green-500 text-green-100"
        : status.toLowerCase() === "pending"
        ? "bg-yellow-500 text-yellow-100"
        : "bg-red-500 text-red-100";

    const statusIcon =
      status.toLowerCase() === "completed" ? (
        <FaCheckCircle className="mr-1" />
      ) : status.toLowerCase() === "pending" ? (
        <FaExclamationCircle className="mr-1" />
      ) : null;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
        {statusIcon} {status}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 text-gray-100 rounded-lg shadow-xl p-6 w-full mb-8 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
      <h3 className="font-extrabold text-2xl text-green-400 mb-4 tracking-tight">
        {title}
      </h3>
      <p className="text-base text-gray-300 mb-4 line-clamp-3 leading-relaxed">
        {description}
      </p>
      {stack && (
        <div className="mb-4">
          <span className="text-sm font-semibold text-blue-300">Tech Stack:</span>{" "}
          <span className="text-sm text-gray-200">{stack}</span>
        </div>
      )}
      {status && (
        <div className="mb-4">
          {renderStatusBadge(status)}
        </div>
      )}
      {expertName && (
        <div className="flex items-center mb-2 text-sm text-gray-400">
          <FaUserTie className="text-blue-400 mr-2" />
          <span>
            <span className="font-semibold text-blue-300">Expert:</span>{" "}
            {expertName}
          </span>
        </div>
      )}
      {studentName && (
        <div className="flex items-center mb-2 text-sm text-gray-400">
          <FaUserGraduate className="text-green-400 mr-2" />
          <span>
            <span className="font-semibold text-green-300">Student:</span>{" "}
            {studentName}
          </span>
        </div>
      )}
      <button
        className="mt-4 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2 px-6 hover:from-green-600 hover:to-green-700 transition-transform duration-200 ease-in-out shadow-lg"
        onClick={handleViewDetails}
      >
        View Details
      </button>
    </div>
  );
};

export default ProjectCard;
