import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import NavLink from "./NavLink";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 bg-opacity-90 shadow-md fixed w-full z-50 backdrop-filter backdrop-blur-lg">
      <div className="flex items-center">
        <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} />
        <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          BridgeIT
        </span>
      </div>
      <div className="flex space-x-6">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/dashboard">Analytics</NavLink>
      </div>
      <div>
        <Link href="/auth/login-user">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium px-5 py-2 rounded-full shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300"
            aria-label="Sign In"
          >
            Sign In
          </motion.button>
        </Link>
      </div>
    </nav>
  );
}
