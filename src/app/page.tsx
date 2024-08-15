"use client";
import Link from 'next/link';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Welcome to BridgeIt</h1>
        <p className="text-lg text-gray-600 mb-8">
          Connecting Academia and Industry. Please choose an option below to get started.
        </p>
        <div className="space-x-4">
          <Link href="/auth/login-user">
            <span className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer">
              Sign In
            </span>
          </Link>
          <Link href="/auth/register-user">
            <span className="inline-block bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 cursor-pointer">
              Sign Up
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
