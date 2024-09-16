import React from 'react';

// Import bird images
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
  selectedStrains: string[];
  uniqueStrains: string[];
  selectedProvenances: string[];
  uniqueProvenances: string[];
  onSpeciesChange: (species: string) => void;
  onStrainChange: (strain: string) => void;
  onProvenanceChange: (provenance: string) => void;
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

const Filters: React.FC<FiltersProps> = ({
  selectedSpecies,
  uniqueSpecies,
  selectedStrains,
  uniqueStrains,
  selectedProvenances,
  uniqueProvenances,
  onSpeciesChange,
  onStrainChange,
  onProvenanceChange,
}) => {
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow text-white h-full flex flex-col">
      <h2 className="text-xl font-bold mb-3 text-gray-300">Filters</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4B5563 #1F2937'
      }}>
        {/* Bird Species */}
        <div className="bg-gray-900 p-3 rounded-lg">
          <h3 className="text-base font-semibold mb-2 text-gray-300">Bird Species</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueSpecies.map(species => (
              <button
                key={species}
                onClick={() => onSpeciesChange(species)}
                className={`relative flex items-center p-2 rounded transition-colors ${
                  selectedSpecies.includes(species) ? 'bg-blue-600' : 'bg-gray-700'
                } hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
              >
                <img 
                  src={birdImages[species] || placeholderbirdImg} 
                  alt={species} 
                  className="w-7 h-7 object-cover rounded-full mr-2"
                />
                <span
                  className="text-sm truncate"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  title={species} // Tooltip for full species name
                >
                  {species}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Virus Strains */}
        <div className="bg-gray-900 p-3 rounded-lg">
          <h3 className="text-base font-semibold mb-2 text-gray-300">Virus Strains</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueStrains.map(strain => (
              <button
                key={strain}
                onClick={() => onStrainChange(strain)}
                className={`relative px-3 py-2 rounded transition-colors ${
                  selectedStrains.includes(strain) ? 'bg-green-600' : 'bg-gray-700'
                } hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50`}
              >
                <span
                  className="text-sm truncate"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  title={strain} // Tooltip for full strain name
                >
                  {strain}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Provenance */}
        <div className="bg-gray-900 p-3 rounded-lg">
          <h3 className="text-base font-semibold mb-2 text-gray-300">Provenance</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueProvenances.map(provenance => (
              <button
                key={provenance}
                onClick={() => onProvenanceChange(provenance)}
                className={`relative px-3 py-2 rounded transition-colors ${
                  selectedProvenances.includes(provenance) ? 'bg-yellow-600' : 'bg-gray-700'
                } hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50`}
              >
                <span
                  className="text-sm truncate"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  title={provenance} // Tooltip for full provenance name
                >
                  {provenance}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
