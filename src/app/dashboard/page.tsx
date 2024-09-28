"use client";
import React from 'react';
import DashboardCard from './components/DashboardCard';

const DashboardHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-500 p-10 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold mb-10 text-white drop-shadow-lg">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        <DashboardCard
          title="Overview"
          description="Summary of all statistics"
          path="/dashboard/overview"
        />
        <DashboardCard
          title="Search"
          description="Find registered users"
          path="/dashboard/searchpage"
        />
        <DashboardCard
          title="Data Visualizations"
          description="Graphs and insights"
          path="/dashboard/visualizations"
        />
      </div>
    </div>
  );
};

export default DashboardHomePage;
