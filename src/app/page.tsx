"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-blue-700 shadow-md">
        <div className="flex items-center">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} />
          <span className="ml-3 text-2xl font-extrabold text-white">BridgeIT</span>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="text-lg text-white hover:text-gray-300 transition-colors duration-300">
            Home
          </Link>
          <Link href="/about" className="text-lg text-white hover:text-gray-300 transition-colors duration-300">
            About
          </Link>
        </div>
        <div>
          <Link href="/auth/login-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
            >
              <span className="bg-slate-400 shadow-slate-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Sign In
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:w-1/2"
        >
          <h1 className="text-5xl font-extrabold text-blue-700 mb-4">Welcome to BridgeIT!</h1>
          <p className="text-lg text-gray-700 mb-6">
            “Bridge the gap between academia and industry with our platform, where universities and experts connect directly with businesses.”
          </p>
          <Link href="/auth/register-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-6 py-3 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
            >
              <span className="bg-slate-400 shadow-slate-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
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
          <Image src="/homepage.jpg" alt="Hero Image" width={400} height={300} />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-gray-700">
            At BridgeIT, our mission is to connect the dots between academia and industry, enabling the next generation of professionals to collaborate and innovate.
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Seamless Collaboration</h3>
            <p className="text-gray-600">
              Collaborate with industry experts and academia to create impactful projects.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Resource Sharing</h3>
            <p className="text-gray-600">
              Access a wide range of resources to support your academic and professional growth.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Expert Mentorship</h3>
            <p className="text-gray-600">
              Get guidance from industry experts who are leaders in their fields.
            </p>
          </div>
        </div> 
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 px-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} />
          <span className="ml-3 text-xl font-extrabold">BridgeIT</span>
        </div>
        <p className="text-sm">&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
}
