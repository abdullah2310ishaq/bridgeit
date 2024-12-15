"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUniversity, FaPhone, FaAddressCard } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  officeAddress: string;
  contact: string;
  university: string;
  profileImage: string;
}

const UniAdminDashboard: React.FC = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      router.push('/auth/login-user'); // Redirect to login if no token
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        // Fetch the authorized user's information
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch authorized user info');
        }

        const profileData = await profileResponse.json();
        const role = profileData.role;

        if (role !== 'UniversityAdmin') {
          // If the user is not a University Admin, redirect them to unauthorized page
          toast.error("You are not authorized to access this page.");
          router.push('/unauthorized');
          return;
        }

        const userId = profileData.userId;

        // Fetch University Admin Profile
        const adminResponse = await fetch(`https://localhost:7053/api/get-uni-admins/admins-by-id/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!adminResponse.ok) throw new Error('Failed to fetch University Admin profile');
        
        const adminData = await adminResponse.json();
        setAdminProfile({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          officeAddress: adminData.officeAddress,
          contact: adminData.contact,
          university: adminData.university,
          profileImage: adminData.profileImage,
        });

      } catch (error) {
        setError('Failed to load profile');
        toast.error("An error occurred while fetching the admin profile.");
        console.error('Error fetching data:', error);
        router.push('/unauthorized'); // Redirect if any error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-uniadmin'); // Redirect to login
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">University Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Admin Profile Section */}
        {adminProfile ? (
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <img
                src={`data:image/png;base64,${adminProfile.profileImage}`}
                alt="Admin Profile"
                className="w-24 h-24 rounded-full mr-4"
              />
              <div>
                <h2 className="text-2xl font-semibold">{adminProfile.firstName} {adminProfile.lastName}</h2>
                <p className="text-gray-400">{adminProfile.university}</p>
                <p className="text-gray-400">{adminProfile.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Office Information</h3>
              <p className="text-gray-400"><FaAddressCard className="inline mr-2" /> {adminProfile.officeAddress}</p>
              <p className="text-gray-400"><FaPhone className="inline mr-2" /> {adminProfile.contact}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 mt-4">No profile found</p>
        )}

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default UniAdminDashboard;
