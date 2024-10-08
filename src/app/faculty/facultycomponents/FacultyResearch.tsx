import React from 'react';
import { CheckCircle, Clock, ChevronRight, Eye, PlusCircle } from "lucide-react"
import { motion } from "framer-motion";

interface ResearchPaper {
  id: string;
  paperName: string;
  category: string;
  publishChannel: string;
  link: string;
  otherResearchers: string;
  yearOfPublish: number;
}

interface ResearchSectionProps {
  researchPapers: ResearchPaper[];
  onSeeMoreResearch: () => void;
  onCreateResearchPaper: () => void;
}

const ResearchSection: React.FC<ResearchSectionProps> = ({
  researchPapers,
  onSeeMoreResearch,
  onCreateResearchPaper,
}) => {
  return (
    <div>
      {/* Research Work Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 p-12 rounded-lg shadow-2xl mb-12 overflow-hidden mt-16 relative">
        <div className="md:w-1/2 space-y-6 text-left text-white relative z-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Explore Cutting-Edge Research
          </h1>
          <p className="text-xl text-gray-300">
            Our dedicated faculty members contribute groundbreaking research across various fields. Dive
            into the innovation that's shaping the future.
          </p>
          <div className="flex space-x-6 mt-8">
            <button
              onClick={onSeeMoreResearch}
              className="group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <Eye className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
          See More Projects
        </span>
      </button>
            <button
              onClick={onCreateResearchPaper}
              className="group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <span className="flex items-center justify-center">
                  <Eye className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                  See More Projects
                </span>
              </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0 relative z-10">
          <img
            src="/Research-Work.png"
            alt="Research Work"
            className="w-full max-w-lg object-cover rounded-lg shadow-2xl transform hover:scale-105 transition"
          />
        </div>
      </div>

      {/* Research Papers Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
        {researchPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <h3 className="text-2xl font-semibold text-green-400">{paper.paperName}</h3>
            <p className="text-gray-400 mt-4">Published in: {paper.publishChannel}</p>
            <p className="text-gray-500 mt-2">Year: {paper.yearOfPublish}</p>
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 mt-6 inline-block font-semibold hover:text-blue-500"
            >
              Read Full Paper
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchSection;
