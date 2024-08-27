import React from 'react';

interface FacultyProfileProps {
  facultyProfile: {
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
    imageData: string;
  };
  onEditProfile: () => void;
  onViewProfile: () => void;
}

const FacultyProfile: React.FC<FacultyProfileProps> = ({ facultyProfile, onEditProfile, onViewProfile }) => {
  return (
    <div 
      className="relative bg-cover bg-center p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto flex items-center" 
      style={{ backgroundImage: `url('/faculty.jpg')`, height: "300px" }}
    >
      <div className="absolute inset-0 opacity-50 rounded-lg"></div>
      <div className="relative flex items-center w-full">
        <div className="flex-shrink-0">
          <img
            src={`data:image/jpeg;base64,${facultyProfile.imageData}`}
            alt={`${facultyProfile.firstName} ${facultyProfile.lastName}`}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mr-8"
          />
        </div>
        <div className="flex-grow text-white text-center">
          <h2 className="text-2xl font-bold">
            {facultyProfile.firstName} {facultyProfile.lastName}
          </h2>
          <p className="text-lg">Role: {facultyProfile.role}</p>
          <p className="text-lg">User ID: {facultyProfile.userId}</p>
          <div className="mt-4 space-x-4">
            <button onClick={onEditProfile} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
              Edit Profile
            </button>
            <button onClick={onViewProfile} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
