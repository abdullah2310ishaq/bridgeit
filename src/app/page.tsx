"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center"
        >
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={70} height={70} className="rounded-full" />
          <span className="ml-3 text-4xl font-extrabold text-green-400">BridgeIT</span>
        </motion.div>
        <div className="flex space-x-8">
          <Link href="/" className="text-lg font-medium text-gray-300 hover:text-green-400 transition-colors duration-300">
            Home
          </Link>
          <Link href="/about" className="text-lg font-medium text-gray-300 hover:text-green-400 transition-colors duration-300">
            About
          </Link>
          <Link href="/admin" className="text-lg font-medium text-gray-300 hover:text-green-400 transition-colors duration-300">
            Admin
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex space-x-4 items-center"
        >
          <Link href="/auth/login-user" className="text-white bg-green-500 px-5 py-2 rounded-full hover:bg-green-600 transition-colors duration-300">
            Sign In
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:w-1/2"
        >
          <h1 className="text-6xl font-extrabold text-green-400 mb-4">Welcome to BridgeIT!</h1>
          <p className="text-xl text-gray-300">
            Bridging the gap between academia and industry, empowering collaboration between universities, experts, and businesses.
          </p>
          <Link href="/auth/register-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-8 bg-green-500 text-white px-8 py-3 rounded-full flex items-center hover:bg-green-600 transition-transform duration-300 shadow-lg"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 20v-6m0-4v-6M8 4h8M5 10h14m-9 5a3 3 0 106 0 3 3 0 10-6 0"></path>
              </svg>
              Create an Account
            </motion.button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="md:w-1/2 mt-12 md:mt-0 flex justify-center"
        >
          <Image src="/homepage.jpg" alt="Illustration" width={600} height={600} className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300" />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-800 py-20 px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-extrabold text-green-400 mb-4"
        >
          Our Mission
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          At BridgeIT, we strive to connect the dots between academia and industry, enabling the next generation of professionals to collaborate and innovate.
        </motion.p>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 py-20 px-8 text-center">
        <h2 className="text-5xl font-extrabold text-green-400 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-10 rounded-lg shadow-lg transform transition-transform duration-300"
          >
            <h3 className="text-3xl font-bold text-green-400">Seamless Collaboration</h3>
            <p className="text-lg text-gray-300 mt-4">Collaborate with industry experts and academia to create impactful projects.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-10 rounded-lg shadow-lg transform transition-transform duration-300"
          >
            <h3 className="text-3xl font-bold text-green-400">Resource Sharing</h3>
            <p className="text-lg text-gray-300 mt-4">Access a wide range of resources to support your academic and professional growth.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-10 rounded-lg shadow-lg transform transition-transform duration-300"
          >
            <h3 className="text-3xl font-bold text-green-400">Expert Mentorship</h3>
            <p className="text-lg text-gray-300 mt-4">Get guidance from industry experts who are leaders in their fields.</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 py-20 px-8 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-extrabold mb-4"
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl mb-8"
        >
          Join BridgeIT today and start collaborating with the best minds in the industry.
        </motion.p>
        <Link href="/auth/register-user">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white text-green-600 px-8 py-3 rounded-full hover:bg-gray-200 transition-transform duration-300 transform shadow-lg"
          >
            Sign Up Now
          </motion.button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={60} height={60} className="rounded-full" />
            <span className="ml-3 text-2xl font-extrabold text-green-400">BridgeIT</span>
          </div>
          <div className="space-x-8">
            <Link href="/" className="hover:text-green-400 transition-colors duration-300">Home</Link>
            <Link href="/about" className="hover:text-green-400 transition-colors duration-300">About</Link>
            <Link href="/contact" className="hover:text-green-400 transition-colors duration-300">Contact</Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center text-gray-500"
        >
          &copy; 2024 BridgeIT. All rights reserved.
        </motion.div>
      </footer>
    </div>
  );
}
