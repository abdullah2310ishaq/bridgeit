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
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} className="rounded-full" />
          <span className="ml-3 text-2xl font-extrabold text-green-400">BridgeIT</span>
        </motion.div>
        <div className="flex space-x-6">
          <Link href="/" className="text-lg text-gray-300 hover:text-green-400 transition-colors duration-300">
            Home
          </Link>
          <Link href="/about" className="text-lg text-gray-300 hover:text-green-400 transition-colors duration-300">
            About
          </Link>
          <Link href="/admin" className="text-lg text-gray-300 hover:text-green-400 transition-colors duration-300">
            Admin
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/auth/login-user" className="text-white bg-green-500 px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300">
            Sign In
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-green-400 mb-4">Welcome to BridgeIT</h1>
          <p className="text-lg text-gray-300 mb-6">
            Bridging the gap between academia and industry, empowering collaboration and innovation.
          </p>
          <Link href="/auth/register-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-transform duration-300 shadow-lg"
            >
              Create an Account
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center items-center mb-4">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} className="rounded-full" />
            <span className="ml-3 text-xl font-extrabold text-green-400">BridgeIT</span>
          </div>
          <p className="text-sm text-gray-500">&copy; 2024 BridgeIT. All rights reserved.</p>
        </motion.div>
      </footer>
    </div>
  );
}
