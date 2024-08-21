// SideNavbar.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SideNavbarProps {
  activePage: string; // To highlight the active page
}

const SideNavbar: React.FC<SideNavbarProps> = ({ activePage }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-gray-800 h-screen p-4 shadow-lg fixed top-0 left-0 w-64">
      <h1 className="text-2xl font-extrabold text-green-400 mb-8">Student Dashboard</h1>
      <ul className="space-y-4">
        <li className={activePage === 'profile' ? 'text-green-400' : 'text-white'}>
          <button onClick={() => handleNavigation('/student/profile')} className="hover:text-green-400 transition-colors duration-300">
            Profile
          </button>
        </li>
        <li className={activePage === 'password' ? 'text-green-400' : 'text-white'}>
          <button onClick={() => handleNavigation('/student/profile/management')} className="hover:text-green-400 transition-colors duration-300">
            Update Password
          </button>
        </li>
        <li className={activePage === 'photo' ? 'text-green-400' : 'text-white'}>
          <button onClick={() => handleNavigation('/student/profile/management')} className="hover:text-green-400 transition-colors duration-300">
            Update Photo
          </button>
        </li>
        <li className={activePage === 'edit' ? 'text-green-400' : 'text-white'}>
          <button onClick={() => handleNavigation('/student/profile/edit')} className="hover:text-green-400 transition-colors duration-300">
            Edit Profile
          </button>
        </li>
        <li className={activePage === 'projects' ? 'text-green-400' : 'text-white'}>
          <button onClick={() => handleNavigation('/student/projects')} className="hover:text-green-400 transition-colors duration-300">
            Projects
          </button>
        </li>
        <li className="text-red-500">
          <button onClick={() => handleNavigation('/auth/login-user')} className="hover:text-red-700 transition-colors duration-300">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideNavbar;
