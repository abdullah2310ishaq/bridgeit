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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-black flex flex-col justify-center p-8 md:p-16 text-white">
        <h1 className="text-5xl font-extrabold text-center mb-8">Welcome Back</h1>
        <motion.form 
          onSubmit={handleLogin} 
          className="space-y-6 w-full max-w-md p-8 bg-gray-800 rounded-lg border border-gray-700 shadow-lg mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <label className="block text-sm font-semibold text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div className="flex justify-center">
            <motion.button
              type="submit"
              className="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-sky-400 shadow-sky-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </div>
          <motion.p 
            className="mt-6 text-sm text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Don't have an account? 
            <a 
              onClick={() => router.push('/auth/register-user')}
              className="text-sky-400 hover:text-sky-500 cursor-pointer ml-1"
            >
              Sign up here
            </a>.
          </motion.p>
        </motion.form>
      </div>
      
      {/* Right Side - Illustration */}
      <div className="hidden md:block md:w-1/2 bg-black text-white flex items-center justify-center p-4">
        <div className="relative rounded-lg w-[90%] h-[90%] flex items-center">
          <img src="/cartoon.jpg" alt="Login Illustration" className="absolute top-0 left-0 w-full h-full object-cover rounded-lg" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
