"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  imageData: string; // Base64 image data
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-user');
  };

  const goToProfile = () => {
    router.push('/student/profile');
  };

  const ImageChange =()=>{
router.push('/student/profile/management');
  };

  const PasswordChange =()=>{
    router.push('/student/profile/management');
  };
  const goToEditProfile = () => {
    router.push('/student/profile/edit');
  };

  if (!userProfile) {
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
  <button onClick={ImageChange} className='hover:text-green-400 transition-colors duration-300'>
    Update Image
    </button>
</li>
<li>
  <button onClick={PasswordChange} className='hover:text-green-400 transition-colors duration-300'>
    Update Password
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

      {/* Profile Section */}
      <div className="relative bg-cover bg-center rounded-lg p-6" style={{ backgroundImage: `url('/studenttop.jpg')`, height: '300px' }}>
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div> {/* Overlay for contrast */}
        <div className="relative flex items-center h-full">
          <div className="mr-6">
            <img
              src={`data:image/jpeg;base64,${userProfile.imageData}`}
              alt={`${userProfile.firstName} ${userProfile.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="text-center text-white flex-grow">
            <h2 className="text-3xl font-bold mb-2">
              {userProfile.firstName} {userProfile.lastName}
            </h2>
            <p className="text-lg">Role : {userProfile.role}</p>
            <p className="text-lg">User Id : {userProfile.userId}</p>
            
            <div className="mt-4 space-x-4">
              <button
                onClick={goToEditProfile}
                className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={goToProfile}
                className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-200"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-center text-gray-500 mt-6 rounded-lg">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentPage;
