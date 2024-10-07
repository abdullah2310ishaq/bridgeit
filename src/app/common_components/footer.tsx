import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-6 md:mb-0">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} />
          <span className="ml-3 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            BridgeIT
          </span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-green-400 transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-green-400 transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#" className="hover:text-green-400 transition-colors duration-300">
            Contact Us
          </a>
        </div>
        <div className="mt-6 md:mt-0">
          <p>&copy; {new Date().getFullYear()} BridgeIT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
