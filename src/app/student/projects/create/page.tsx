"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaRocket, FaUsers, FaCode, FaCalendarAlt } from 'react-icons/fa';

const CreateProjectPage: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTeam, setProjectTeam] = useState(0);
  const [projectStack, setProjectStack] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function authorizeUserAndFetchStudentId() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        const userResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          const studentResponse = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            setStudentId(studentData.id);
          } else {
            console.error('Failed to fetch student details.');
            router.push('/unauthorized');
          }
        } else {
          console.error('Failed to authorize user.');
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    }

    authorizeUserAndFetchStudentId();
  }, [router]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      toast.error('Failed to create project. Student ID is missing.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://localhost:7053/api/projects/student-add-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          team: projectTeam,
          stack: projectStack,
          currentStatus: projectStatus,
          startDate: projectStartDate,
          endDate: projectEndDate,
          studentId: studentId,
        }),
      });

      if (response.ok) {
        toast.success('Project created successfully!', {
          position: 'top-center',
          autoClose: 3000,
        });
        router.push('/student');
      } else {
        toast.error('Failed to create project.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred while creating the project.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Loading...
        </div>
      </div>
    );
  }

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
          Create Your Project
        </h1>
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Technology Stack</label>
              <input
                type="text"
                value={projectStack}
                onChange={(e) => setProjectStack(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Team Size</label>
              <input
                type="number"
                value={projectTeam}
                onChange={(e) => setProjectTeam(Number(e.target.value))}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={projectEndDate}
                onChange={(e) => setProjectEndDate(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Current Status</label>
            <input
              type="text"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Launch Project
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

export default CreateProjectPage;