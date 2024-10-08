import React from 'react';

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
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-blue-600 transition transform hover:scale-105"
            >
              See More Research
            </button>
            <button
              onClick={onCreateResearchPaper}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
            >
              Create Research Paper
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
