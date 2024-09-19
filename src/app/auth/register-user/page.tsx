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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-green-400">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg">
        <div className="text-center">
          <img src="/logo.jpg" alt="BridgeIT" className="mb-8 mx-auto" />
          <h2 className="text-4xl font-extrabold mb-6 text-green-400">Sign up</h2>
          <p className="text-gray-400 mb-6">
            If you already have an account, you can{' '}
            <a href="/auth/login-user" className="text-green-600 font-semibold">Login here!</a>
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Role Select */}
          <div>
            <label className="block text-lg font-semibold text-gray-400 mb-4 text-center">Select Your Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('Student')}
                className={`py-3 rounded-lg font-semibold transition-colors duration-300 ${role === 'Student' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'} hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('Faculty')}
                className={`py-3 rounded-lg font-semibold transition-colors duration-300 ${role === 'Faculty' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'} hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setRole('IndustryExpert')}
                className={`py-3 rounded-lg font-semibold transition-colors duration-300 ${role === 'IndustryExpert' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'} hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                Industry Expert
              </button>
              <button
                type="button"
                onClick={() => setRole('University Admin')}
                className={`py-3 rounded-lg font-semibold transition-colors duration-300 ${role === 'University Admin' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'} hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500`}
              >
                University Admin
              </button>
            </div>
          </div>

          {/* Render the registration form based on selected role */}
          {renderRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
