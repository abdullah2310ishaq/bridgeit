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
//   post: string;

  onViewProjects: () => void;
  onEditProfile: () => void;
  onAddProjects: () => void;
}

const IndustryProfile: React.FC<IndustryProfileProps> = ({
  companyLogo,
  companyName,
  userId,
  indExptId,
  companyId,
  firstName,
  lastName,
  email,
  address,
  contact,
//   post,
  onViewProjects,
  onEditProfile,
  onAddProjects,
}) => {
  return (
    <div className="relative bg-cover bg-center p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto flex items-center"
      style={{ backgroundImage: `url('/industry-background.jpg')`, height: "300px" }}>
      <div className="absolute inset-0 bg-gray-900 opacity-50 rounded-lg"></div>
      <div className="relative flex items-center w-full">
        <div className="flex-shrink-0">
          <img
            src={`data:image/jpeg;base64,${companyLogo}`}
            alt={companyName}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mr-8"
          />
        </div>
        <div className="flex-grow text-white text-center">
          <h2 className="text-2xl font-bold">{companyName}</h2>
          <div className="mt-4 space-x-6">
            <button onClick={onViewProjects} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
              View Projects
            </button>
            <button onClick={onEditProfile} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
              Edit Profile
            </button>
            <button onClick={onAddProjects} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
              Add Projects
            </button>
          </div>
          <div className="mt-4 text-gray-300">
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Industry Expert ID:</strong> {indExptId}</p>
            <p><strong>Company ID:</strong> {companyId}</p>
            <p><strong>First Name:</strong> {firstName}</p>
            <p><strong>Last Name:</strong> {lastName}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Contact:</strong> {contact}</p>
            {/* <p><strong>Post:</strong> {post}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryProfile;
