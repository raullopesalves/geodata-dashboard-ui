import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

import eurasianbluetitImg from '../assets/images/birds/eurasianbluetit.png';
import eurasianmagpieImg from '../assets/images/birds/eurasianmagpie.png';
import duckImg from '../assets/images/birds/duck.png';
import greattitImg from '../assets/images/birds/greattit.png';
import chickenImg from '../assets/images/birds/chicken.png';
import commonchaffinchImg from '../assets/images/birds/commonchaffinch.png';
import turkeyImg from '../assets/images/birds/turkey.png';
import europeanrobinImg from '../assets/images/birds/europeanrobin.png';
import housesparrowImg from '../assets/images/birds/housesparrow.png';
import gooseImg from '../assets/images/birds/goose.png';
import blackbirdImg from '../assets/images/birds/blackbird.png';
import barnswallowImg from '../assets/images/birds/barnswallow.png';

import placeholderbirdImg from '../assets/images/birds/placeholderbird.png';

interface FiltersProps {
  selectedSpecies: string[];
  uniqueSpecies: string[];
  onSpeciesChange: (species: string) => void;
}

const birdImages: { [key: string]: string } = {
  'Eurasian Blue Tit': eurasianbluetitImg,  
  'Eurasian Magpie': eurasianmagpieImg,
  'Duck': duckImg,
  'Great Tit': greattitImg,
  'Chicken': chickenImg,
  'Common Chaffinch': commonchaffinchImg,
  'Turkey': turkeyImg,
  'European Robin': europeanrobinImg,
  'House Sparrow': housesparrowImg,
  'Goose': gooseImg,
  'Blackbird': blackbirdImg,
  'Barn Swallow': barnswallowImg
};

const getBirdImage = (species: string) => {
  return birdImages[species] || placeholderbirdImg;
};

const Filters: React.FC<FiltersProps> = ({
  selectedSpecies,
  uniqueSpecies,
  onSpeciesChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`fixed top-16 left-0 bottom-0 bg-gray-900 bg-opacity-80 shadow-lg transition-all duration-300 ease-in-out z-30 ${
        isOpen ? 'w-80' : 'w-10'
      }`}
    >
      <button
        className={`absolute top-2 ${isOpen ? '-right-10' : 'left-0'} p-2 bg-gray-700 rounded-r-md hover:bg-gray-600 transition-colors duration-200 text-white`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
      {isOpen && (
        <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-white mt-8">Bird Species</h2>
          <div className="grid grid-cols-2 gap-4">
            {uniqueSpecies.map(species => (
              <div key={species} className="relative">
                <button
                  onClick={() => onSpeciesChange(species)}
                  className={`w-full aspect-square rounded-lg overflow-hidden shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none ${
                    selectedSpecies.includes(species) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={getBirdImage(species)}
                      alt={species}
                      className={`w-full h-full object-cover transition-all duration-200`}
                    />
                    <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${
                      selectedSpecies.includes(species) ? 'opacity-0' : 'opacity-50'
                    }`}></div>
                  </div>
                  <div className="absolute inset-0 flex items-end p-2">
                    <span className="text-white text-sm font-medium truncate drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                      {species}
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
