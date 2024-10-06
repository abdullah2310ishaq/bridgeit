"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Props {
  projects: Project[];
}

const CompletedProjectsSection: React.FC<Props> = ({ projects }) => {
  const router = useRouter(); // Initialize the router

  const goToProjectsPage = () => {
    router.push("/student/projects"); // Navigate to the 'view projects' page
  };

  const createProjects = () => {
    router.push("/student/projects/create"); // Navigate to the 'create projects' page
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Heading Section */}
      <div className="max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-700">
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
              className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform"
            >
              {/* Project Title */}
              <h3 className="text-2xl font-bold text-green-300 mb-4">
                {project.title}
              </h3>

              {/* Project Description */}
              <p className="text-gray-400 mb-4">{project.description}</p>

              {/* Additional Project Info */}
              <div className="text-left mt-4">
                <p className="text-sm text-gray-400">
                  <span className="font-bold">Status:</span> Completed
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-bold">Duration:</span> 6 months
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
          <p className="text-gray-500 text-center col-span-full">
            No completed projects available.
          </p>
        )}
      </div>

      {/* Buttons Below the Section */}
      <div className="mt-12 flex justify-center space-x-4">
        <button
          onClick={goToProjectsPage} // Navigate to 'view' page
          className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-full shadow-md hover:from-gray-700 hover:to-gray-800 transition-transform"
        >
          See More Projects
        </button>
        <button
          onClick={createProjects} // Navigate to 'create' page
          className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 transition-transform"
        >
          Create Projects
        </button>
      </div>
    </section>
  );
};

export default CompletedProjectsSection;
