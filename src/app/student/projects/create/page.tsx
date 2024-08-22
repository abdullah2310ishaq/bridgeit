"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        // First, authorize the user
        const userResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          // Fetch the student details using the userId
          const studentResponse = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            setStudentId(studentData.id); // Store the studentId in state
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
          studentId: studentId, // Use the stored studentId here
        }),
      });

      if (response.ok) {
        toast.success('Project created successfully!', {
          position: 'top-center',
          autoClose: 3000,
        });
        router.push('/student/projects');
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
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-gray-200 p-6">
      <div className="w-full max-w-lg p-8 bg-gray-700 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-6">Create Project</h1>
        <form onSubmit={handleCreateProject} className="space-y-6">
          {/* Form fields for project details */}
          <div>
            <label className="block text-sm font-semibold text-gray-300">Project Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">Team Size</label>
            <input
              type="number"
              value={projectTeam}
              onChange={(e) => setProjectTeam(Number(e.target.value))}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">Technology Stack</label>
            <input
              type="text"
              value={projectStack}
              onChange={(e) => setProjectStack(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">Current Status</label>
            <input
              type="text"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">Start Date</label>
            <input
              type="date"
              value={projectStartDate}
              onChange={(e) => setProjectStartDate(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">End Date</label>
            <input
              type="date"
              value={projectEndDate}
              onChange={(e) => setProjectEndDate(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateProjectPage;
