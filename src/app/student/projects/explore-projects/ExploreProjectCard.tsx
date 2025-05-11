"use client"

import type React from "react"
import { motion } from "framer-motion"
import { FaUserGraduate, FaStar, FaFire } from "react-icons/fa"
import { Layers, Award, Sparkles, Clock } from "lucide-react"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  stack?: string
  status?: string
  expertName?: string
  studentName?: string
  budget?: number
  hasPending?: boolean
  onClick: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  stack,
  status,
  expertName,
  studentName,
  budget,
  hasPending = false,
  onClick,
}) => {
  // Update the getProjectImage function to use real images from Pexels/Unsplash
  const getProjectImage = (title: string) => {
    const seed = title.length % 5 // Use title length to create some variety
    const images = [
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ]
    return images[seed]
  }

  // Determine if this is a "hot" project (just for UI enhancement)
  const isHotProject = id.length % 3 === 0
  const isRecommended = id.length % 5 === 0

  return (
    <motion.div
      onClick={!hasPending ? onClick : undefined}
      className={`
        bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm
        shadow-lg rounded-2xl overflow-hidden
        transition-all duration-300 relative group
        border border-purple-900/30
        ${hasPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-purple-900/20 hover:shadow-xl"}
      `}
      whileHover={!hasPending ? { scale: 1.02, y: -5 } : {}}
      whileTap={!hasPending ? { scale: 0.98 } : {}}
    >
      {/* Project Image */}
      <div className="h-40 overflow-hidden relative">
        <img
          src={getProjectImage(title) || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>

        {/* Hot Project Badge */}
        {isHotProject && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <FaFire className="mr-1" />
            HOT PROJECT
          </div>
        )}

        {/* Recommended Badge */}
        {isRecommended && !isHotProject && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <FaStar className="mr-1" />
            RECOMMENDED
          </div>
        )}

        {/* Expert & Status */}
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Award className="w-4 h-4 mr-1 text-purple-400" />
            {expertName || "No Expert"}
          </h3>
          {status && (
            <span className="text-xs text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full bg-yellow-500/10">
              {status}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-300 mb-3 line-clamp-3 text-sm">{description}</p>

        {/* Tech Stack */}
        {stack && (
          <div className="flex items-center text-xs mb-2 bg-gray-800/50 p-2 rounded-lg">
            <Layers className="w-4 h-4 mr-1 text-purple-400" />
            <span className="font-medium text-purple-300 mr-1">Tech:</span>
            <span className="text-gray-300">{stack}</span>
          </div>
        )}

        {/* Budget */}
        {typeof budget === "number" && (
          <p className="text-sm text-green-400 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-1" />
            <strong>Budget:</strong> ${budget}
          </p>
        )}

        {/* Added Deadline */}
        <div className="flex items-center text-xs mb-2 text-blue-300">
          <Clock className="w-4 h-4 mr-1" />
          <span>
            Apply within: <strong>7 days</strong>
          </span>
        </div>

        {/* Student Name */}
        {studentName && (
          <div className="flex items-center text-gray-300 mt-2">
            <FaUserGraduate className="mr-2 text-purple-400" />
            <span className="text-sm">{studentName}</span>
          </div>
        )}

        {/* If pending, show a small note */}
        {hasPending && (
          <div className="mt-2 text-yellow-300 text-xs font-semibold p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pending proposal submitted
          </div>
        )}

        {/* Apply Now Button */}
        {!hasPending && (
          <button className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 text-white text-sm font-medium rounded-lg border border-purple-500/30 transition-colors duration-300">
            View Details & Apply
          </button>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-xl transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}

export default ProjectCard
