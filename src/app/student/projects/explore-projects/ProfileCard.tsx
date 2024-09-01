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
    <div className="absolute top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg w-60">
      <div className="flex flex-col items-center">
        <img 
          src={imageData || "/default-profile.png"} 
          alt="Profile Picture" 
          className="w-20 h-20 rounded-full object-cover mb-2"
        />
        <h3 className="text-lg font-semibold text-white">{`${firstName} ${lastName}`}</h3>
        <p className="text-sm text-gray-400">{role}</p>
        <button
          onClick={handleProfileRedirect}
          className="mt-4 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-200"
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
