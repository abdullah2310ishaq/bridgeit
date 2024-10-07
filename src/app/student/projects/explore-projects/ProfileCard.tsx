import React from "react";
import { useRouter } from "next/navigation";
import { Edit, User } from "lucide-react"

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
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-lg overflow-hidden w-50 text-center transform hover:scale-105 transition-transform duration-300">
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

        {/* View Profile Button */}
        <button
          onClick={handleProfileRedirect}
          className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <span className="flex items-center justify-center">
              <User className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              View Profile
            </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;