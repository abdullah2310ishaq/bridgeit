import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">BridgeIt</h1>
            <p className="text-sm mt-1">Connecting Academia and Industry</p>
          </div>
       
        </div>
        <div className="text-center mt-6 text-sm">
          <p>&copy; {new Date().getFullYear()} BridgeIt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
