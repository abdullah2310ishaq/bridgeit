"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

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
        localStorage.setItem('jwtToken', token);

        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const role = profileData.role;

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
      <h1 className="text-5xl font-extrabold text-center mb-8">Welcome Back</h1>
      <motion.form 
        onSubmit={handleLogin} 
        className="space-y-6 w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
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
        <div className="flex flex-col items-center">
          <motion.button
            type="submit"
            className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'loop' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
          <motion.p 
            className="mt-6 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Don't have an account? 
            <a 
              onClick={() => router.push('/auth/register-user')}
              className="text-green-400 hover:text-green-500 cursor-pointer ml-1"
            >
              Sign up here
            </a>.
          </motion.p>
        </div>
      </motion.form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
