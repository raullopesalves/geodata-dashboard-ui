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
  'Goose': gooseImg
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
    <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="space-y-6">
        {/* Bird Species */}
        <div>
          <h3 className="font-semibold mb-2">Bird Species</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueSpecies.map(species => (
              <button
                key={species}
                onClick={() => onSpeciesChange(species)}
                className={`relative flex items-center p-2 rounded transition-transform transform hover:scale-105  ${
                  selectedSpecies.includes(species) ? 'bg-blue-600' : 'bg-gray-700'
                } hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
              >
                <img 
                  src={birdImages[species] || placeholderbirdImg} 
                  alt={species} 
                  className="w-6 h-6 object-cover rounded-full mr-2"
                />
                <span className="text-xs">{species}</span>
                <span className="absolute inset-0 bg-blue-100 opacity-0 rounded-full transition-opacity duration-300 ease-in-out" />
              </button>
            ))}
          </div>
        </div>
        
        {/* Virus Strains */}
        <div>
          <h3 className="font-semibold mb-2">Virus Strains</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueStrains.map(strain => (
              <button
                key={strain}
                onClick={() => onStrainChange(strain)}
                className={`relative px-3 py-1 rounded transition-transform transform hover:scale-105 ${
                  selectedStrains.includes(strain) ? 'bg-green-600' : 'bg-gray-700'
                } hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50`}
              >
                {strain}
                <span className="absolute inset-0 bg-green-100 opacity-0 rounded-full transition-opacity duration-300 ease-in-out" />
              </button>
            ))}
          </div>
        </div>

        {/* Provenance */}
        <div>
          <h3 className="font-semibold mb-2">Provenance</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueProvenances.map(provenance => (
              <button
                key={provenance}
                onClick={() => onProvenanceChange(provenance)}
                className={`relative px-3 py-1 rounded transition-transform transform hover:scale-105  ${
                  selectedProvenances.includes(provenance) ? 'bg-yellow-600' : 'bg-gray-700'
                } hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50`}
              >
                {provenance}
                <span className="absolute inset-0 bg-yellow-100 opacity-0 rounded-full transition-opacity duration-300 ease-in-out" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
