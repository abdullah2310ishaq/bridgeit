import React from 'react';

interface CompanyProfileProps {
  companyName: string;
  address: string;
  contact: string;
  onEditCompany: () => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyName, address, contact, onEditCompany }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 p-12 rounded-lg shadow-2xl mb-12 overflow-hidden mt-16 relative">
      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">{companyName}</h2>
      <p className="text-lg text-gray-400"><strong>Address:</strong> {address}</p>
      <p className="text-lg text-gray-400"><strong>Contact:</strong> {contact}</p>
      <button 
        onClick={onEditCompany} 
        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-blue-600 transition transform hover:scale-105"
      >
        Edit Company
      </button>
    </div>
  );
};

export default CompanyProfile;
