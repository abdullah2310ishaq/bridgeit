// ProjectCard.tsx
import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  endDate: string;
  name: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, endDate, name }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-gray-500 mb-2">End Date: {endDate}</p>
      <p className="text-gray-500">Assigned by: {name}</p>
    </div>
  );
};

export default ProjectCard;
