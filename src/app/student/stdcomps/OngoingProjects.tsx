"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
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

const OngoingProjectsSection: React.FC<Props> = ({ ongoingProjects }) => {
  const router = useRouter(); // Initialize the useRouter hook

  return (
    <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-700">
          Ongoing Projects
        </h2>
      </div>

      {/* Ongoing Projects Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8">
        {ongoingProjects.length > 0 ? (
          ongoingProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform"
            >
              <h3 className="text-2xl font-bold text-green-300 mb-4">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <p className="text-sm text-gray-400">
                <span className="font-bold">Expert:</span> {project.expertName}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-bold">Status:</span> {project.status}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-bold">End Date:</span> {project.endDate}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No ongoing projects available.</p>
        )}
      </div>

    </section>
  );
};

export default OngoingProjectsSection;
