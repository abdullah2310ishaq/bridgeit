"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
              toast.error('Invalid role. Please contact support.');
              break;
          }
        } else {
          toast.error('Failed to fetch user profile.');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-4xl bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden flex">
        <div className="w-1/2 p-8">
          <h2 className="text-4xl font-bold text-white mb-6">Welcome Back</h2>
          <p className="text-gray-300 mb-8">Enter your credentials to access your account</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.email}
                </p>
              )}
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.password}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <motion.button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </motion.button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-400 hover:underline">Forgot password?</a>
          </div>
          <p className="mt-8 text-center text-gray-300">
            Don't have an account?{' '}
            <a
              onClick={() => router.push('/auth/register-user')}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Sign up here
            </a>
          </p>
        </div>
        <div className="w-1/2 relative">
          <Image
            src="/heroimage.png?height=600&width=400"
            alt="Login Illustration"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />
    </div>
  );
};

export default LoginPage;