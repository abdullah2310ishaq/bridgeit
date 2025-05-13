"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  FileText,
  Video,
  CreditCard,
  Lightbulb,
  Bell,
  Zap,
  BookOpen,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Globe,
  BarChart,
  Clock,
  Settings,
  HelpCircle,
  Bookmark,
} from "lucide-react"

interface QuickLink {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
  notificationCount: number
}

interface QuickAccessProps {
  className?: string
  apiLinks?: QuickLink[]
}

const QuickAccessSection: React.FC<QuickAccessProps> = ({ className, apiLinks = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [totalNotifications, setTotalNotifications] = useState(0)

  // Map icon strings to actual Lucide icon components
  const iconMap: Record<string, React.ElementType> = {
    Calendar,
    FileText,
    Video,
    CreditCard,
    Lightbulb,
    Bell,
    Zap,
    BookOpen,
    Award,
    Users,
    Briefcase,
    GraduationCap,
    Globe,
    BarChart,
    Clock,
    Settings,
    HelpCircle,
    Bookmark,
  }

  // Default quick links if API doesn't provide any
  const defaultQuickLinks = [
    {
      id: "1",
      title: "Student Events",
      description: "Browse and register for upcoming events",
      icon: "Calendar",
      href: "/student/events",
      color: "blue",
      notificationCount: 3,
    },
    {
      id: "2",
      title: "Register FYP",
      description: "Submit your final year project proposal",
      icon: "FileText",
      href: "/students/fyp",
      color: "gray",
      notificationCount: 0,
    },
    {
      id: "3",
      title: "FYP Meetings",
      description: "Schedule and manage project meetings",
      icon: "Video",
      href: "/student/meetings",
      color: "blue",
      notificationCount: 1,
    },
    {
      id: "4",
      title: "Payment History",
      description: "View your transaction records",
      icon: "CreditCard",
      href: "/students/payment-history",
      color: "gray",
      notificationCount: 0,
    },
    {
      id: "5",
      title: "Faculty Ideas",
      description: "Explore project ideas from faculty",
      icon: "Lightbulb",
      href: "/student/seeideas",
      color: "blue",
      notificationCount: 5,
    },
  ]



  // Use API links if available, otherwise use defaults
  const quickLinks = apiLinks.length > 0 ? apiLinks : defaultQuickLinks

  // Calculate total notifications
 
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  // Helper function to get color classes based on color name
  const getColorClasses = (color: string, isHovered: boolean) => {
    const colorMap: Record<string, { bg: string; hoverBg: string; iconBg: string }> = {
      blue: {
        bg: "from-blue-600 to-blue-700",
        hoverBg: "from-blue-700 to-blue-800",
        iconBg: "bg-blue-500/20",
      },
      gray: {
        bg: "from-gray-600 to-gray-700",
        hoverBg: "from-gray-700 to-gray-800",
        iconBg: "bg-gray-500/20",
      },
      green: {
        bg: "from-green-600 to-green-700",
        hoverBg: "from-green-700 to-green-800",
        iconBg: "bg-green-500/20",
      },
      purple: {
        bg: "from-purple-600 to-purple-700",
        hoverBg: "from-purple-700 to-purple-800",
        iconBg: "bg-purple-500/20",
      },
      red: {
        bg: "from-red-600 to-red-700",
        hoverBg: "from-red-700 to-red-800",
        iconBg: "bg-red-500/20",
      },
    }

    const colorClasses = colorMap[color] || colorMap.blue
    return {
      bg: isHovered ? colorClasses.hoverBg : colorClasses.bg,
      iconBg: colorClasses.iconBg,
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-6 ${className}`}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="bg-white/10 rounded-lg p-2 mr-3">
                <Zap className="w-5 h-5 text-white" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Quick Access</h2>
                <p className="text-gray-300 text-xs">Navigate to important resources</p>
              </div>
            </div>

            {totalNotifications > 0 && (
              <div className="bg-gray-700/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                <span className="text-xs text-white font-medium">{totalNotifications} updates</span>
                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Quick Links */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
        >
          {quickLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon] || Zap
            const colorClasses = getColorClasses(link.color, hoveredIndex === index)

            return (
              <motion.a
                key={link.id}
                href={link.href}
                className="relative group"
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="h-full rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} transition-all duration-300 z-0`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10 p-4 flex flex-col items-center text-center h-full">
                    <div className={`p-2 rounded-full ${colorClasses.iconBg} mb-2`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-medium text-white text-sm">{link.title}</h3>
                    <p className="text-white/70 text-xs mt-1 hidden md:block line-clamp-1">{link.description}</p>

                    {/* Notification badge */}
                    {link.notificationCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {link.notificationCount}
                      </div>
                    )}

                    {/* Animated arrow on hover */}
                    <motion.div
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: hoveredIndex === index ? 0 : -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </motion.div>

        {/* Secondary Quick Links - Smaller and more compact */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 sm:grid-cols-5 gap-2"
            >
          
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default QuickAccessSection
