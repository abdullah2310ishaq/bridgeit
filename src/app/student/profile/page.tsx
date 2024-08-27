"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';

interface StudentProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string;
  universityName: string;
  address: string;
  rollNumber: string;
  skills: string[]; // Array to store skills
}

const ProfilePage: React.FC = () => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchStudentProfile() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/unauthorized');
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

          const studentResponse = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();

            setStudentProfile({
              userId: studentData.userId,
              firstName: studentData.firstName || 'N/A',
              lastName: studentData.lastName || 'N/A',
              email: studentData.email || 'N/A',
              imageData: studentData.imageData || '',
              universityName: studentData.universityName || 'N/A',
              address: studentData.address || 'N/A',
              rollNumber: studentData.rollNumber || 'N/A',
              skills: studentData.skills || [],
            });
          } else {
            console.error('Failed to fetch student profile:', studentResponse.statusText);
            router.push('/unauthorized');
          }
        } else {
          console.error('Failed to fetch user info:', profileResponse.statusText);
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('An error occurred while fetching the student profile:', error);
        router.push('/unauthorized');
      }
    }

    fetchStudentProfile();
  }, [router]);

  const goBack = () => {
    router.push('/student');
  };

  const editProfile = () => {
    router.push('/student/profile/edit');
  };

  if (!studentProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-4xl"
      >
        <div className="flex justify-between items-center mb-6">
          <button onClick={goBack} className="text-gray-400 hover:text-white transition-colors duration-300">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-white">Student Profile</h1>
          <button onClick={editProfile} className="text-blue-500 hover:text-blue-400 transition-colors duration-300">
            <FaEdit size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <motion.img
            src={`data:image/jpeg;base64,${studentProfile.imageData}`}
            alt={`${studentProfile.firstName}'s profile picture`}
            className="w-36 h-36 rounded-full mb-6 lg:mb-0 lg:mr-8 border-4 border-gray-700 object-cover shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="flex-grow">
            <p className="text-xl font-semibold text-white mb-2">
              {studentProfile.firstName} {studentProfile.lastName}
            </p>
            <p className="text-gray-400 mb-4">{studentProfile.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <p className="font-medium">University:</p>
                <p className="text-gray-400">{studentProfile.universityName}</p>
              </div>
              <div>
                <p className="font-medium">Address:</p>
                <p className="text-gray-400">{studentProfile.address}</p>
              </div>
              <div>
                <p className="font-medium">Roll Number:</p>
                <p className="text-gray-400">{studentProfile.rollNumber}</p>
              </div>
              <div>
                <p className="font-medium">Skills:</p>
                <p className="text-gray-400">
                  {studentProfile.skills.length > 0 ? studentProfile.skills.join(', ') : 'No skills available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={goBack}
            className="py-2 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={editProfile}
            className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </motion.div>

      <footer className="mt-12 text-gray-500 text-sm">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
