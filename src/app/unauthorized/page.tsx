"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/auth/login-user'); // Redirect to login page or another appropriate page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-white mb-6">Access Denied</h1>
        <p className="text-lg text-gray-300 mb-6">You do not have permission to view this page.</p>
        <button
          onClick={handleGoBack}
          className="py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
