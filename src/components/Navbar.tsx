import React, { useState } from 'react';
import { HelpCircle, Globe } from 'react-feather';
import swissFlag from '../assets/images/flag.png';

const Navbar: React.FC = () => {
  const [language, setLanguage] = useState('English');
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src={swissFlag} alt="Swiss Flag" className="h-16 w-16" />
            <h1 className="text-white font-bold text-xl">Bird Flu Cases in Switzerland</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-700"
              onClick={() => setIsHelpModalVisible(true)}
            >
              <HelpCircle size={18} className="mr-2" />
              Help
            </button>
            <div className="relative">
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium appearance-none pr-8"
              >
                <option value="English">English</option>
                <option value="Deutsch">Deutsch</option>
                <option value="Français">Français</option>
                <option value="Italiano">Italiano</option>
              </select>
              <Globe size={18} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      {isHelpModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md text-white">
            <h2 className="text-xl font-bold mb-4">Dashboard Help</h2>
            <p className="mb-4">This dashboard provides an overview of bird flu cases in Switzerland. Use the filters on the left to select specific species, virus strains, and data sources. The timeline at the bottom allows you to view trends over different time periods.</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setIsHelpModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
