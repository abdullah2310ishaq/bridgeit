"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Briefcase, BookOpen, FileText, Video } from "lucide-react"
import Image from "next/image"

const EducationalResourcesSection: React.FC = () => {
  const router = useRouter()

  return (   <section className="relative rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="relative w-full md:w-2/5 h-64 md:h-auto">
          <Image
            src="https://images.pexels.com/photos/3184644/pexels-photo-3184644.jpeg"
            alt="Education background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 mix-blend-multiply" />

          {/* Overlay icon for visual interest */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
              <BookOpen className="h-12 w-12 text-white/70" />
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-3/5 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Educational Resources</h2>

          <p className="text-gray-600 mb-6">
            Share valuable materials with your students—notes, slides, articles, and more.
          </p>

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/faculty/educational-resource/add-education-source")}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium shadow-md transition-all self-start"
          >
            <Briefcase className="h-4 w-4" />
            Add New Resource
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default EducationalResourcesSection
