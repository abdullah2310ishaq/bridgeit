"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CreateResearchPaperPage: React.FC = () => {
  const [paperName, setPaperName] = useState('');
  const [category, setCategory] = useState('');
  const [publishChannel, setPublishChannel] = useState('');
  const [otherResearchers, setOtherResearchers] = useState('');
  const [link, setLink] = useState('');
  const [yearOfPublish, setYearOfPublish] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function authorizeUserAndFetchFacultyId() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        // Fetch authorized user info
        const userResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          // Fetch faculty details using userId
          const facultyResponse = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();
            localStorage.setItem('facultyId', facultyData.id); // Store facultyId in localStorage
          } else {
            console.error('Failed to fetch faculty details.');
            router.push('/unauthorized');
          }
        } else {
          console.error('Failed to authorize user.');
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        router.push('/unauthorized');
      }
    }

    authorizeUserAndFetchFacultyId();
  }, [router]);

  const handleCreateResearchPaper = async () => {
    const facultyId = localStorage.getItem('facultyId');
    const token = localStorage.getItem('jwtToken');

    if (!facultyId || !token) {
      console.error('Faculty ID or token is missing');
      return;
    }

    try {
      const response = await fetch('https://localhost:7053/api/ResearchWork/add-researchpaper', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperName,
          category,
          publishChannel,
          otherResearchers,
          link,
          yearOfPublish,
          facultyId, // Automatically include facultyId in the research paper creation request
        }),
      });

      if (response.ok) {
        console.log('Research paper created successfully');
        router.push('/faculty'); // Redirect back to the faculty dashboard after research paper creation
      } else {
        const errorText = await response.text();
        console.error('Failed to create research paper:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error creating research paper:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Research Paper</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Paper Name</label>
          <input
            type="text"
            value={paperName}
            onChange={(e) => setPaperName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Research Paper Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Category"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Publish Channel</label>
          <input
            type="text"
            value={publishChannel}
            onChange={(e) => setPublishChannel(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Publish Channel"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Other Researchers</label>
          <input
            type="text"
            value={otherResearchers}
            onChange={(e) => setOtherResearchers(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Other Researchers"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Publication Link"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Year of Publish</label>
          <input
            type="date"
            value={yearOfPublish}
            onChange={(e) => setYearOfPublish(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleCreateResearchPaper}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200"
        >
          Create Research Paper
        </button>
      </div>
    </div>
  );
};

export default CreateResearchPaperPage;
