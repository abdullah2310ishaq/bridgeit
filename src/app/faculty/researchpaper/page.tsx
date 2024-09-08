"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ResearchPaper {
  id: string;
  paperName: string;
  category: string;
  publishChannel: string;
  link: string;
  otherResearchers: string;
  yearOfPublish: number;
}

const FacultyResearchWorkPage: React.FC = () => {
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFacultyAndResearchPapers() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        // Step 1: Fetch the user ID first
        const userResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          // Step 2: Fetch the faculty ID using the user ID
          const facultyResponse = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();
            const facultyId = facultyData.id;

            // Step 3: Fetch research papers using the faculty ID
            const researchResponse = await fetch(`https://localhost:7053/api/ResearchWork/get-researchwork-by-id/${facultyId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (researchResponse.ok) {
              const researchData = await researchResponse.json();
              setResearchPapers(researchData);
            } else {
              console.error('Failed to fetch research papers');
            }
          } else {
            console.error('Failed to fetch faculty information');
            router.push('/unauthorized');
          }
        } else {
          console.error('Failed to fetch user information');
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyAndResearchPapers();
  }, [router]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-600 p-8 flex flex-col items-center">
      <div className="bg-gray-600 p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Research Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          {researchPapers.length > 0 ? (
            researchPapers.map((paper) => (
              <div key={paper.id} className="bg-gray-200 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-bold text-blue-700 mb-2">{paper.paperName}</h3>
                <p className="text-gray-700">{paper.category}</p>
                <p className="text-gray-600 mt-2">Publish Channel: {paper.publishChannel}</p>
                <p className="text-gray-600 mt-2">Year of Publish: {paper.yearOfPublish}</p>
                <p className="text-blue-600 mt-2">
                  To view the publication: <a href={paper.link} target="_blank" rel="noopener noreferrer">Click here</a>
                </p>
                <p className="text-gray-500 mt-2">Other Researchers: {paper.otherResearchers}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No research papers available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyResearchWorkPage;
