"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const AboutPage: React.FC = () => {
  const [popupContent, setPopupContent] = useState<string | null>(null);

  const handlePopupOpen = (content: string) => {
    setPopupContent(content);
  };

  const handlePopupClose = () => {
    setPopupContent(null);
  };

  return (
<div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200 flex flex-col items-center justify-center relative">
      <div className="text-center py-16">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-8"
        >
          Welcome to BridgeIT
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl leading-8 text-gray-300 max-w-4xl mx-auto mb-12"
        >
          BridgeIT is an innovative platform connecting academia with university
          students through faculty engagement. Our mission is to foster
          collaboration, enhance learning experiences, and bridge the gap
          between academic institutions and students by creating a seamless,
          interactive environment.
        </motion.p>
      </div>

      <div className="flex justify-center space-x-8 mb-16">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-teal-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 ease-in-out"
          onClick={() => handlePopupOpen("mission")}
        >
          Our Mission
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 ease-in-out"
          onClick={() => handlePopupOpen("offerings")}
        >
          What We Offer
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-red-600 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 ease-in-out"
          onClick={() => handlePopupOpen("vision")}
        >
          Our Vision
        </motion.button>
      </div>

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

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-10 text-center"
      >
        <p className="text-gray-400">© 2024 BridgeIT. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default AboutPage;
