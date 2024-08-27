import React from 'react';

interface OngoingProjectProps {
  title: string;
  description: string;
  technologies: string[];
}

const OngoingProject: React.FC<OngoingProjectProps> = ({ title, description, technologies }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-bold text-black">Ongoing Project</h3>
      <h4 className="text-md font-semibold text-blue-600 mt-2">Title: {title}</h4>
      <p className="text-gray-600 mt-2">{description}</p>
      <p className="mt-4 font-semibold text-gray-700">Technologies Used: 
        <span className="text-blue-600"> {technologies.join(', ')}</span>
      </p>
    </div>
  );
};

export default OngoingProject;
