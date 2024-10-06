"use client";
import React from "react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Props {
  projects: Project[];
  goToProjectsPage: () => void;
  createProjects: () => void;
}

const CompletedProjectsSection: React.FC<Props> = ({ projects, goToProjectsPage, createProjects }) => {
  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Heading Section */}
      <div className="relative max-w-7xl mx-auto mb-16 px-4 md:px-0">
        <div className="text-left">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
            Completed Projects
          </h2>
        </div>
      </div>

      {/* Project Boxes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
        {projects.length > 0 ? (
          projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              {/* Project Title */}
              <h3 className="text-2xl font-bold text-green-300 mb-4">{project.title}</h3>
              
              {/* Project Description */}
              <p className="text-gray-400 mb-4">{project.description}</p>

              {/* Additional Project Info */}
              <div className="text-left mt-4">
                <p className="text-sm text-gray-400">
                  <span className="font-bold text-gray-300">Status:</span> Completed
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-bold text-gray-300">Duration:</span> 6 months
                </p>
              </div>

              {/* Click for More Button */}
              <div className="mt-6 text-right">
                <button
                  onClick={goToProjectsPage}
                  className="text-blue-400 hover:text-blue-600 underline text-sm font-semibold transition-colors"
                >
                  Click for More
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-3">No completed projects available.</p>
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

export default CompletedProjectsSection;
