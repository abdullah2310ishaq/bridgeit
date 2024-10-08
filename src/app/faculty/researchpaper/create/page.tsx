"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaRocket, FaUsers, FaCode, FaCalendarAlt } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative overflow-hidden">
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-4xl p-8 bg-gray-800 rounded-3xl shadow-2xl relative z-10"
  >
    <div className="absolute top-4 left-4 z-10">
      <Image src="/logo.jpg" alt="BridgeIT Logo" width={100} height={100} />
    </div>
    <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
      Create New Research Paper
    </h1>
    
    <form onSubmit={handleCreateResearchPaper} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Paper Name</label>
          <input
            type="text"
            value={paperName}
            onChange={(e) => setPaperName(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Research Paper Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Category"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Publish Channel</label>
          <input
            type="text"
            value={publishChannel}
            onChange={(e) => setPublishChannel(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Publish Channel"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Other Researchers</label>
          <input
            type="text"
            value={otherResearchers}
            onChange={(e) => setOtherResearchers(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Other Researchers"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Link</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Publication Link"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Year of Publish</label>
          <input
            type="date"
            value={yearOfPublish}
            onChange={(e) => setYearOfPublish(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          Create Research Paper
        </button>
      </div>
    </form>
  </motion.div>

  {/* Decorative elements */}
  <div className="absolute top-20 right-10 text-blue-400 opacity-20">
    <FaRocket size={100} />
  </div>
  <div className="absolute bottom-20 left-10 text-purple-400 opacity-20">
    <FaCode size={100} />
  </div>
  <div className="absolute top-1/2 left-5 text-green-400 opacity-20">
    <FaUsers size={80} />
  </div>
  <div className="absolute bottom-10 right-20 text-yellow-400 opacity-20">
    <FaCalendarAlt size={80} />
  </div>

  <ToastContainer />
</div>

  );
};

export default CreateResearchPaperPage;
