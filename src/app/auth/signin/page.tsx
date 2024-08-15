"use client"
import React from 'react';

const SignIn = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left side (form) */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don’t have an account? 
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500"> Sign up here!</a>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your Password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or sign in with</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col space-y-4">
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
              >
                <img src="/google.jpeg" alt="Google" className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
              >
                <img src="/apple.png" alt="Apple" className="w-5 h-5 mr-2" />
                Sign in with Apple
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Right side (image and text) */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-center items-center bg-blue-900 p-8">
        <div className="text-white text-center mb-8">
          <h2 className="text-3xl font-extrabold">Welcome Back!</h2>
          <p className="mt-4">Lorem Ipsum is simply</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/path-to-your-image.png" alt="illustration" className="w-full h-full object-cover" />
        </div>
      </div>
      {/* Mobile view image and text */}
      <div className="lg:hidden flex-1 flex flex-col justify-center items-center bg-blue-900 p-8">
        <div className="text-white text-center mb-8">
          <h2 className="text-2xl font-extrabold">Welcome Back!</h2>
          <p className="mt-4 text-sm">Lorem Ipsum is simply</p>
        </div>
        <img src="/path-to-your-image.png" alt="illustration" className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}

export default SignIn;
