"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, User, Briefcase, Building, GraduationCap, MapPin, BookOpen } from "lucide-react"

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
}

interface Props {
  userProfile: UserProfile
  goToEditProfile: () => void
  gotoProfile: () => void
}

const ProfileSection: React.FC<Props> = ({ userProfile, goToEditProfile, gotoProfile }) => {
  const [imageError, setImageError] = useState(false)

  // Reset image error state when userProfile changes
  useEffect(() => {
    setImageError(false)
  }, [userProfile.imageData])

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-10">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-2/3 rounded-xl shadow-md overflow-hidden border border-gray-200"
      >
        {/* Card Header with Background */}
        <div className="relative h-32 w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: userProfile.uniImage
                ? `url('data:image/jpeg;base64,${userProfile.uniImage}')`
                : "url('/unknown.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
          </div>

          {/* Profile Image - Positioned to overlap the header */}
          <div className="absolute -bottom-12 left-6">
            {imageError || !userProfile.imageData ? (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            ) : (
              <img
                src={`data:image/jpeg;base64,${userProfile.imageData}`}
                alt={`${userProfile.firstName} ${userProfile.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                onError={handleImageError}
              />
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="pt-14 px-6 pb-6 bg-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {userProfile.firstName} {userProfile.lastName}
              </h2>

              <div className="flex items-center mt-1 text-gray-600">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>Student</span>
              </div>

              <div className="flex items-center mt-1 text-gray-600">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Roll Number: {userProfile.rollNumber}</span>
              </div>

              {userProfile.university && (
                <div className="flex items-center mt-1 text-gray-600">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{userProfile.university}</span>
                </div>
              )}

              {userProfile.address && (
                <div className="flex items-center mt-1 text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{userProfile.address}</span>
                </div>
              )}
            </div>

            <div className="flex mt-4 md:mt-0 space-x-3">
              <button
                onClick={goToEditProfile}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Profile
              </button>
              <button
                onClick={gotoProfile}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                View Profile
              </button>
            </div>
          </div>

          {/* Academic Info */}
          {(userProfile.course || userProfile.semester) && (
            <div className="mt-4">
              <div className="flex items-center text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="font-medium">Academic Information</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {userProfile.course && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Course: {userProfile.course}
                  </span>
                )}
                {userProfile.semester && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    Semester: {userProfile.semester}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {userProfile.description && (
            <div className="mt-4 text-gray-600 text-sm">
              <p className="line-clamp-3">{userProfile.description}</p>
            </div>
          )}
        </div>
      </motion.div>

      
    </div>
  )
}

export default ProfileSection
