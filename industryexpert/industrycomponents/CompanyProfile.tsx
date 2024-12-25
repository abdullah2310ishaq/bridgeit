import React from 'react';
import { Building2, Phone, MapPin } from "lucide-react"

interface CompanyProfileProps {
  companyName: string;
  address: string;
  contact: string;
  onEditCompany: () => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyName, address, contact, onEditCompany }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl mb-12 mt-16 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
      <div className="flex-1">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-2">
          {companyName}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full"></div>
      </div>
      <div className="flex-1 space-y-4">
        <p className="flex items-center text-lg text-gray-300">
          <MapPin className="w-6 h-6 mr-3 text-green-400" />
          <span className="font-semibold text-gray-200 mr-2">Address:</span> {address}
        </p>
        <p className="flex items-center text-lg text-gray-300">
          <Phone className="w-6 h-6 mr-3 text-blue-400" />
          <span className="font-semibold text-gray-200 mr-2">Contact:</span> {contact}
        </p>
      </div>
    </div>
    <div className="absolute bottom-0 right-0 opacity-10">
      <Building2 className="w-48 h-48 text-gray-600" />
    </div>
  </div>
  );
};

export default CompanyProfile;
