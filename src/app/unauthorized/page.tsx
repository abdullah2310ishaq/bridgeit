"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/auth/login-user'); // Redirect to login page or another appropriate page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-2xl text-gray-700 mb-4">You don't have permission to access this page.</p>
        <p className="text-lg text-gray-500 mb-6">It looks like you're trying to enter a secret area!</p>
        <button
          onClick={handleGoBack}
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
