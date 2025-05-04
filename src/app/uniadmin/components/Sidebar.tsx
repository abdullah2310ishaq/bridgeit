"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { FaUser, FaProjectDiagram, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa"
import { motion } from "framer-motion"

interface SidebarProps {
  handleLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
  const router = useRouter()

  return (
    <div className="w-64 bg-gray-100 shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          Admin Dashboard
        </h2>
      </div>
      <nav className="mt-6">
        <a
          onClick={() => router.push("uniadmin/profile")}
          className="flex items-center py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white cursor-pointer"
        >
          <FaUser className="mr-3" />
          Profile
        </a>
        <a
          onClick={() => router.push("uniadmin/fyprequests")}
          className="flex items-center py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white cursor-pointer"
        >
          <FaProjectDiagram className="mr-3" />
          FYP Requests
        </a>
        <a
          onClick={() => router.push("uniadmin/events")}
          className="flex items-center py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white cursor-pointer"
        >
          <FaCalendarAlt className="mr-3" />
          Events
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center w-full py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>

        {/* CALENDAR SECTION 
        <motion.div
          className="bg-gray-100 rounded-lg shadow-lg p-6 border border-gray-800 
                     col-span-2 md:col-span-2 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
        </motion.div>*/}
      </nav>
    </div>
  )
}

export default Sidebar
