"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentRegistration from './users/StudentRegistration';
import FacultyRegistration from './users/FacultyRegistration';
import RegisterExpert from './users/RegisterExpert';
import Image from 'next/image';
import Link from 'next/link';

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

  const roleButtons = [
    { role: 'Student', icon: '🎓', label: 'Student' },
    { role: 'Faculty', icon: '👨‍🏫', label: 'Faculty' },
    { role: 'IndustryExpert', icon: '💼', label: 'Expert' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl p-8 bg-gray-800 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-12">
          <Image src="/logo.jpg" alt="BridgeIT" width={80} height={80} className="mx-auto mb-6 rounded-full" />
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Join BridgeIT</h2>
          <p className="text-gray-400 mt-4 text-lg">
            Already have an account?{' '}
            <Link href="/auth/login-user" className="text-green-400 font-semibold hover:underline transition duration-300">
              Login here!
            </Link>
          </p>
        </div>

        <div className="space-y-10">
          {/* Role Selection */}
          <div>
            <h3 className="text-2xl font-semibold text-center mb-6 text-gray-300">Choose Your Role</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {roleButtons.map((button) => (
                <motion.button
                  key={button.role}
                  type="button"
                  onClick={() => setRole(button.role)}
                  className={`py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-300 ${
                    role === button.role 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  } focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-3 text-2xl">{button.icon}</span>
                  {button.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Render the form based on selected role */}
          <AnimatePresence mode="wait">
            {renderRegistrationForm() && (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-gray-700 rounded-xl shadow-inner"
              >
                {renderRegistrationForm()}
              </motion.div>
            )}
          </AnimatePresence>

          {!renderRegistrationForm() && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-center text-lg"
            >
              Please select a role to continue.
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;