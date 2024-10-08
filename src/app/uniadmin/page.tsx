"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const UniversityAdminPage: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://localhost:7053/api/user-profile/authorized-user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
        setRole(data.role);
      } else {
        router.push('/auth/login');
      }
    }

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">University Admin Dashboard</h1>
        <p>User ID: {userId}</p>
        <p>Role: {role}</p>
        <button
          onClick={handleLogout}
          className="mt-4 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UniversityAdminPage;
