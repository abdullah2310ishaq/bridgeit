"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, ChevronRight } from "lucide-react";
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
  const router = useRouter();

  // Handle click on a project card
  const handleCardClick = (projectId: string) => {
    router.push(`/student/projects/personal/${projectId}`); // Navigate to personal project detail route
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-900">
      <div className="max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-300">
          Completed Personal Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <motion.div
              key={project.id}
              onClick={() => handleCardClick(project.id)}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            >
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-4">
                {project.title}
              </h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="text-left mt-4 space-y-2">
                <p className="text-sm text-gray-300 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  <span className="font-bold mr-2">Status:</span> Completed
                </p>
              </div>
              <div className="mt-6 text-right">
                <button className="text-blue-400 hover:text-blue-300 flex items-center justify-end w-full transition-colors duration-300">
                  <span className="text-sm font-semibold">View Details</span>
                  <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No completed personal projects available.
          </p>
        )}
      </div>
    </section>
  );
};

export default CompletedProjectsSection;
