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
import { SCROLLBAR_COLORS, STRAIN_COLORS } from '../constants/colors';

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
  onClearFilters: () => void;
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
  onClearFilters,
}) => {
  const hasSelection = selectedSpecies.length + selectedStrains.length + selectedProvenances.length > 0;
  return (
    <div className="p-4 text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-200">Filters</h2>
        {/* aria-disabled, not disabled: a disabled button drops keyboard focus right after it's used */}
        <button
          onClick={() => hasSelection && onClearFilters()}
          aria-disabled={!hasSelection}
          className="text-sm text-blue-400 hover:underline aria-disabled:text-gray-500 aria-disabled:no-underline aria-disabled:cursor-default rounded-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          Clear filters
        </button>
      </div>
      <div className="space-y-4 grow overflow-y-auto pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: SCROLLBAR_COLORS.Colors
      }}>
        <section>
          <h3 className="text-sm font-medium mb-2 text-gray-300">Bird species</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-1 2xl:grid-cols-2 gap-2">
            {uniqueSpecies.map(species => (
              <button
                key={species}
                onClick={() => onSpeciesChange(species)}
                aria-pressed={selectedSpecies.includes(species)}
                className={`flex items-center p-2 ${toggleClass(selectedSpecies.includes(species))}`}
              >
                <img
                  src={birdImages[species] || placeholderbirdImg}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 shrink-0 object-cover rounded-full mr-2"
                />
                <span className="text-sm text-left leading-tight">
                  {species}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-700 pt-3">
          <h3 className="text-sm font-medium mb-2 text-gray-300">Virus strains</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2">
            {uniqueStrains.map(strain => (
              <button
                key={strain}
                onClick={() => onStrainChange(strain)}
                aria-pressed={selectedStrains.includes(strain)}
                className={`flex items-center justify-center px-3 py-2 text-sm ${toggleClass(selectedStrains.includes(strain))}`}
              >
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: STRAIN_COLORS[strain as keyof typeof STRAIN_COLORS] }}
                />
                {strain}
              </button>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-700 pt-3">
          <h3 className="text-sm font-medium mb-2 text-gray-300">Provenance</h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueProvenances.map(provenance => (
              <button
                key={provenance}
                onClick={() => onProvenanceChange(provenance)}
                aria-pressed={selectedProvenances.includes(provenance)}
                className={`px-3 py-2 text-sm ${toggleClass(selectedProvenances.includes(provenance))}`}
              >
                {provenance}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Selected toggles get a light border as well as the fill, so state isn't shown by colour alone
const toggleClass = (selected: boolean) =>
  `rounded border-2 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
    selected ? 'bg-blue-600 border-blue-200 hover:bg-blue-700' : 'bg-gray-700 border-transparent hover:bg-gray-600'
  }`;

export default Filters;
