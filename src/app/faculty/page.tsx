"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FacultyProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
}

const FacultyPage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(null);
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

          const facultyResponse = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();
            setFacultyProfile({
              userId: facultyData.userId,
              firstName: facultyData.firstName,
              lastName: facultyData.lastName,
              role: role,
            });
          } else {
            console.error('Failed to fetch faculty profile:', facultyResponse.statusText);
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

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-user');
  };

  const goToProfile = () => {
    router.push('/faculty/profile');
  };

  const goToChangePassword = () => {
    router.push('/faculty/profile/managefaculty');
  };

  const goToUpdatePhoto = () => {
    router.push('/faculty/profile/managefaculty');
  };

  const goToEditProfile = () => {
    router.push('/faculty/profile/editfaculty');
  };

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-800 text-gray-200">
      {/* Navbar */}
      <nav className="bg-gray-700 text-gray-100 w-full p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Faculty Dashboard</h1>
          <ul className="flex space-x-6">
            <li>
              <button onClick={goToProfile} className="hover:text-gray-400">
                Profile
              </button>
            </li>
            <li>
              <button onClick={goToChangePassword} className="hover:text-gray-400">
                Update Password
              </button>
            </li>
            <li>
              <button onClick={goToUpdatePhoto} className="hover:text-gray-400">
                Update Photo
              </button>
            </li>
            <li>
              <button onClick={goToEditProfile} className="hover:text-gray-400">
                Edit Profile
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:text-gray-400">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {facultyProfile.firstName} {facultyProfile.lastName}
        </h1>
        <p className="text-lg mb-4">Role: {facultyProfile.role}</p>
        <p className="text-lg mb-6">User ID: {facultyProfile.userId}</p>
        
        <div className="flex flex-col space-y-4 w-full max-w-xs">
          <button
            onClick={goToProfile}
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
          >
            View Profile
          </button>
          <button
            onClick={goToChangePassword}
            className="w-full py-3 px-6 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Update Password
          </button>
          <button
            onClick={goToUpdatePhoto}
            className="w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
            Update Photo
          </button>
          <button
            onClick={goToEditProfile}
            className="w-full py-3 px-6 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
