// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <div className="flex items-center">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} />
          <span className="ml-2 text-2xl font-bold">BridgeIT</span>
        </div>
        <div className="flex space-x-8">
          <Link href="/" className="text-lg font-medium">Home</Link>
          <Link href="/about" className="text-lg font-medium">About</Link>
        </div>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full px-4 py-2 w-48 focus:outline-none"
            />
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16l6 6M16 16l6-6M8 8l6-6M16 8l6-6"
                />
              </svg>
            </div>
          </div>
          <Link href="auth/login-user" className="text-white bg-blue-600 px-4 py-2 rounded-full">Sign In</Link>
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 px-8 py-16">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl font-bold text-blue-700">Welcome to BridgeIT!</h1>
          <p className="text-lg mt-4">
            Bridge the gap between academia and industry with our platform, where universities and experts connect directly with businesses.
          </p>
          <Link href="/auth/register-user">
            <button className="mt-8 bg-gray-700 text-white px-6 py-3 rounded-full flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 20v-6m0-4v-6M8 4h8M5 10h14m-9 5a3 3 0 106 0 3 3 0 10-6 0"></path>
              </svg>
              Create an Account
            </button>
          </Link>
        </div>

        {/* Illustration Image */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <Image src="/homepage.jpg" alt="Illustration" width={400} height={400} />
        </div>
      </div>
    </div>
  );
}
