import React from 'react';

interface IndustryProfileProps {
  companyLogo: string;
  companyName: string;
  userId: string;
  indExptId: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  contact: string;
  onViewProjects: () => void;
  onEditProfile: () => void;
  onAddProjects: () => void;
}

const IndustryProfile: React.FC<IndustryProfileProps> = ({
  companyLogo,
  companyName,
  firstName,
  lastName,
  email,
  address,
  contact,
  onViewProjects,
  onEditProfile,
  onAddProjects,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center md:flex-row md:items-start">
      <img
        src={`data:image/jpeg;base64,${companyLogo}`}
        alt={companyName}
        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mr-8 mb-4 md:mb-0"
      />
      <div className="text-center md:text-left flex-grow">
        <h2 className="text-2xl font-bold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600">By {firstName} {lastName}</p>
        <p className="text-sm text-gray-500">Email: {email}</p>
        <p className="text-sm text-gray-500">Address: {address}</p>
        <p className="text-sm text-gray-500">Contact: {contact}</p>
        <div className="flex space-x-4 mt-4">
          <button onClick={onViewProjects} className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition">
            View Projects
          </button>
          <button onClick={onEditProfile} className="py-2 px-4 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500 transition">
            Edit Profile
          </button>
          <button onClick={onAddProjects} className="py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 transition">
            Add Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryProfile;
