"use client";
import React, { useEffect, useState } from 'react';

const ManageIndustryExpertsPage: React.FC = () => {
  const [industryExperts, setIndustryExperts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchIndustryExperts() {
      try {
        const response = await fetch('https://localhost:7053/api/get-industry-expert/industry-experts');
        if (response.ok) {
          const data = await response.json();
          setIndustryExperts(data);
        } else {
          console.error('Failed to fetch industry experts:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching industry experts:', error);
      }
    }

    fetchIndustryExperts();
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold">Industry Experts Overview</h1>
        <p className="mt-2 text-lg text-gray-400">View all industry expert details in the system</p>
      </header>
      <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4 text-left">First Name</th>
            <th className="p-4 text-left">Last Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Company</th>
            <th className="p-4 text-left">Contact</th>
          </tr>
        </thead>
        <tbody>
          {industryExperts.map(expert => (
            <tr key={expert.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
              <td className="p-4">{expert.firstName}</td>
              <td className="p-4">{expert.lastName}</td>
              <td className="p-4">{expert.email}</td>
              <td className="p-4">{expert.companyName}</td>
              <td className="p-4">{expert.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ManageIndustryExpertsPage;
