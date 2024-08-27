"use client";
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

interface ResearchWorkProps {
  papers: ResearchPaper[];
}

const ResearchWork: React.FC<ResearchWorkProps> = ({ papers }) => {
  return (
    <div className="bg-white p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Research Work</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {papers.length > 0 ? (
          papers.map((paper) => (
            <div key={paper.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{paper.paperName}</h3>
              <p className="text-gray-700">{paper.category}</p>
              <p className="text-gray-600 mt-2">Publish Channel: {paper.publishChannel}</p>
              <p className="text-gray-600 mt-2">Year of Publish: {paper.yearOfPublish}</p>
              <p className="text-blue-600 mt-2">
                <a href={paper.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  View Publication
                </a>
              </p>
              <p className="text-gray-500 mt-2">Other Researchers: {paper.otherResearchers}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No research papers available.</p>
        )}
      </div>
    </div>
  );
};

export default ResearchWork;
