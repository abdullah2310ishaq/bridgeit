import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  endDate: string;
  name: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, endDate, name }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-gray-500 mb-1"><strong>End Date:</strong> {endDate}</p>
      <p className="text-gray-500"><strong>Assigned by:</strong> {name}</p>
    </div>
  );
};

export default ProjectCard;
