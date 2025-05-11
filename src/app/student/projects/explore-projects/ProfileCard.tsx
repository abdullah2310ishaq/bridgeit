"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Code, Briefcase, GraduationCap } from "lucide-react"

interface ProfileCardProps {
  imageData: string
  firstName: string
  lastName: string
  role: string
  skills?: string[] // <-- Accept optional array of skills
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageData, firstName, lastName, role, skills }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-900/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile header with gradient background */}
      <div className="h-24 bg-gradient-to-r from-purple-600/30 to-pink-600/30 relative">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden">
            <img
              src={imageData || "/placeholder.svg"}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="pt-14 pb-6 px-4 text-center">
        <h2 className="text-white text-xl font-bold">
          {firstName} {lastName}
        </h2>
        <div className="flex items-center justify-center mt-1">
          <GraduationCap className="w-4 h-4 text-purple-400 mr-1" />
          <p className="text-purple-300 text-sm">{role}</p>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-center mb-3">
              <Code className="w-4 h-4 text-purple-400 mr-1" />
              <h3 className="text-purple-300 font-medium text-sm">Skills</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/30"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                  +{skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action button */}
        <button className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 rounded-lg border border-purple-700/30 transition-colors duration-300 flex items-center justify-center">
          <Briefcase className="w-4 h-4 mr-2" />
          View Profile
        </button>
      </div>
    </motion.div>
  )
}

export default ProfileCard
