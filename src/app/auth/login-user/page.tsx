"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import {
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBriefcase,
  FaUniversity,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import Image from "next/image"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch("https://localhost:7053/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.token
        localStorage.setItem("jwtToken", token)

        try {
          const profileResponse = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            const role = profileData.role

            switch (role) {
              case "Student":
                router.push("/student")
                break
              case "Faculty":
                router.push("/faculty")
                break
              case "IndustryExpert":
                router.push("/industryexpert")
                break
              case "UniversityAdmin":
                router.push("/uniadmin")
                break
              default:
                toast.error("Invalid role. Please contact support.")
                break
            }
          } else {
            toast.error("Failed to fetch user profile.")
          }
        } catch (error) {
          toast.error("An error occurred while fetching user profile.")
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      toast.error("Login Failed. Please check your credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white text-gray-800 p-4 md:p-8">
      {/* Left Side - Hero Image and Description */}
      <div className="hidden md:flex md:w-1/2 p-4 md:p-8 flex-col justify-center items-center bg-blue-50 rounded-l-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 relative"
        >
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-50"></div>
          <Image
            src="/heroimage.png"
            alt="Hero Image"
            width={500}
            height={500}
            className="rounded-2xl mb-6 shadow-xl relative z-10"
          />
          <h2 className="text-2xl font-bold text-blue-600 mt-6">Connect, Collaborate, Create</h2>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Join our platform to bridge the gap between academia and industry. Discover opportunities and build your
            future.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center bg-white rounded-r-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 flex items-center justify-center"
        >
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={60} height={60} className="mr-4 rounded-full shadow-md" />
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
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
            <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-12 bg-white text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 shadow-sm"
              placeholder="Email"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pl-12 pr-12 bg-white text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 shadow-sm"
              placeholder="Password"
              required
            />
            <div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-400 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:shadow-lg transition duration-300 relative overflow-hidden group"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            {loading ? "Logging in..." : "Login"}
          </motion.button>
          <motion.button
            type="button"
            className="w-full bg-white text-blue-500 font-bold py-4 px-4 rounded-xl border border-blue-400 hover:bg-blue-50 transition duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Login with Google
          </motion.button>
          <div className="flex items-center justify-between mt-4">
            <motion.p
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <a
                onClick={() => router.push("/auth/forgotpassword")}
                className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300"
              >
                Forgot Password?
              </a>
            </motion.p>
            <motion.p
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <a
                onClick={() => router.push("/auth/register-user")}
                className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300"
              >
                Sign up here
              </a>
            </motion.p>
          </div>
          <motion.div
            className="flex justify-center space-x-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col items-center group">
              <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                <FaUserGraduate className="text-2xl text-blue-500" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Students</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                <FaChalkboardTeacher className="text-2xl text-blue-500" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Faculty</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                <FaBriefcase className="text-2xl text-blue-500" />
              </div>
              <span className="text-xs mt-2 text-gray-600">Industry</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                <FaUniversity className="text-2xl text-blue-500" />
              </div>
              <span className="text-xs mt-2 text-gray-600">University</span>
            </div>
          </motion.div>
        </motion.form>
        {/* Toast Container */}
        <ToastContainer position="bottom-right" theme="colored" />
      </div>
    </div>
  )
}

export default LoginPage

