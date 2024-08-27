import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center bg-white shadow p-4 rounded-lg">
      <div className="text-center">
        <div className="text-lg font-bold">Work in Progress</div>
        <div className="mt-2">
          {/* Circular progress bar can be implemented using a library or custom CSS */}
          <div className="w-16 h-16 rounded-full border-8 border-blue-500 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-700">{progress}%</span>
          </div>
        </div>
        <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-200">
          View More
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;
