'use client'

import React, { useState } from 'react'
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
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    key: 'Faculty',
    icon: 'ph:chalkboard-teacher-bold',
    label: 'Faculty',
    description: 'Guide and mentor future leaders.',
    color: 'from-teal-500 to-teal-700',
  },
  {
    key: 'IndustryExpert',
    icon: 'ph:briefcase-bold',
    label: 'Industry Expert',
    description: 'Share insights and industry experience.',
    color: 'from-yellow-500 to-yellow-700',
  },
  {
    key: 'UniversityAdmin',
    icon: 'ph:buildings-bold',
    label: 'University Admin',
    description: 'Manage and oversee university operations.',
    color: 'from-purple-500 to-purple-700',
  },
]

const RegistrationPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('')

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Image
            src="/logo.jpg"
            alt="BridgeIT Logo"
            width={180}
            height={180}
            className="rounded-full border-4 border-indigo-500 shadow-xl mx-auto"
          />
        </motion.div>
        <h1 className="text-6xl font-extrabold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
          Welcome to BridgeIT
        </h1>
        <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
          Join our platform to connect, collaborate, and grow across various roles.
        </p>
      </motion.div>

      {/* Role Selection or Registration Form */}
      <motion.div
        className="relative z-10 w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="roleSelection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            >
              {roles.map((role) => (
                <motion.div
                  key={role.key}
                  onClick={() => setSelectedRole(role.key)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gradient-to-br ${role.color} p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-opacity" />
                  <div className="flex flex-col items-center">
                    <Icon icon={role.icon} className="text-5xl text-white mb-4" />
                    <h3 className="text-xl font-bold text-white">{role.label}</h3>
                    <p className="text-gray-200 text-center mt-2 text-sm">
                      {role.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="registrationForm"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 bg-opacity-60 rounded-2xl p-8 shadow-lg relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                  {roles.find((role) => role.key === selectedRole)?.label} Registration
                </h2>
                <button
                  onClick={() => setSelectedRole('')}
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <Icon icon="ph:arrow-left-bold" className="mr-2" />
                  Back to Roles
                </button>
              </div>
              {renderRegistrationForm()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default RegistrationPage
