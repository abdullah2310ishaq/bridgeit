"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AdminPage: React.FC = () => {
  const router = useRouter();

  // State to toggle between "View" and "Delete" sections
  const [activeTab, setActiveTab] = useState<"view" | "delete">("view");

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-400">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-gray-400">Manage platform entities with ease</p>
      </header>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-6 mb-10">
        <button
          onClick={() => setActiveTab("view")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold ${
            activeTab === "view"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          View
        </button>
        <button
          onClick={() => setActiveTab("delete")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold ${
            activeTab === "delete"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Delete
        </button>
      </div>

      {/* Dynamic Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {activeTab === "view" ? (
          <>
            <button
              onClick={() => navigateTo("/admin/view/students")}
              className="bg-blue-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-blue-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Students</h2>
              <p className="text-gray-200 text-sm">View and manage all student records.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/view/universities")}
              className="bg-green-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-green-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Universities</h2>
              <p className="text-gray-200 text-sm">View and manage registered universities.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/view/industry-experts")}
              className="bg-yellow-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-yellow-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Industry Experts</h2>
              <p className="text-gray-200 text-sm">View and manage industry experts.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/view/faculties")}
              className="bg-red-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-red-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Faculties</h2>
              <p className="text-gray-200 text-sm">View and manage all faculties.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/view/uniadmins")}
              className="bg-purple-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-purple-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Uni Admins</h2>
              <p className="text-gray-200 text-sm">View and manage university administrators.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/view/companies")}
              className="bg-teal-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-teal-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Companies</h2>
              <p className="text-gray-200 text-sm">View and manage registered companies.</p>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigateTo("/admin/delete/students")}
              className="bg-blue-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-blue-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Students</h2>
              <p className="text-gray-200 text-sm">Delete student records.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/delete/universities")}
              className="bg-green-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-green-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Universities</h2>
              <p className="text-gray-200 text-sm">Delete universities from the system.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/delete/industry-experts")}
              className="bg-yellow-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-yellow-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Industry Experts</h2>
              <p className="text-gray-200 text-sm">Delete industry expert records.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/delete/faculties")}
              className="bg-red-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-red-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Faculties</h2>
              <p className="text-gray-200 text-sm">Delete faculty profiles.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/delete/uniadmins")}
              className="bg-purple-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-purple-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Uni Admins</h2>
              <p className="text-gray-200 text-sm">Delete university administrators.</p>
            </button>
            <button
              onClick={() => navigateTo("/admin/delete/companies")}
              className="bg-teal-600 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-teal-700 transition"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Companies</h2>
              <p className="text-gray-200 text-sm">Delete registered companies.</p>
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminPage;
