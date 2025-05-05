"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import { Book, BookOpen, Lightbulb, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from "framer-motion"

interface EducationalResourcesCardProps {
  goToEducationalResources: () => void
}

const EducationalResourcesCard: React.FC<EducationalResourcesCardProps> = ({ goToEducationalResources }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Replace the resourceImages array with Pexels images related to education and books
  const resourceImages = [
    "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1329571/pexels-photo-1329571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  ]

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % resourceImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [resourceImages.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <Image
              src={resourceImages[currentImageIndex] || "/placeholder.svg"}
              alt="Educational Resources"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-transparent"></div>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {resourceImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex items-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Educational Resources</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Access a comprehensive collection of learning materials, research papers, and academic resources curated
              by top faculty members and universities.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <BookOpen className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span className="text-sm text-gray-700">Research Papers</span>
              </div>
              <div className="flex items-start">
                <Book className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span className="text-sm text-gray-700">Study Materials</span>
              </div>
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span className="text-sm text-gray-700">Learning Guides</span>
              </div>
              <div className="flex items-start">
                <Sparkles className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span className="text-sm text-gray-700">Expert Insights</span>
              </div>
            </div>

            <motion.button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={goToEducationalResources}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg flex items-center justify-center group transition-all duration-300 hover:shadow-lg"
            >
              <span>Explore Resources</span>
              <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.3 }}>
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EducationalResourcesCard
