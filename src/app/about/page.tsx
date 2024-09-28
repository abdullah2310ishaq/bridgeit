"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaCheckCircle, FaExclamationCircle, FaUserTie, FaUserGraduate, FaCode, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";

const AboutPage: React.FC = () => {
  const [popupContent, setPopupContent] = useState<string | null>(null);

  const handlePopupOpen = (content: string) => {
    setPopupContent(content);
  };

  const handlePopupClose = () => {
    setPopupContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-screen" style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4"
          >
            Welcome to BridgeIT
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8"
          >
            Bridging the gap between academia and students through innovative collaborations and interactive learning environments.
          </motion.p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
          >
            Get in Touch
          </motion.a>
        </div>
      </section>

      {/* Mission, Vision, Offerings Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Our Mission */}
          <motion.div
            className="bg-gradient-to-br from-green-700 to-teal-600 p-6 rounded-lg shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCheckCircle className="text-4xl text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
            <p className="text-gray-300">
              To connect academia with students through faculty collaboration, fostering an environment of learning and growth.
            </p>
          </motion.div>

          {/* What We Offer */}
          <motion.div
            className="bg-gradient-to-br from-blue-700 to-purple-600 p-6 rounded-lg shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCode className="text-4xl text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">What We Offer</h3>
            <p className="text-gray-300">
              Collaborative projects, mentorship opportunities, research initiatives, and access to academic resources to support your educational journey.
            </p>
          </motion.div>

          {/* Our Vision */}
          <motion.div
            className="bg-gradient-to-br from-orange-700 to-pink-600 p-6 rounded-lg shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUserTie className="text-4xl text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Our Vision</h3>
            <p className="text-gray-300">
              To revolutionize the interaction between academia and students, creating a dynamic and impactful educational experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4">Meet Our Team</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our dedicated team of professionals is committed to bridging the gap between academia and students, ensuring a seamless and enriching experience.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Team Member 1 */}
          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/images/team1.jpg"
              alt="Team Member 1"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold">Alice Johnson</h3>
            <p className="text-gray-400">Chief Executive Officer</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaTwitter />
              </a>
            </div>
          </motion.div>

          {/* Team Member 2 */}
          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/images/team2.jpg"
              alt="Team Member 2"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold">Bob Smith</h3>
            <p className="text-gray-400">Lead Developer</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaTwitter />
              </a>
            </div>
          </motion.div>

          {/* Team Member 3 */}
          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/images/team3.jpg"
              alt="Team Member 3"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold">Carol White</h3>
            <p className="text-gray-400">Project Manager</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaTwitter />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4">What People Are Saying</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from our partners and students who have benefited from our platform.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Testimonial 1 */}
          <motion.div
            className="bg-gray-700 p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-gray-300 italic mb-4">"BridgeIT has transformed the way we collaborate with students. The projects initiated have been groundbreaking."</p>
            <div className="flex items-center">
              <FaUserGraduate className="text-green-400 mr-2" />
              <span className="text-gray-400">John Doe, Student</span>
            </div>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div
            className="bg-gray-700 p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-gray-300 italic mb-4">"The mentorship opportunities provided by BridgeIT have been invaluable to our research initiatives."</p>
            <div className="flex items-center">
              <FaUserTie className="text-green-400 mr-2" />
              <span className="text-gray-400">Dr. Jane Smith, Faculty</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4">Get in Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Whether you have questions, feedback, or partnership inquiries, we'd love to hear from you.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-green-400 text-xl" />
              <a href="mailto:contact@bridgeit.com" className="text-gray-300 hover:text-green-400">contact@bridgeit.com</a>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="text-green-400 text-xl" />
              <a href="tel:+1234567890" className="text-gray-300 hover:text-green-400">+1 (234) 567-890</a>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-400 text-xl" />
              <span className="text-gray-300">123 BridgeIT Lane, Tech City, TX 75001</span>
            </div>
            <div className="flex space-x-4 mt-4 justify-center">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaLinkedin size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <textarea
              placeholder="Your Message"
              className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              rows={5}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
            >
              Send Message
            </button>
          </form>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2024 BridgeIT. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Button for AI Help */}
      {/*
        Since the user requested to integrate everything into a single file,
        the AI Assistance page is not included here. You can add navigation
        to an AI assistance feature if needed.
      */}
      
      {/* Popup Modals (Optional) */}
      {popupContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg text-center max-w-lg mx-auto shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4">
              {popupContent === "mission" && "Our Mission"}
              {popupContent === "offerings" && "What We Offer"}
              {popupContent === "vision" && "Our Vision"}
            </h2>
            <p className="text-lg text-gray-300">
              {popupContent === "mission" &&
                "At BridgeIT, our mission is to connect academia with students through faculty collaboration, fostering an environment of learning and growth."}
              {popupContent === "offerings" &&
                "We offer collaborative projects, mentorship opportunities, research initiatives, and access to academic resources to support the educational journey."}
              {popupContent === "vision" &&
                "Our vision is to revolutionize the interaction between academia and students, creating a dynamic and impactful educational experience."}
            </p>
            <button
              onClick={handlePopupClose}
              className="mt-6 py-2 px-4 bg-gradient-to-r from-red-600 to-pink-500 hover:from-pink-500 hover:to-red-600 text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AboutPage;
