// components/ProfileDropdown.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";

interface ProfileDropdownProps {
  userProfile: {
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
    imageData: string;
  };
  onLogoutClick: () => void; // Updated prop name
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userProfile,
  onLogoutClick,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleEditProfile = () => {
    router.push("/student/profile/edit");
    setDropdownOpen(false);
  };

  const handleViewProfile = () => {
    router.push("/student/profile");
    setDropdownOpen(false);
  };

  const updateImage = () => {
    router.push("/student/profile/management");
    setDropdownOpen(false);
  };

  const updatePassword =()=>{
    router.push("student/profile/edit");
    setDropdownOpen(false);
  }


  const handleLogoutClickLocal = () => {
    setDropdownOpen(false);
    onLogoutClick(); // Trigger the dialog in NavBar
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none"
      >
        <img
          src={`data:image/jpeg;base64,${userProfile.imageData}`}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-blue-600"
        />
        <FaChevronDown className="ml-2 text-gray-600 hover:text-blue-600 transition duration-300" />
      </button>
      {dropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-700">
                {userProfile.firstName} {userProfile.lastName}
              </p>
            </div>
            <button
              onClick={handleViewProfile}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              View Profile
            </button>
            <button
              onClick={handleEditProfile}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogoutClickLocal}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>

            <button
              onClick={updateImage}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Upload Image
            </button>

            <button
              onClick={updatePassword}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Update Password
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
