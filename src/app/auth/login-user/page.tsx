"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBriefcase,
  FaUniversity,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const response = await fetch("https://localhost:7053/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("jwtToken", token);

        try {
          const profileResponse = await fetch(
            "https://localhost:7053/api/auth/authorized-user-info",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const role = profileData.role;

            switch (role) {
              case "Student":
                router.push("/student");
                break;
              case "Faculty":
                router.push("/faculty");
                break;
              case "IndustryExpert":
                router.push("/industryexpert");
                break;
              case "UniversityAdmin":
                router.push("/uniadmin");
                break;
              default:
                toast.error("Invalid role. Please contact support.");
                break;
            }
          } else {
            toast.error("Failed to fetch user profile.");
          }
        } catch (error) {
          toast.error("An error occurred while fetching user profile.");
        }
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      toast.error("Login Failed. Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white p-8">
      {/* Left Side - Hero Image and Description */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: -50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Image
            src="/heroimage.png"
            alt="Hero Image"
            width={500}
            height={500}
            className="rounded-lg mb-6"
          />
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 flex items-center justify-center"
        >
          <Image
            src="/logo.jpg"
            alt="BridgeIT Logo"
            width={60}
            height={60}
            className="mr-4 "
          />
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Welcome Back
          </h1>
        </motion.div>
        <motion.form
          onSubmit={handleLogin}
          className="space-y-6 w-full max-w-md mx-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pl-12 pr-12 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Password"
              required
            />
            <div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
          <motion.p
            className="mt-6 text-sm text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Forgot Password?
            <a
              onClick={() => router.push('/auth/forgotpassword')}
              className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1 transition duration-300"
            >
              Click Here
            </a>
          </motion.p>
          <motion.p
            className="mt-6 text-sm text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Dont have an account?
            <a
              onClick={() => router.push('/auth/register-user')}
              className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1 transition duration-300"
            >
              Sign up here
            </a>
          </motion.p>
          <motion.div
            className="flex justify-center space-x-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-col items-center">
              <FaUserGraduate className="text-3xl text-blue-400 mb-2" />
            </div>
            <div className="flex flex-col items-center">
              <FaChalkboardTeacher className="text-3xl text-purple-400 mb-2" />
            </div>
            <div className="flex flex-col items-center">
              <FaBriefcase className="text-3xl text-green-400 mb-2" />
            </div>
            <div className="flex flex-col items-center">
              <FaUniversity className="text-3xl text-yellow-400 mb-2" />
            </div>
          </motion.div>
        </motion.form>
        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
