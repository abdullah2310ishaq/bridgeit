"use client";
import React, { useState } from 'react';
import StudentRegistration from './users/StudentRegistration';
import FacultyRegistration from './users/FacultyRegistration';
import UniversityAdminRegistration from './users/UniAdmin';
import RegisterExpert from './users/RegisterExpert';

const RegistrationPage: React.FC = () => {
  const [role, setRole] = useState<string>('');

  const renderRegistrationForm = () => {
    switch (role) {
      case 'Student':
        return <StudentRegistration />;
      case 'Faculty':
        return <FacultyRegistration />;
      case 'IndustryExpert':
        return <RegisterExpert />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 space-y-12">
      {/* Main container */}
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
  <img src="/logo.jpg" alt="BridgeIT Logo" width={80} height={80} className="mr-4" />
  <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
    Join BridgeIT
  </h1>
</div>

        <div className="text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <a href="/auth/login-user" className="text-teal-400 font-semibold hover:underline">
              Login here!
            </a>
          </p>
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 mb-6 text-center">
            Choose Your Role
          </label>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => setRole('Student')}
              className={`py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg ${
                role === 'Student'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white'
              } focus:outline-none focus:ring-4 focus:ring-teal-400`}
            >
              <span className="mr-3">🎓</span> Student
            </button>

            <button
              type="button"
              onClick={() => setRole('Faculty')}
              className={`py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg ${
                role === 'Faculty'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white'
              } focus:outline-none focus:ring-4 focus:ring-teal-400`}
            >
              <span className="mr-3">👨‍🏫</span> Faculty
            </button>

            <button
              type="button"
              onClick={() => setRole('IndustryExpert')}
              className={`py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg ${
                role === 'IndustryExpert'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white'
              } focus:outline-none focus:ring-4 focus:ring-teal-400`}
            >
              <span className="mr-3">💼</span> Expert
            </button>

            {/* Uncomment when necessary */}
            <button
              type="button"
              onClick={() => setRole('UniversityAdmin')}
              className={`py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg ${
                role === 'UniversityAdmin'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white'
              } focus:outline-none focus:ring-4 focus:ring-teal-400`}
            >
              <span className="mr-3">🏢</span> Admin
            </button>
          </div>
        </div>

        {/* Form display */}
        <div className="mt-8">
          {renderRegistrationForm() ? (
            <div className="p-8 bg-gray-800 rounded-lg shadow-inner">
              {renderRegistrationForm()}
            </div>
          ) : (
            <p className="text-gray-400 text-center text-lg">Please select a role to continue.</p>
          )}
        </div>
      </div>
  );
};

export default RegistrationPage;
