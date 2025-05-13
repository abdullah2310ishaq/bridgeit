"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, User, Building, GraduationCap, MapPin, BookOpen, Mail, Award, Clock } from "lucide-react"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  description: string
  rollNumber: string
  imageData?: string
  uniImage?: string
  semester?: string
  course?: string
  university?: string
  address?: string
  email?: string
}

interface Props {
  userProfile: UserProfile
  goToEditProfile: () => void
  gotoProfile: () => void
}

const ProfileSection: React.FC<Props> = ({ userProfile, goToEditProfile, gotoProfile }) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Reset image error state when userProfile changes
  useEffect(() => {
    setImageError(false)
  }, [userProfile.imageData])

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Background Header */}
        <div className="relative h-48 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-5000"
            style={{
              backgroundImage: userProfile.uniImage
                ? `url('data:image/jpeg;base64,${userProfile.uniImage}')`
                : "url('/bustling-university-campus.png')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-gray-900/70"></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>

          {/* Header Content */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
            <div className="flex items-center">
              <motion.div whileHover={{ scale: 1.05 }} className="relative mr-5">
                {imageError || !userProfile.imageData ? (
                  <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="h-14 w-14 text-gray-300" />
                  </div>
                ) : (
                  <img
                    src={`data:image/jpeg;base64,${userProfile.imageData}`}
                    alt={`${userProfile.firstName} ${userProfile.lastName}`}
                    className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-lg"
                    onError={handleImageError}
                  />
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="sr-only">Online</span>
                </div>
              </motion.div>

              <div className="text-white">
                <h1 className="text-3xl font-bold text-white">
                  {userProfile.firstName} {userProfile.lastName}
                </h1>
                <div className="flex items-center mt-1 text-gray-300">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span>Student</span>
                  <span className="mx-2">•</span>
                  <span>{userProfile.rollNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToEditProfile}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={gotoProfile}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Personal Information
              </h3>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{userProfile.email || "Not provided"}</p>
                </div>
              </div>

              {userProfile.address && (
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{userProfile.address}</p>
                  </div>
                </div>
              )}

              {userProfile.university && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">University</p>
                    <p className="font-medium text-gray-800">{userProfile.university}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">About Me</h3>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-700">
                  {userProfile.description ||
                    "No description provided. Click 'Edit Profile' to add information about yourself."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileSection
