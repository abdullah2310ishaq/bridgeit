import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  endDate: string;
  name: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, endDate, name }) => {
  const gradientStyles = [
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
    "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500",
    "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
  ];

  return (
    <div className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden ${gradientStyles[Math.floor(Math.random() * gradientStyles.length)]}`}>
      <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-200 mb-2">{description}</p>
        <p className="text-gray-300 mb-1"><strong>End Date:</strong> {endDate}</p>
        <p className="text-gray-300"><strong>Assigned by:</strong> {name}</p>
      </div>
    </div>
    
  );
};


export default ProjectCard;
