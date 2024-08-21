
"use client";
import React from "react";

interface CardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, buttonLabel, onClick }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="mt-auto py-2 px-4 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default Card;
