"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image'; // Next.js Image component

interface StudentProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string;
  universityName: string;
  address: string;
  rollNumber: string;
  skills: string[];
  description: string; 
  department:string;
  // Added description field
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
              department:studentData.department || "Computer Science",
              description: studentData.description || 'No description provided.', // Fetch description
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6 overflow-hidden">
      {/* Prominent Image on the Right */}
      <div className="absolute bottom-0 right-0 z-0">
        <Image
          src="/Saly-22.png"
          alt="Decorative Image"
          width={600}
          height={600}
          className="opacity-90" // Make the image slightly transparent to blend better
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -80 }} // Shifted card to left
        animate={{ opacity: 1, x: -80 }} // Keep the card moved to the left for balance
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-gray-800/60 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md h-auto lg:max-w-lg"
      >
        {/* Header with Navigation and Edit */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={goBack} className="text-gray-400 hover:text-white transition-colors duration-300">
            <FaArrowLeft size={20} />
          </button>

          {/* Gradient Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Student Profile
          </h1>

          <button onClick={editProfile} className="text-blue-500 hover:text-blue-400 transition-colors duration-300">
            <FaEdit size={20} />
          </button>
        </div>

        {/* Profile Picture and Details */}
        <div className="flex flex-col items-center lg:items-start">
          <motion.img
            src={`data:image/jpeg;base64,${studentProfile.imageData}`}
            alt={`${studentProfile.firstName}'s profile picture`}
            className="w-36 h-36 rounded-full mb-6 lg:mb-0 lg:mr-8 border-4 border-blue-500 object-cover shadow-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="flex-grow text-center lg:text-left">
            <p className="text-3xl font-semibold text-white mb-2">
              {studentProfile.firstName} {studentProfile.lastName}
            </p>
            <p className="text-gray-400 mb-4 text-lg">{studentProfile.email}</p>

            {/* Description Section */}
            <div className="mb-6">
              <p className="font-medium text-white">About Me:</p>
              <p className="text-gray-300 mt-2">{studentProfile.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-gray-300">
              <div>
                <p className="font-medium text-white">University:</p>
                <p className="text-gray-400">{studentProfile.universityName}</p>
              </div>
              <div>
                <p className="font-medium text-white">Address:</p>
                <p className="text-gray-400">{studentProfile.address}</p>
              </div>
              <div>
                <p className="font-medium text-white">Roll Number:</p>
                <p className="text-gray-400">{studentProfile.rollNumber}</p>
              </div>
              <div>
                  <p className="font-medium text-white">Department:</p>
                  <p className="text-gray-400">{studentProfile.department}</p>
                </div>

              <div>
                <p className="font-medium text-white">Skills:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {studentProfile.skills.length > 0 ? (
                    studentProfile.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-500 text-white py-1 px-3 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No skills available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons with Gradient */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={goBack}
            className="py-2 px-6 bg-gradient-to-r from-indigo-400 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={editProfile}
            className="py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm relative z-10">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
};
// nothing new

export default ProfilePage;
