"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { Fragment, useEffect, useState } from "react"
import { Transition, Dialog, Menu } from "@headlessui/react"
import ProfileDropdown from "./ProfileDropdown"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  role: string
  imageData: string
}

interface NavBarProps {
  userProfile: UserProfile
  onLogout: () => void
}

interface NavLink {
  name: string
  href: string
  children?: NavLink[]
}

const NavBar: React.FC<NavBarProps> = ({ userProfile, onLogout }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  // Define navigation links
  const navigationLinks: NavLink[] = [
    { name: "Home", href: "/student" },
    {
      name: "Projects",
      href: "#",
      children: [
        { name: "My Projects", href: "/student/projects" },
        { name: "Explore Projects", href: "/student/projects/explore-projects" },
        { name: "Create", href: "/student/projects/create" },
        { name: "History", href: "/student/projects/history" },
      ],
    },
    {
      name: "Profile",
      href: "#",
      children: [
        { name: "View", href: "/student/profile" },
        { name: "Edit", href: "/student/profile/edit" },
        { name: "Settings", href: "/student/profile/management" },
      ],
    },
    {
      name: "Ideas",
      href: "#",
      children: [{ name: "View All Ideas", href: "/student/seeideas" }],
    },
    {
      name: "FYP",
      href: "#",
      children: [
        { name: "Register", href: "/student/fyp" },
        { name: "View", href: "/student/fyp/fyp_record" },
      ],
    },
    {
      name: "Notifications",
      href: "/student/std_notifications",
    },
  ]

  // Function to determine if a link is active
  const isActiveLink = (link: NavLink): boolean => {
    if (link.href === "#" && link.children) {
      return link.children.some((child) => pathname.startsWith(child.href))
    }
    return pathname === link.href || pathname.startsWith(link.href)
  }

  // Logout handlers
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
  }

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false)
    onLogout()
  }

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="bg-gray-200 fixed w-full top-0 z-50 shadow-md">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand/Title */}
          <div className="flex items-center">
            <Link href="/student" className="text-blue-600 text-lg font-semibold">
              Student Portal
            </Link>
          </div>

          {/* Middle Section: Desktop Navigation Links */}
          <div className="hidden md:flex md:space-x-1 md:items-center">
            {navigationLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.children ? (
                  // Dropdown Menu for Links with Children
                  <Menu as="div" className="relative">
                    <Menu.Button
                      className={`flex items-center px-3 py-2 text-sm font-medium transition duration-300 ${
                        isActiveLink(link)
                          ? "text-white bg-blue-600 rounded-md"
                          : "text-gray-700 hover:bg-gray-300 hover:text-blue-600 rounded-md"
                      }`}
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {link.name}
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Menu.Items className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                        {link.children.map((child) => (
                          <Menu.Item key={child.name}>
                            {({ active }) => (
                              <Link
                                href={child.href}
                                className={`block px-4 py-2 text-sm ${
                                  active || isActiveLink(child)
                                    ? "text-white bg-blue-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {child.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  // Single Link
                  <Link
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium transition duration-300 ${
                      isActiveLink(link)
                        ? "text-white bg-blue-600 rounded-md"
                        : "text-gray-700 hover:bg-gray-300 hover:text-blue-600 rounded-md"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Section: Profile Dropdown (Desktop) */}
          <div className="hidden md:flex items-center">
            <ProfileDropdown userProfile={userProfile} onLogoutClick={handleLogoutClick} />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Open Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setMobileMenuOpen(false)}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-75"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-75"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* Sliding Panel */}
          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                {/* Close Button */}
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close Menu"
                  >
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="pt-5 pb-4 overflow-y-auto">
                  {/* Brand */}
                  <div className="flex items-center px-4 border-b border-gray-200 pb-4">
                    <Link href="/student" className="text-blue-600 text-lg font-semibold">
                      Student Portal
                    </Link>
                  </div>

                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">
                      {userProfile.firstName} {userProfile.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{userProfile.role}</p>
                  </div>

                  {/* Navigation Links */}
                  <nav className="mt-5 px-2 space-y-1">
                    {navigationLinks.map((link) => (
                      <div key={link.name}>
                        {link.children ? (
                          // Collapsible Submenu
                          <MobileSubMenu link={link} />
                        ) : (
                          // Single Link
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                              isActiveLink(link) ? "text-white bg-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {link.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Profile and Logout */}
                <div className="px-4 py-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      router.push("/student/profile")
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition duration-300"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push("/student/profile/edit")
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition duration-300"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogoutClick()
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-300 mt-2"
                  >
                    Logout
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>

            {/* Clickable Area to Close Menu */}
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        </Dialog>
      </Transition>

      {/* Logout Confirmation Dialog */}
      <Transition appear show={isLogoutDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCancelLogout}>
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-300 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-200 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg transform transition-all">
                  {/* Header */}
                  <Dialog.Title className="text-xl font-semibold text-gray-800">Confirm Logout</Dialog.Title>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Are you sure you want to log out? You will need to log back in to access your account.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelLogout}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                    >
                      Logout
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </nav>
  )
}

// Mobile SubMenu Component
const MobileSubMenu: React.FC<{ link: NavLink }> = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActiveLink = (child: NavLink): boolean => {
    return pathname.startsWith(child.href)
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
          link.children?.some((child) => isActiveLink(child))
            ? "text-white bg-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{link.name}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-200 ml-3">
          {link.children?.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                isActiveLink(child) ? "text-white bg-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default NavBar

