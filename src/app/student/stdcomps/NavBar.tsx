// components/NavBar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState("");

  // Set active page based on the current route
  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-gray-800">
                BridgeIT
              </Link>
            </div>
            <div className="hidden md:flex md:ml-10 space-x-4">
              {/* Highlighting active page */}
              <Link
                href="/student"
                className={`${
                  activePage === "/student"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-blue-500"
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Student
              </Link>

              <Link
                href="/faculty"
                className={`${
                  activePage === "/faculty"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-blue-500"
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Faculty
              </Link>

              <Link
                href="/projects"
                className={`${
                  activePage === "/projects"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-blue-500"
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Projects
              </Link>

              <Link
                href="/contact"
                className={`${
                  activePage === "/contact"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-blue-500"
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Link
              href="/profile"
              className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );


};

export default NavBar;
