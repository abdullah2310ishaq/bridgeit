// components/ProfileCard.tsx
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
    <div className="bg-gradient-to-t from-gray-700 to-gray-800 text-gray-200 rounded-3xl shadow-xl p-6 flex flex-col items-center">
      <img
        src={imageData || "/default-profile.png"}
        alt="Profile Picture"
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-green-500"
      />
      <h3 className="text-xl font-semibold">{`${firstName} ${lastName}`}</h3>
      <p className="text-sm text-gray-400 mb-4">{role}</p>
      <button
        onClick={handleProfileRedirect}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-full hover:from-green-600 hover:to-green-700 transition-colors duration-300 shadow-md flex items-center justify-center"
      >
        View Profile
      </button>
    </div>
  );
};

export default ProfileCard;