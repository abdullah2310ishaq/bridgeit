// components/NavBar.tsx

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import ProfileDropdown from "./ProfileDroptown";
import { Transition, Dialog } from "@headlessui/react";

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

const NavBar: React.FC<NavBarProps> = ({ userProfile, onLogout }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activePage, setActivePage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for logout confirmation dialog
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Set active page based on the current route
  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  const navigationLinks = [
    { name: "Home", href: "/student" },
    {
      name: "Projects",
      href: "#",
      children: [
        { name: "My Projects", href: "/student/projects" },
        { name: "Explore Projects", href: "/student/projects/explore-projects" },
      ],
    },
    {
      name: "Update",
      href: "#",
      children: [
        { name: "Image", href: "/student/profile/management" },
        { name: "Password", href: "/student/profile/management" },
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
      name: "Notifications",
      href: "/student/std_notifications",
    },
  ];

  // Updated isActiveLink function
  const isActiveLink = (link: { href: string; children?: any[] }) => {
    if (link.href === "#" && link.children) {
      // Check if any child link is active
      return link.children.some((child) => activePage.startsWith(child.href));
    } else {
      return activePage === link.href || activePage.startsWith(link.href);
    }
  };

  // Function to handle logout click from ProfileDropdown
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  // Function to confirm logout
  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  // Function to cancel logout
  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <nav className="bg-white fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo or Brand Name */}
          <div className="flex items-center">
            <Link href="/student" className="text-blue-600 text-2xl font-bold hover:text-blue-800">
              BridgeIT
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:ml-10 space-x-4 items-center">
            {navigationLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.children ? (
                  // Render parent link with dropdown
                  <>
                    <button
                      className={`px-3 py-2 text-sm font-medium transition duration-300 ${
                        isActiveLink(link)
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.name}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                            activePage.startsWith(child.href)
                              ? "text-blue-600 bg-gray-100"
                              : "text-gray-600 hover:text-blue-600"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  // Render normal link
                  <Link
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium transition duration-300 ${
                      isActiveLink(link)
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                    {isActiveLink(link) && (
                      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600 animate-slideIn" />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="hidden md:flex items-center">
            <ProfileDropdown
              userProfile={userProfile}
              onLogoutClick={handleLogoutClick} // Pass the function
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={mobileMenuOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationLinks.map((link) => (
              <div key={link.name}>
                {link.children ? (
                  // Render parent link with collapsible children
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileMenuOpen((prev) => !prev)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                        isActiveLink(link)
                          ? "text-blue-600 bg-gray-100"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.name}
                    </button>
                    <div className="pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                            activePage.startsWith(child.href)
                              ? "text-blue-600 bg-gray-100"
                              : "text-gray-600 hover:text-blue-600"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Render normal link
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                      isActiveLink(link)
                        ? "text-blue-600 bg-gray-100"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Profile Options */}
            <div className="border-t border-gray-200"></div>
            <button
              onClick={() => {
                router.push("/student/profile");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 rounded-md text-base font-medium transition duration-300"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                router.push("/student/profile/edit");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 rounded-md text-base font-medium transition duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogoutClick();
              }}
              className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-800 rounded-md text-base font-medium transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </Transition>

      {/* Logout Confirmation Dialog */}
      <Transition appear show={isLogoutDialogOpen} as={React.Fragment}>
  <Dialog as="div" className="relative z-50" onClose={handleCancelLogout}>
    {/* Overlay transition */}
    <Transition.Child
      as={React.Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
    </Transition.Child>

    {/* Dialog panel */}
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-full p-4 text-center">
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg transform transition-all">
            <div className="flex items-center space-x-4">
              {/* Icon to enhance dialog appearance */}
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
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Confirm Logout
              </Dialog.Title>
            </div>

            {/* Description */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to log out? You will need to log back in
                to access your account.
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition"
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

export default NavBar;