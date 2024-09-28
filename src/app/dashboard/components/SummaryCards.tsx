"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface SummaryCardProps {
  title: string;
  count: number;
  description: string;
  isLoading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, description, isLoading }) => {
  return (
    <motion.div
      className="bg-white shadow-sm rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-md duration-300"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center p-6">
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full shadow-md">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-2">
              {/* Tailwind CSS Circular Progress Indicator */}
              <div className="w-12 h-12 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
              <p className="text-3xl font-bold text-gray-800 mb-1">{count}</p>
              <p className="text-gray-500 text-sm">{description}</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
