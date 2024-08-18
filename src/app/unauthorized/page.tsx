"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/auth/login-user');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="text-center border-4 border-red-500 p-8 rounded-xl">
        <h1 className="text-6xl font-extrabold text-red-400 mb-4">Access Denied</h1>
        <p className="text-2xl mb-4">Please log in to access your profile.</p>
       
        <button
          onClick={handleGoBack}
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
