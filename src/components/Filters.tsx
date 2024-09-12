import React from 'react';
import { Filter } from 'react-feather';

interface FiltersProps {
  isOpen: boolean;
  toggleOpen: () => void;
  selectedSpecies: string[];
  uniqueSpecies: string[];
  onSpeciesChange: (species: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  isOpen,
  toggleOpen,
  selectedSpecies,
  uniqueSpecies,
  onSpeciesChange
}) => {
  return (
    <div className={`absolute top-24 left-0 h-full bg-white bg-opacity-90 shadow-lg transition-all duration-300 ease-in-out pointer-events-auto ${isOpen ? 'w-64' : 'w-12'}`}>
      <button
        className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full"
        onClick={toggleOpen}
      >
        <Filter size={20} />
      </button>
      {isOpen && (
        <div className="p-4 mt-12">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          {uniqueSpecies.map(species => (
            <div key={species} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={species}
                checked={selectedSpecies.includes(species)}
                onChange={() => onSpeciesChange(species)}
                className="mr-2"
              />
              <label htmlFor={species}>{species}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;