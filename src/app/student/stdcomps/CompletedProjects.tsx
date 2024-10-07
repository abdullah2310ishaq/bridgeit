"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { CheckCircle, Clock, ChevronRight, Eye, PlusCircle } from "lucide-react"
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Props {
  projects: Project[]; // Only passing projects as a prop
}

const CompletedProjectsSection: React.FC<Props> = ({ projects }) => {
  const router = useRouter(); // Initialize the router

  // Navigation handlers directly inside the component
  const goToProjectsPage = () => {
    router.push("/student/projects"); // Navigate to the 'view projects' page
  };

  const createProjects = () => {
    router.push("/student/projects/create"); // Navigate to the 'create projects' page
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-900">
      {/* Heading Section */}
      <div className="max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-300" style={{ padding: '0.6rem 0',marginLeft: '-7rem' }}>
          Completed Projects
        </h2>
      </div>

      {/* Project Boxes Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8">
      {projects.length > 0 ? (
        projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300  flex flex-col"
          >
            {/* Project Title */}
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-4">
              {project.title}
            </h3>

            {/* Project Description */}
            <p className="text-gray-300 mb-4">{project.description}</p>

            {/* Additional Project Info */}
            <div className="text-left mt-4 space-y-2">
              <p className="text-sm text-gray-300 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <span className="font-bold mr-2">Status:</span> Completed
              </p>
              <p className="text-sm text-gray-300 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span className="font-bold mr-2">Duration:</span> 6 months
              </p>
            </div>

            {/* Click for More Button */}
            <div className="mt-6 text-right">
              <button
                onClick={goToProjectsPage}
                className="text-blue-400 hover:text-blue-300 flex items-center justify-end w-full transition-colors duration-300"
              >
                <span className="text-sm font-semibold">Click for More</span>
                <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            </div>
          </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No completed projects available.
          </p>
        )}
      </div>

      {/* Buttons Below the Section */}
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
      <button
        onClick={goToProjectsPage}
        className="group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <Eye className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
          See More Projects
        </span>
      </button>
      <button
        onClick={createProjects}
        className="group px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-full shadow-lg hover:shadow-gray-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <PlusCircle className="w-5 h-5 mr-2 transform group-hover:rotate-90 transition-transform duration-300" />
          Create Projects
        </span>
      </button>
    </div>
    </section>
  );
};

export default CompletedProjectsSection;
