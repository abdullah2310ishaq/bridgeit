"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  imageData: string; // Base64 image data
}

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  status: string;
  studentName: string;
  indExpertName: string;
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;
          const role = profileData.role;

          const studentResponse = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            setUserProfile({
              userId: studentData.userId,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              role: role,
              imageData: studentData.imageData,
            });
          } else {
            console.error('Failed to fetch student profile:', studentResponse.statusText);
            router.push('/unauthorized');
          }
        } else {
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        router.push('/unauthorized');
      }
    }

    async function fetchProjects() {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch('https://localhost:7053/api/projects/get-all-projects', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.slice(0, 2)); // Display only the first two projects on the homepage
        } else {
          console.error('Failed to load projects.');
        }
      } catch (error) {
        console.error('An error occurred while fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
    fetchProjects();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-user');
  };

  const goToProfile = () => {
    router.push('/student/profile');
  };

  const goToEditProfile = () => {
    router.push('/student/profile/edit');
  };

  const gotoProjects = () => {
    router.push('/projects');
  };

  const goToCreateProject = () => {
    router.push('/projects/create');
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 p-6">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 shadow-lg rounded-lg mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-green-400">Student Dashboard</h1>
          <ul className="flex space-x-6">
            <li>
              <button onClick={goToProfile} className="hover:text-green-400 transition-colors duration-300">
                Profile
              </button>
            </li>
            <li>
              <button onClick={goToEditProfile} className="hover:text-green-400 transition-colors duration-300">
                Edit Profile
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:text-red-500 transition-colors duration-300">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2"
        >
          <h2 className="text-2xl font-semibold mb-4">Available Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-700 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-2">{project.description}</p>
                <p className="text-gray-500"><strong>Stack:</strong> {project.stack}</p>
                <p className="text-gray-500"><strong>Status:</strong> {project.status}</p>
                <p className="text-gray-500"><strong>Student:</strong> {project.studentName}</p>
                <p className="text-gray-500"><strong>Industry Expert:</strong> {project.indExpertName}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={gotoProjects}
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
            >
              See More Projects
            </button>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <div className="flex items-center mb-4">
            {userProfile?.imageData && (
              <img
                src={`data:image/jpeg;base64,${userProfile.imageData}`}
                alt={`${userProfile?.firstName}'s profile picture`}
                className="w-16 h-16 rounded-full object-cover border-4 border-gray-700 mr-4"
              />
            )}
            <div>
              <p className="mb-2"><strong>Name:</strong> {userProfile?.firstName} {userProfile?.lastName}</p>
              <p className="mb-2"><strong>Role:</strong> {userProfile?.role}</p>
              <p className="mb-4"><strong>User ID:</strong> {userProfile?.userId}</p>
            </div>
          </div>
          <button
            onClick={goToEditProfile}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 mb-4"
          >
            Edit Profile
          </button>
          <button
            onClick={goToProfile}
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            View Profile
          </button>
        </motion.div>
      </div>

      {/* Create Project Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={goToCreateProject}
          className="py-3 px-6 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
        >
          Create New Project
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-center text-gray-500 mt-6 rounded-lg">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentPage;
