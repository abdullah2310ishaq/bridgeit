"use client";
import React, { useEffect, useState } from 'react';

interface Company {
  id: string;
  name: string;
  address: string;
  business: string;
  description: string;
}

const ViewCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('https://localhost:7053/api/companies/get-all-companies', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          console.error('Failed to fetch companies:', response.statusText);
          setError('Failed to fetch companies.');
        }
      } catch (error) {
        console.error('An error occurred while fetching companies:', error);
        setError('An error occurred while fetching companies.');
      }
    };

    fetchCompanies();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Companies List</h1>
      <div className="w-full max-w-3xl space-y-4">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div key={company.id} className="p-4 bg-gray-800 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-blue-300">{company.name}</h2>
              <p className="text-sm text-gray-400"><strong>Address:</strong> {company.address}</p>
              <p className="text-sm text-gray-400"><strong>Business:</strong> {company.business}</p>
              <p className="text-sm text-gray-400"><strong>Description:</strong> {company.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No companies available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default ViewCompaniesPage;
