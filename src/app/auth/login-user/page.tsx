"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://localhost:7053/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('jwtToken', token); // Save the token in localStorage

        // Fetch user profile after login
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const role = profileData.role;

          // Redirect based on role
          switch (role) {
            case 'Student':
              router.push('/student');
              break;
            case 'Faculty':
              router.push('/faculty');
              break;
            case 'IndustryExpert':
              router.push('/industryexpert');
              break;
            case 'UniversityAdmin':
              router.push('/unidmin');
              break;
            default:
              toast.error('Invalid role. Please contact support.', {
                position: 'top-center',
                autoClose: 3000,
              });
              break;
          }
        } else {
          toast.error('Failed to fetch user profile.', {
            position: 'top-center',
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Login failed. Please check your credentials.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-8">Login</h1>
      <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md">
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
