import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description }) => {
  const imageSrc = "/image.png"; 

  return (
    <div className="flex items-center bg-white rounded-lg shadow-lg p-6 mb-4 w-full">
      <div className="flex-1 text-center">
        <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <button className="mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
          Learn More
        </button>
      </div>
      <div className="ml-6">
        <img src={imageSrc} alt="Project illustration" className="w-32 h-32 object-contain" />
      </div>
    </div>
  );
};

export default ProjectCard;
