"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaUserGraduate, FaUniversity, FaIndustry, FaChalkboardTeacher } from 'react-icons/fa';

const AdminPage: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-gray-400">Manage all aspects of the platform from a single interface</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <article
          className="bg-gray-800 p-10 rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigateTo('/admin/view/students')}
        >
          <header className="flex items-center space-x-4 mb-6">
            <FaUserGraduate className="text-blue-400 text-5xl" />
            <h2 className="text-3xl font-bold">See Students</h2>
          </header>
          <p className="text-gray-400">View student records and registrations.</p>
        </article>

        <article
          className="bg-gray-800 p-10 rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigateTo('/admin/view/universities')}
        >
          <header className="flex items-center space-x-4 mb-6">
            <FaUniversity className="text-green-400 text-5xl" />
            <h2 className="text-3xl font-bold">See Universities</h2>
          </header>
          <p className="text-gray-400">View  university records and details.</p>
        </article>

        <article
          className="bg-gray-800 p-10 rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigateTo('/admin/view/industry-experts')}
        >
          <header className="flex items-center space-x-4 mb-6">
            <FaIndustry className="text-yellow-400 text-5xl" />
            <h2 className="text-3xl font-bold">See Industry Experts</h2>
          </header>
          <p className="text-gray-400">View industry expert records and profiles.</p>
        </article>

        <article
          className="bg-gray-800 p-10 rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigateTo('/admin/view/faculties')}
        >
          <header className="flex items-center space-x-4 mb-6">
            <FaChalkboardTeacher className="text-red-400 text-5xl" />
            <h2 className="text-3xl font-bold">See Faculties</h2>
          </header>
          <p className="text-gray-400">View faculty records and profiles.</p>
        </article>

        <article
          className="bg-gray-800 p-10 rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105 hover:shadow-2xl"
          onClick={() => navigateTo('/admin/view/uniadmins')}
        >
          <header className="flex items-center space-x-4 mb-6">
            <FaUserGraduate className="text-blue-400 text-5xl" />
            <h2 className="text-3xl font-bold">See Uni Admins</h2>
          </header>
          <p className="text-gray-400">View Admins records and profiles.</p>
        </article>



      </main>
    </section>
  );
};

export default AdminPage;
