"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const AdminPage: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-gray-400">Manage all aspects of the platform</p>
      </header>

      <div className="flex justify-around max-w-6xl mx-auto">
        {/* View Section */}
        <div className="flex flex-col space-y-4 max-w-xs">
          <h2 className="text-2xl font-bold text-center mb-4">View</h2>
          <button
            onClick={() => navigateTo('/admin/view/students')}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            See Students
          </button>
          <button
            onClick={() => navigateTo('/admin/view/universities')}
            className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            See Universities
          </button>
          <button
            onClick={() => navigateTo('/admin/view/industry-experts')}
            className="w-full py-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            See Industry Experts
          </button>
          <button
            onClick={() => navigateTo('/admin/view/faculties')}
            className="w-full py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
          >
            See Faculties
          </button>
          <button
            onClick={() => navigateTo('/admin/view/uniadmins')}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
          >
            See Uni Admins
          </button>
          <button
            onClick={() => navigateTo('/admin/view/companies')}
            className="w-full py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
          >
            See Companies
          </button>
        </div>

        {/* Vertical Line */}
        <div className="border-r-2 border-gray-500"></div>

        {/* Create Section */}
        <div className="flex flex-col space-y-4 max-w-xs">
          <h2 className="text-2xl font-bold text-center mb-4">Create</h2>
          <button
            onClick={() => navigateTo('/admin/create/students')}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create Student
          </button>
          <button
            onClick={() => navigateTo('/admin/create/universities')}
            className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            Create University
          </button>
          <button
            onClick={() => navigateTo('/admin/create/industry-experts')}
            className="w-full py-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Create Industry Expert
          </button>
          <button
            onClick={() => navigateTo('/admin/create/faculties')}
            className="w-full py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
          >
            Create Faculty
          </button>
          <button
            onClick={() => navigateTo('/admin/create/uniadmins')}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Create Uni Admin
          </button>
          <button
            onClick={() => navigateTo('/admin/create/companies')}
            className="w-full py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
          >
            Create Company
          </button>
        </div>

        {/* Vertical Line */}
        <div className="border-r-2 border-gray-500"></div>

        {/* Edit Section */}
        <div className="flex flex-col space-y-4 max-w-xs">
          <h2 className="text-2xl font-bold text-center mb-4">Edit</h2>
          <button
            onClick={() => navigateTo('/admin/edit/students')}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Edit Students
          </button>
          <button
            onClick={() => navigateTo('/admin/edit/universities')}
            className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            Edit Universities
          </button>
          <button
            onClick={() => navigateTo('/admin/edit/industry-experts')}
            className="w-full py-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Edit Industry Experts
          </button>
          <button
            onClick={() => navigateTo('/admin/edit/faculties')}
            className="w-full py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
          >
            Edit Faculties
          </button>
          <button
            onClick={() => navigateTo('/admin/edit/uniadmins')}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Edit Uni Admins
          </button>
          <button
            onClick={() => navigateTo('/admin/edit/companies')}
            className="w-full py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
          >
            Edit Companies
          </button>
        </div>

        {/* Vertical Line */}
        <div className="border-r-2 border-gray-500"></div>

        {/* Delete Section */}
        <div className="flex flex-col space-y-4 max-w-xs">
          <h2 className="text-2xl font-bold text-center mb-4">Delete</h2>
          <button
            onClick={() => navigateTo('/admin/delete/students')}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Delete Students
          </button>
          <button
            onClick={() => navigateTo('/admin/delete/universities')}
            className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            Delete Universities
          </button>
          <button
            onClick={() => navigateTo('/admin/delete/industry-experts')}
            className="w-full py-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Delete Industry Experts
          </button>
          <button
            onClick={() => navigateTo('/admin/delete/faculties')}
            className="w-full py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
          >
            Delete Faculties
          </button>
          <button
            onClick={() => navigateTo('/admin/delete/uniadmins')}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Delete Uni Admins
          </button>
          <button
            onClick={() => navigateTo('/admin/delete/companies')}
            className="w-full py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
          >
            Delete Companies
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
