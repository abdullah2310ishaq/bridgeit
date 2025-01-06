
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Transition, Dialog, Menu } from "@headlessui/react";
import ProfileDropdown from "./ProfileDropdown"; // Ensure this component is properly implemented

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  imageData: string;
}

interface NavBarProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

interface NavLink {
  name: string;
  href: string;
  children?: NavLink[];
}

const NavBar: React.FC<NavBarProps> = ({ userProfile, onLogout }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Define navigation links
  const navigationLinks: NavLink[] = [
    { name: "Home", href: "/student" },
    {
      name: "Projects",
      href: "#",
      children: [
        { name: "My Projects", href: "/student/projects" },
        { name: "Explore Projects", href: "/student/projects/explore-projects" },
        { name: "Create", href: "/student/projects/create"},
        { name: "History", href: "/student/projects/history"},

        
      
      ],
    },
    {
      name: "Update",
      href: "#",
      children: [
        { name: "Image & Password", href: "/student/profile/management" },
      ],
    },
    {
      name: "Profile",
      href: "#",
      children: [
        { name: "View", href: "/student/profile" },
        { name: "Edit", href: "/student/profile/edit" },
      ],
    },
    {
      name: "Ideas",
      href: "#",
      children: [
        { name: "View All Ideas", href: "/student/seeideas" },
      ],
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
  ];

  // Function to determine if a link is active
  const isActiveLink = (link: NavLink): boolean => {
    if (link.href === "#" && link.children) {
      return link.children.some((child) => pathname.startsWith(child.href));
    }
    return pathname === link.href || pathname.startsWith(link.href);
  };

  // Logout handlers
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-gray-800 fixed w-full top-0 z-50 shadow-md">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
         

          {/* Middle Section: Desktop Navigation Links */}
          <div className="hidden md:flex md:space-x-4 md:items-center">
            {navigationLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.children ? (
                  // Dropdown Menu for Links with Children
                  <Menu as="div" className="relative">
                    <Menu.Button
                      className={`flex items-center px-3 py-2 text-sm font-medium transition duration-300 ${
                        isActiveLink(link)
                          ? "text-green-500 border-b-2 border-green-500"
                          : "text-gray-300 hover:text-green-500"
                      }`}
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {link.name}
                      <FaChevronDown className="ml-1 h-4 w-4" />
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
                      <Menu.Items className="absolute left-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-md py-1 z-50">
                        {link.children.map((child) => (
                          <Menu.Item key={child.name}>
                            {({ active }) => (
                              <Link
                                href={child.href}
                                className={`block px-4 py-2 text-sm ${
                                  active || isActiveLink(child)
                                    ? "text-green-500 bg-gray-700"
                                    : "text-gray-300 hover:text-green-500"
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
                        ? "text-green-500 border-b-2 border-green-500"
                        : "text-gray-300 hover:text-green-500"
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
              className="text-gray-300 hover:text-green-500 focus:outline-none"
              aria-label="Open Menu"
            >
              <FaBars size={24} />
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
            <div className="fixed inset-0 bg-black opacity-75" />
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
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                {/* Close Button */}
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close Menu"
                  >
                    <FaTimes className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="pt-5 pb-4 overflow-y-auto">
                  {/* Brand */}
                  <div className="flex items-center px-4">
                    <Link href="/student" className="text-green-500 text-2xl font-bold hover:text-green-400">
                      Student Module
                    </Link>
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
                              isActiveLink(link)
                                ? "text-green-500 bg-gray-700"
                                : "text-gray-300 hover:text-green-500"
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
                <div className="px-4 py-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      router.push("/student/profile");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-500 transition duration-300"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push("/student/profile/edit");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-green-500 transition duration-300"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogoutClick();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-700 transition duration-300"
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
            <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                <Dialog.Panel className="max-w-md w-full bg-gray-800 rounded-lg p-6 shadow-lg transform transition-all">
                  {/* Header */}
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m4-10V7a2 2 0 00-2-2H9a2 2 0 00-2 2v4m12 5v-5m-4 0a2 2 0 01-2 2h-4a2 2 0 01-2-2v5m2 2H7"
                        />
                      </svg>
                    </div>
                    <Dialog.Title className="text-xl font-semibold text-gray-100">
                      Confirm Logout
                    </Dialog.Title>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to log out? You will need to log back in to access your account.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelLogout}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
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
  );
};

// Mobile SubMenu Component
const MobileSubMenu: React.FC<{ link: NavLink }> = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (child: NavLink): boolean => {
    return pathname.startsWith(child.href);
  };

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
          link.children?.some((child) => isActiveLink(child))
            ? "text-green-500 bg-gray-700"
            : "text-gray-300 hover:text-green-500"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{link.name}</span>
        <FaChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
            }`}
        />
      </button>
      {isOpen && (
        <div className="pl-4 mt-1 space-y-1">
          {link.children?.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                isActiveLink(child)
                  ? "text-green-500 bg-gray-700"
                  : "text-gray-300 hover:text-green-500"
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavBar;
