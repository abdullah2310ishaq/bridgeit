"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  profileImage: string;
  university: string;
  officeAddress: string;
  contact: string;
}

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      router.push('/auth/login-user'); // Redirect to login if no token
      return;
    }

    const fetchUserProfile = async () => {
      try {
        // Fetch user information
        const response = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const userData = await response.json();
        const userId = userData.userId;

        // Fetch admin profile using userId
        const adminResponse = await fetch(`https://localhost:7053/api/get-uni-admins/admins-by-id/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!adminResponse.ok) throw new Error('Failed to fetch University Admin profile');

        const adminData = await adminResponse.json();

        // Set profile data
        setProfile({
          id: adminData.userId,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          description: adminData.description || 'No description provided.',
          profileImage: adminData.profileImage || '',
          university: adminData.university || 'No university specified.',
          officeAddress: adminData.officeAddress || 'No office address provided.',
          contact: adminData.contact || 'No contact provided.',
        });
      } catch (err) {
        setError('Failed to load profile.');
        toast.error('An error occurred while fetching your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">University Admin Profile</h1>
        {profile ? (
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <img
                src={`data:image/png;base64,${profile.profileImage}`}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-gray-600 shadow-md mr-6"
              />
              <div>
                <h2 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-lg text-gray-300"><FaEnvelope className="inline mr-2" /> {profile.email}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <FaBuilding className="text-blue-500 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">University</h3>
                  <p className="text-gray-300">{profile.university}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-green-500 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Office Address</h3>
                  <p className="text-gray-300">{profile.officeAddress}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-purple-500 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Contact</h3>
                  <p className="text-gray-300">{profile.contact}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaUser className="text-pink-500 mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">About Me</h3>
                  <p className="text-gray-300">{profile.description}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push(`/profile/edit`)}
              className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 flex items-center"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </div>
        ) : (
          <p className="text-center text-red-500 mt-4">No profile found</p>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserProfilePage;
