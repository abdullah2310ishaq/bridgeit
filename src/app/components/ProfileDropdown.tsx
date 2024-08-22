import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileDropdownProps {
  userProfile: {
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
    imageData: string;
  };
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userProfile, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleEditProfile = () => {
    router.push('/student/profile/edit');
    setDropdownOpen(false);
  };

  const handleViewProfile = () => {
    router.push('/student/profile');
    setDropdownOpen(false);
  };

  const handleUpdateImage = () => {
    router.push('/student/profile/management');
    setDropdownOpen(false);
  };

  const handleUpdatePassword = () => {
    router.push('/student/profile/management');
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <img
        src={`data:image/jpeg;base64,${userProfile.imageData}`}
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
        onClick={toggleDropdown}
      />
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
          <button
            onClick={handleViewProfile}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            View Profile
          </button>
          <button
            onClick={handleEditProfile}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Edit Profile
          </button>
          <button
            onClick={handleUpdateImage}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Update Image
          </button>
          <button
            onClick={handleUpdatePassword}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Update Password
          </button>
          <button
            onClick={onLogout}
            className="block w-full px-4 py-2 text-left text-red-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
