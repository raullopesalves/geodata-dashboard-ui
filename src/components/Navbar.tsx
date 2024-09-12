import React, { useState } from 'react';
import flag from '../assets/images/flag.png';

const Navbar: React.FC = () => {
  const [language, setLanguage] = useState('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '0 20px' }} className="shadow-lg w-full">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <img 
            src={flag} 
            alt="Flag" 
            style={{ 
              width: '60px', 
              height: '60px', 
              marginRight: '10px' 
            }} 
          />
          <h1 className="text-2xl font-bold text-white">Bird Flu Cases in Switzerland</h1>
        </div>
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="flex items-center text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md focus:outline-none"
          >
            <span>{language}</span>
            <svg className="ml-2 w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M6 8l4 4 4-4H6z" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
              <ul className="py-1">
                <li>
                  <button 
                    onClick={() => handleLanguageChange('English')}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    English
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLanguageChange('Deutsch')}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    Deutsch
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLanguageChange('Français')}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    Français
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLanguageChange('Italiano')}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    Italiano
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
