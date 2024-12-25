"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUniversity, FaPhone, FaAddressCard, FaEdit, FaEye } from 'react-icons/fa';
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
          toast.error("You are not authorized to access this page.");
          router.push('/unauthorized');
          return;
        }

        const userId = profileData.userId;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center py-4 border-b border-gray-600 mb-6">
          <h1 className="text-4xl font-bold">University Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Admin Profile Section */}
        {adminProfile ? (
          <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <img
                src={`data:image/png;base64,${adminProfile.profileImage}`}
                alt="Admin Profile"
                className="w-28 h-28 rounded-full border-4 border-gray-600 shadow-md"
              />
              <div className="ml-6">
                <h2 className="text-3xl font-bold">{adminProfile.firstName} {adminProfile.lastName}</h2>
                <p className="text-lg text-gray-300">{adminProfile.university}</p>
                <p className="text-lg text-gray-300">{adminProfile.email}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold">Office Information</h3>
                <p className="text-gray-300"><FaAddressCard className="inline mr-2" /> {adminProfile.officeAddress}</p>
                <p className="text-gray-300"><FaPhone className="inline mr-2" /> {adminProfile.contact}</p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <button
                  onClick={() => router.push('uniadmin/profile/edituniadmin')}
                  className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => router.push('uniadmin/profile')}
                  className="w-full md:w-auto bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <FaEye />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => router.push('uniadmin/fyprequests')}
                  className="w-full md:w-auto bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <FaUniversity />
                  <span>FYP</span>
                </button>
              </div>
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
