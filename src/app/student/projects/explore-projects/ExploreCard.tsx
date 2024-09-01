import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description }) => {
  return (
    <div className="bg-gray-800 text-gray-100 rounded-lg shadow p-6 flex items-start w-full mb-6">
      <div className="w-24 h-24 bg-gray-700 rounded-full flex-shrink-0"></div>
      <div className="ml-6 flex-1">
        <h3 className="font-semibold text-xl text-green-400">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <button className="text-gray-900 bg-green-400 rounded py-2 px-4 hover:bg-green-500 transition duration-200">
            Request Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
