"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUniAdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    officeAddress: '',
    contact: '',
    description: '',
    profileImage: '',
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/auth/login-user'); // Redirect to login if no token
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data);
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          officeAddress: data.officeAddress || '',
          contact: data.contact || '',
          description: data.description || '',
          profileImage: data.profileImage || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
        toast.error('An error occurred while loading your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setForm({ ...form, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      // Update description and other details
      await fetch(`https://localhost:7053/api/edit-user-profile/update-user-description/${profile.userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.description),
      });

      // Update profile image
      if (form.profileImage) {
        const base64Image = form.profileImage.split(',')[1]; // Remove data:image/png;base64,
        await fetch(`https://localhost:7053/api/edit-user-profile/set-profile-image/${profile.userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(base64Image),
        });
      }

      toast.success('Profile updated successfully!');
      router.push('uniadmin/profile'); // Redirect to dashboard
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          {/* Profile Image */}
          <div className="mb-6">
            <label className="block text-gray-400">Profile Image</label>
            <input type="file" onChange={handleImageChange} className="block mt-2 text-white" />
            {form.profileImage && <img src={form.profileImage} alt="Profile" className="w-24 h-24 rounded-full mt-4" />}
          </div>

          {/* Personal Details */}
          <div className="mb-4">
            <label className="block text-gray-400">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Office Address</label>
            <input
              type="text"
              name="officeAddress"
              value={form.officeAddress}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Contact</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditUniAdminProfile;
