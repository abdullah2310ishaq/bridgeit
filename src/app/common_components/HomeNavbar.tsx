"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiSearch } from "react-icons/fi"
import { useState, useEffect } from "react"
import NavLink from "./NavLink"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`flex justify-between items-center px-4 sm:px-8 py-4 fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white bg-opacity-95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center">
        <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} className="rounded-full" />
        <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          BridgeIT
        </span>
      </div>

      {/* Nav Links - Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:flex space-x-8">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/dashboard">Analytics</NavLink>
      </div>

      {/* Search Icon and Sign In */}
      <div className="flex items-center space-x-4">
        {/* Search Icon */}
        <Link href="/dashboard/searchpage">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 cursor-pointer transition-colors duration-300"
          >
            <FiSearch size={22} aria-label="Search" />
          </motion.div>
        </Link>

        {/* Sign In Button */}
        <Link href="/auth/login-user">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-full shadow-md hover:shadow-lg active:opacity-90 outline-none transition-all duration-300"
            aria-label="Sign In"
          >
            Sign In
          </motion.button>
        </Link>
      </div>
    </nav>
  )
}

