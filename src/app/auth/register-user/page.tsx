'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import FacultyRegistration from './users/FacultyRegistration'
import RegisterIndustryExpert from './users/RegisterExpert'
import StudentRegistration from './users/StudentRegistration'
import UniversityAdminRegistration from './users/UniAdmin'

const roles = [
  {
    key: 'Student',
    icon: 'ph:student-bold',
    label: 'Student',
    description: 'Collaborate and showcase your skills.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    key: 'Faculty',
    icon: 'ph:chalkboard-teacher-bold',
    label: 'Faculty',
    description: 'Guide and mentor future leaders.',
    color: 'from-green-400 to-green-600',
  },
  {
    key: 'IndustryExpert',
    icon: 'ph:briefcase-bold',
    label: 'Industry Expert',
    description: 'Share insights and industry experience.',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    key: 'UniversityAdmin',
    icon: 'ph:buildings-bold',
    label: 'University Admin',
    description: 'Manage and oversee university operations.',
    color: 'from-purple-400 to-purple-600',
  },
]

const RegistrationPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const renderRegistrationForm = () => {
    switch (selectedRole) {
      case 'Student':
        return <StudentRegistration />
      case 'Faculty':
        return <FacultyRegistration />
      case 'IndustryExpert':
        return <RegisterIndustryExpert />
      case 'UniversityAdmin':
        return <UniversityAdminRegistration />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.3) 0%, transparent 25%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-5xl relative z-10"
      >
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            BridgeIT
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="roleSelection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-extrabold text-center mt-8 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Welcome to BridgeIT
              </h1>
              <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect, collaborate, and grow with our innovative platform designed for students, faculty, industry experts, and university administrators.
              </p>
              <h2 className="text-2xl font-bold text-center mb-6">Choose Your Role</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <motion.div
                    key={role.key}
                    onClick={() => setSelectedRole(role.key)}
                    className={`bg-gradient-to-br ${role.color} p-6 rounded-xl shadow-lg cursor-pointer overflow-hidden relative group`}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <Icon icon={role.icon} className="text-5xl mb-4" />
                    <h3 className="text-xl font-bold mb-2">{role.label}</h3>
                    <p className="text-sm opacity-80">{role.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="registrationForm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {roles.find((role) => role.key === selectedRole)?.label} Registration
                </h2>
                <button
                  onClick={() => setSelectedRole('')}
                  className="text-gray-400 hover:text-gray-200 transition duration-300 flex items-center"
                >
                  <Icon icon="ph:arrow-left-bold" className="mr-2" />
                  Back to Roles
                </button>
              </div>
              <div className="bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-sm p-8 rounded-xl shadow-lg">
                {renderRegistrationForm()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default RegistrationPage

