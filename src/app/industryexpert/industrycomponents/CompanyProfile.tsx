import React from 'react';

interface CompanyProfileProps {
  companyName: string;
  address: string;
  contact: string;
  onEditCompany: () => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyName, address, contact, onEditCompany }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{companyName}</h2>
      <p className="text-gray-600"><strong>Address:</strong> {address}</p>
      <p className="text-gray-600"><strong>Contact:</strong> {contact}</p>
      <button 
        onClick={onEditCompany} 
        className="mt-4 py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-400 transition"
      >
        Edit Company
      </button>
    </div>
  );
};

export default CompanyProfile;
