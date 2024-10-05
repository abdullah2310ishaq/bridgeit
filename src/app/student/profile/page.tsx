"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

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
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
             <div className="text-center">
               <p className="text-xl font-semibold mb-4">Loading your profile...</p>
               <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500"></div>
             </div>
           </div>;
  }

  return (
   <div className="relative min-h-screen flex flex-col items-start justify-center bg-gray-900 p-6 overflow-hidden">


      {/* Background Decorative Image */}
      <div className="absolute bottom-20 right-[200px] z-0"> 
  <Image
    src="/Saly-22.png"
    alt="Decorative Image"
    width={500} 
    height={500}
    className="opacity-80"
  />
</div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-gray-800/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md lg:max-w-2xl"
      >
      
<div className="flex justify-between items-center mb-8">
  <button onClick={goBack} className="text-gray-400 hover:text-white transition-colors duration-300">
    <FaArrowLeft size={22} />
  </button>

  <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
    Student Profile
  </h1>

  <button onClick={editProfile} className="text-blue-500 hover:text-blue-400 transition-colors duration-300">
    <FaEdit size={22} />
  </button>
</div>

{/* Profile Details Section */}
<div className="flex flex-col lg:flex-row lg:items-center lg:space-x-10 p-6 w-full max-w-4xl">
  {/* Boxed Profile Image */}
  <motion.img
    src={`data:image/jpeg;base64,${studentProfile.imageData}`}
    alt={`${studentProfile.firstName}'s profile picture`}
    className="w-48 h-48 rounded-lg object-cover shadow-xl"
    initial={{ scale: 0.9 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5 }}
  />

  <div className="flex-grow text-center lg:text-left space-y-6 mt-6 lg:mt-0">
    <p className="text-4xl font-bold text-white">
      {studentProfile.firstName} {studentProfile.lastName}
    </p>
    <p className="text-xl text-gray-400">{studentProfile.email}</p>

    {/* Profile Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
      <div>
        <p className="text-lg font-semibold text-white">University</p>
        <p className="text-gray-400">{studentProfile.universityName}</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-white">Address</p>
        <p className="text-gray-400">{studentProfile.address}</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-white">Roll Number</p>
        <p className="text-gray-400">{studentProfile.rollNumber}</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-white">Skills</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {studentProfile.skills.length > 0 ? (
            studentProfile.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 px-4 rounded-full text-sm shadow-lg"
              >
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

{/* Action Buttons */}
<div className="mt-8 flex justify-end space-x-6">
  <button
    onClick={goBack}
    className="py-3 px-8 bg-gradient-to-r from-indigo-500 to-purple-700 text-white rounded-lg hover:from-blue-500 hover:to-purple-600 transition duration-300 shadow-lg"
  >
    Back
  </button>
  <button
    onClick={editProfile}
    className="py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-800 text-white rounded-lg hover:from-blue-500 hover:to-purple-600 transition duration-300 shadow-lg"
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

export default ProfilePage;
