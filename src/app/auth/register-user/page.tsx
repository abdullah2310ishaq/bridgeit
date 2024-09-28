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
      // case 'University Admin':
      //   return <UniversityAdminRegistration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="BridgeIT" className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-4xl font-extrabold text-gray-800">Join BridgeIT</h2>
          <p className="text-gray-500 mt-2">
            Already have an account?{' '}
            <a href="/auth/login-user" className="text-green-600 font-semibold hover:underline">Login here!</a>
          </p>
        </div>

        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">
              Choose Your Role
            </label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setRole('Student')}
                className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors duration-300 ${
                  role === 'Student' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                <span className="mr-2">🎓</span>
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole('Faculty')}
                className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors duration-300 ${
                  role === 'Faculty' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                <span className="mr-2">👨‍🏫</span>
                Faculty
              </button>

              <button
                type="button"
                onClick={() => setRole('IndustryExpert')}
                className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors duration-300 ${
                  role === 'IndustryExpert' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                <span className="mr-2">💼</span>
                Expert
              </button>

              {/* Uncomment if needed */}
              {/* <button
                type="button"
                onClick={() => setRole('UniversityAdmin')}
                className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors duration-300 ${
                  role === 'UniversityAdmin' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-green-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                <span className="mr-2">🏢</span>
                Admin
              </button> */}
            </div>
          </div>

          {/* Render the form based on selected role */}
          <div className="mt-8">
            {renderRegistrationForm() ? (
              <div className="p-6 bg-gray-100 rounded-lg shadow-inner">
                {renderRegistrationForm()}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Please select a role to continue.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
