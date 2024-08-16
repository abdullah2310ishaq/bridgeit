"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StudentProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string; // Base64 image data
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
              skills: studentData.skills || [], // Default to empty array if undefined
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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Student Profile</h1>
      <img
        src={`data:image/jpeg;base64,${studentProfile.imageData}`}
        alt={`${studentProfile.firstName}'s profile picture`}
        className="w-40 h-40 rounded-full mb-6 shadow-lg border-4 border-white"
      />
      <p className="text-2xl font-semibold text-gray-800 mb-2">{studentProfile.firstName} {studentProfile.lastName}</p>
      <p className="text-lg text-gray-600 mb-4">{studentProfile.email}</p>
      <div className="text-lg text-gray-700 mb-4">
        <p><strong>University:</strong> {studentProfile.universityName}</p>
        <p><strong>Address:</strong> {studentProfile.address}</p>
        <p><strong>Roll Number:</strong> {studentProfile.rollNumber}</p>
        <p><strong>Skills:</strong> {studentProfile.skills.length > 0 ? studentProfile.skills.join(', ') : 'No skills available'}</p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={goBack}
          className="py-2 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-300"
        >
          Back
        </button>
        <button
          onClick={editProfile}
          className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
