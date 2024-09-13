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
        <div>
          <h3 className="font-semibold mb-2">Bird Species</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueSpecies.map(species => (
              <button
                key={species}
                onClick={() => onSpeciesChange(species)}
                className={`flex items-center p-1 rounded ${
                  selectedSpecies.includes(species) ? 'bg-blue-600' : 'bg-gray-700'
                } hover:bg-blue-500 transition-colors`}
              >
                <img 
                  src={birdImages[species] || placeholderbirdImg} 
                  alt={species} 
                  className="w-6 h-6 object-cover rounded-full mr-1"
                />
                <span className="text-xs">{species}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Virus Strains</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueStrains.map(strain => (
              <button
                key={strain}
                onClick={() => onStrainChange(strain)}
                className={`px-2 py-1 rounded ${
                  selectedStrains.includes(strain) ? 'bg-green-600' : 'bg-gray-700'
                } hover:bg-green-500 transition-colors`}
              >
                {strain}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Provenance</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueProvenances.map(provenance => (
              <button
                key={provenance}
                onClick={() => onProvenanceChange(provenance)}
                className={`px-2 py-1 rounded ${
                  selectedProvenances.includes(provenance) ? 'bg-yellow-600' : 'bg-gray-700'
                } hover:bg-yellow-500 transition-colors`}
              >
                {provenance}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;