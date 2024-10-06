"use client";
import React from "react";
import { motion } from "framer-motion";

interface OngoingProject {
  id: string;
  title: string;
  description: string;
  expertName: string;
  status: string;
  endDate: string;
}

interface Props {
  ongoingProjects: OngoingProject[];
  goToProjectsPage: () => void;
  createProjects: () => void;
}

const OngoingProjectsSection: React.FC<Props> = ({ ongoingProjects, goToProjectsPage, createProjects }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="relative max-w-7xl mx-auto mb-16 px-4 md:px-0">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
          Ongoing Projects
        </h2>
      </div>

      {/* Ongoing Projects Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
        {ongoingProjects.length > 0 ? (
          ongoingProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-green-300 mb-4">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <p className="text-sm text-gray-400"><span className="font-bold">Expert:</span> {project.expertName}</p>
              <p className="text-sm text-gray-400"><span className="font-bold">Status:</span> {project.status}</p>
              <p className="text-sm text-gray-400"><span className="font-bold">End Date:</span> {project.endDate}</p>
              {/* Additional Actions or Info */}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-3">No ongoing projects available.</p>
        )}
      </div>

      {/* Buttons Below the Section */}
      <div className="mt-12 text-center space-x-6">
        <button
          onClick={goToProjectsPage}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-teal-600 transition transform hover:scale-105"
        >
          See More Projects
        </button>
        <button
          onClick={createProjects}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
        >
          Create Projects
        </button>
      </div>
    </section>
  );
};

export default OngoingProjectsSection;
