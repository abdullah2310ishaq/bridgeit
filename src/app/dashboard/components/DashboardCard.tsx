"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface DashboardCardProps {
  title: string;
  description: string;
  path: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, path }) => {
  const router = useRouter();

  const navigateToPage = () => {
    router.push(path);
  };

  return (
    <div
      onClick={navigateToPage}
      className="cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-xl p-8 flex flex-col items-center justify-center hover:from-blue-100 hover:to-blue-200 hover:shadow-xl transition-all duration-300"
    >
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default DashboardCard;
