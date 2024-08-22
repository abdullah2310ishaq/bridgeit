"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/auth/login-user');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200">
      <motion.div
        className="text-center p-12 rounded-xl shadow-lg bg-gray-800/50 border border-gray-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.h1
          className="text-6xl font-extrabold text-red-400 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Access Denied
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          You need to log in to access this page.
        </motion.p>
        <motion.button
          onClick={handleGoBack}
          className="py-3 px-8 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Login
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
