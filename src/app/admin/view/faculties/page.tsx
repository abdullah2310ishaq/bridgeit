"use client";
import React, { useEffect, useState } from 'react';

const ManageFacultiesPage: React.FC = () => {
  const [faculties, setFaculties] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const response = await fetch('https://localhost:7053/api/get-faculty/faculties');
        if (response.ok) {
          const data = await response.json();
          setFaculties(data);
        } else {
          console.error('Failed to fetch faculties:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching faculties:', error);
      }
    }

    fetchFaculties();
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold">Faculties Overview</h1>
        <p className="mt-2 text-lg text-gray-400">View all faculty details in the system</p>
      </header>
      <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4 text-left">First Name</th>
            <th className="p-4 text-left">Last Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">University</th>
            <th className="p-4 text-left">Post</th>
            <th className="p-4 text-left">Interests</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map(faculty => (
            <tr key={faculty.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
              <td className="p-4">{faculty.firstName}</td>
              <td className="p-4">{faculty.lastName}</td>
              <td className="p-4">{faculty.email}</td>
              <td className="p-4">{faculty.universityName}</td>
              <td className="p-4">{faculty.post}</td>
              <td className="p-4">{faculty.interest ? faculty.interest.join(', ') : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ManageFacultiesPage;
