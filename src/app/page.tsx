"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 bg-opacity-90 shadow-md fixed w-full z-50 backdrop-filter backdrop-blur-lg">
        <div className="flex items-center">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} />
          <span className="ml-3 text-2xl font-extrabold text-green-300">BridgeIT</span>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="text-lg text-gray-200 hover:text-green-300 transition-colors duration-300">
            Home
          </Link>
          <Link href="/about" className="text-lg text-gray-200 hover:text-green-300 transition-colors duration-300">
            About
          </Link>
          <Link href="/dashboard" className="text-lg text-gray-200 hover:text-green-300 transition-colors duration-300">
           Analytics
          </Link>
        </div>
        <div>
          <Link href="/auth/login-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-green-400 to-teal-500 text-gray-900 font-medium px-5 py-2 rounded-lg shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 p-8 md:p-16 pt-28">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:w-1/2"
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
            Welcome to BridgeIT!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            “Bridge the gap between academia and industry with our platform, where universities and experts connect directly with businesses.”
          </p>
          <Link href="/auth/register-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300"
            >
              <span className="mr-2">&#128274;</span> Create an Account
            </motion.button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 md:mt-0 md:w-1/2 flex justify-center"
        >
          <Image src="/heroimage.png" alt="Hero Image" width={500} height={400} className="rounded-lg shadow-lg" />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 text-center">
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg text-gray-300 max-w-4xl mx-auto mb-12"
          >
            At BridgeIT, our mission is to connect the dots between academia and industry, enabling the next generation of professionals to collaborate and innovate.
          </motion.p>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-screen-xl mx-auto text-center px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-6"
          >
            Our Impact on Society and Technology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg text-gray-300 max-w-4xl mx-auto mb-12"
          >
            BridgeIT is making waves across industries and academia, facilitating collaboration and driving innovation that positively impacts both society and the tech field. 
            Explore the projects that are changing the world!
          </motion.p>
          
          {/* Unique Button for Dashboard */}
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl active:opacity-75 outline-none duration-300 transition-all"
            >
              <span className="mr-2">&#128202;</span> View Dashboard Stats
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 5, rotateX: 5 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-xl p-10 text-center transition-all duration-300 transform hover:shadow-2xl relative"
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-400 rounded-full p-3 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 7l16 0M4 12l16 0M4 17l16 0"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-300 mb-4 mt-10">Seamless Collaboration</h3>
            <p className="text-gray-400">
              Collaborate with industry experts and academia to create impactful projects.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotateY: -5, rotateX: -5 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-xl p-10 text-center transition-all duration-300 transform hover:shadow-2xl relative"
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-400 rounded-full p-3 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 12 6 6 6 18z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-300 mb-4 mt-10">Resource Sharing</h3>
            <p className="text-gray-400">
              Access a wide range of resources to support your academic and professional growth.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 5, rotateX: -5 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-xl p-10 text-center transition-all duration-300 transform hover:shadow-2xl relative"
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-400 rounded-full p-3 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12l6-6M8 12l6 6"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-300 mb-4 mt-10">Expert Mentorship</h3>
            <p className="text-gray-400">
              Get guidance from industry experts who are leaders in their fields.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-8 px-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} />
          <span className="ml-3 text-xl font-extrabold text-green-300">BridgeIT</span>
        </div>
        <p className="text-sm">&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
}
