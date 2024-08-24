import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description }) => {
  const imageSrc = "/image.png"; 

  return (
    <div className="flex items-center bg-white rounded-lg shadow-lg p-6 mb-4 w-full hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="relative flex-1 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        <button className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
          Learn More
        </button>
        
      </div>
      <div className="ml-6">
        <img src={imageSrc} alt="Project illustration" className="w-32 h-32 object-cover rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default ProjectCard;
