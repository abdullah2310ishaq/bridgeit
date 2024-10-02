import React from "react";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  imageData: string;
  firstName: string;
  lastName: string;
  role: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageData, firstName, lastName, role }) => {
  const router = useRouter();

  const handleProfileRedirect = () => {
    router.push("/student");
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-lg overflow-hidden w-60 text-center transform hover:scale-105 transition-transform duration-300">
      {/* Upper Section with Image */}
      <div className="bg-gradient-to-t from-green-400 to-blue-500 h-20"></div>

      {/* Profile Image */}
      <div className="relative -mt-12">
        <img
          src={imageData || "/default-profile.png"}
          alt="Profile Picture"
          className="mx-auto h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg transform hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Name and Role */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{`${firstName} ${lastName}`}</h3>
        <p className="text-sm text-gray-200 mb-4">{role}</p>

        {/* Modern View Profile Button */}
        <button
          onClick={handleProfileRedirect}
          className="py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;