// components/ProjectCard.tsx
import React from "react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  id: string; // Add id for dynamic routing
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  studentName?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id, // Pass id here
  title,
  description,
  stack,
  status,
  expertName,
  studentName,
}) => {
  const router = useRouter();

  const handleViewDetails = () => {
    // Navigate to the dynamic route for project details
    router.push(`/student/projects/${id}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-gray-800 text-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-start w-full mb-6 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="font-extrabold text-2xl text-green-400 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-300 mb-4 line-clamp-3">{description}</p>
      {stack && (
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-semibold text-blue-300">Stack:</span> {stack}
        </p>
      )}
      {status && (
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-semibold text-blue-300">Status:</span> {status}
        </p>
      )}
      {expertName && (
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-semibold text-blue-300">Expert:</span> {expertName}
        </p>
      )}
      {studentName && (
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-semibold text-blue-300">Student:</span> {studentName}
        </p>
      )}
      <button
        className="mt-4 text-white bg-gradient-to-r from-green-400 to-green-500 rounded-full py-2 px-6 hover:from-green-500 hover:to-green-600 transition-colors duration-200 shadow-lg"
        onClick={handleViewDetails}
      >
        See Details
      </button>
    </div>
  );
};

export default ProjectCard;
