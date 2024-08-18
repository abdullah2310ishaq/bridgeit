"use client";
import React, { useEffect, useState } from 'react';

const ManageUniversitiesPage: React.FC = () => {
  const [universities, setUniversities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const response = await fetch('https://localhost:7053/api/get-university/all-universities');
        if (response.ok) {
          const data = await response.json();
          setUniversities(data);
        } else {
          console.error('Failed to fetch universities:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching universities:', error);
      }
    }

    fetchUniversities();
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold">Universities Overview</h1>
        <p className="mt-2 text-lg text-gray-400">View all university details in the system</p>
      </header>
      <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4 text-left">University Name</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-left">Established Year</th>
          </tr>
        </thead>
        <tbody>
          {universities.map(university => (
            <tr key={university.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
              <td className="p-4">{university.name}</td>
              <td className="p-4">{university.address}</td>
              <td className="p-4">{university.contact || 'N/A'}</td>
              <td className="p-4">{university.estYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ManageUniversitiesPage;
