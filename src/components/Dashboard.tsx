import React, { useEffect, useState } from 'react';
import GraphView from './GraphView';
import TimelineView from './TimelineView';
import Filters from './Filters';
import DataSummary from './DataSummary';
import { parseCSV, filterData, getUniqueSpecies, getUniqueStrains, getUniqueProvenances, DataPoint } from '../services/dataUtils';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedStrains, setSelectedStrains] = useState<string[]>([]);
  const [selectedProvenances, setSelectedProvenances] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedData = await parseCSV('/fake_bird_data_switzerland_v2.csv');
        setData(parsedData);
        const sortedData = [...parsedData].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setDateRange([new Date(sortedData[0].timestamp), new Date(sortedData[sortedData.length - 1].timestamp)]);
        setFilteredData(sortedData);
      } catch (error) {
        setError(`Error fetching data: ${error}`);
      }
    };

    fetchData();
  }, []);

  const handleDateRangeChange = (newRange: [Date, Date]) => {
    setDateRange(newRange);
    applyFilters(selectedSpecies, selectedStrains, selectedProvenances, newRange);
  };

  const handleSpeciesChange = (species: string) => {
    const updatedSpecies = selectedSpecies.includes(species)
      ? selectedSpecies.filter(s => s !== species)
      : [...selectedSpecies, species];
    setSelectedSpecies(updatedSpecies);
    applyFilters(updatedSpecies, selectedStrains, selectedProvenances, dateRange);
  };

  const handleStrainChange = (strain: string) => {
    const updatedStrains = selectedStrains.includes(strain)
      ? selectedStrains.filter(s => s !== strain)
      : [...selectedStrains, strain];
    setSelectedStrains(updatedStrains);
    applyFilters(selectedSpecies, updatedStrains, selectedProvenances, dateRange);
  };

  const handleProvenanceChange = (provenance: string) => {
    const updatedProvenances = selectedProvenances.includes(provenance)
      ? selectedProvenances.filter(p => p !== provenance)
      : [...selectedProvenances, provenance];
    setSelectedProvenances(updatedProvenances);
    applyFilters(selectedSpecies, selectedStrains, updatedProvenances, dateRange);
  };

  const applyFilters = (species: string[], strains: string[], provenances: string[], range: [Date, Date]) => {
    setFilteredData(filterData(data, range, species, strains, provenances));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-1 pb-4">
        {/* Filters */}
        <aside className="w-1/10 bg-gray-800 ml-4">
          <Filters
            selectedSpecies={selectedSpecies}
            uniqueSpecies={getUniqueSpecies(data)}
            selectedStrains={selectedStrains}
            uniqueStrains={getUniqueStrains(data)}
            selectedProvenances={selectedProvenances}
            uniqueProvenances={getUniqueProvenances(data)}
            onSpeciesChange={handleSpeciesChange}
            onStrainChange={handleStrainChange}
            onProvenanceChange={handleProvenanceChange}
          />
        </aside>
        
        {/* Main Content */}
        <main className="w-1/2 flex flex-col px-4">
          {/* Graph View */}
          <div className="flex-1 bg-gray-800">
            <GraphView data={filteredData} />
          </div>

          {/* Timeline View */}
          <div className="bg-gray-800">
            <TimelineView data={filteredData} dateRange={dateRange} onRangeChange={handleDateRangeChange} />
          </div>
        </main>

        {/* Data Summary */}
        <aside className="w-auto bg-gray-800">
          <DataSummary filteredData={filteredData} dateRange={dateRange} />
        </aside>
      </div>

      {/* Bottom Padding */}
      <div className="h-16 bg-gray-900"></div>
    </div>
  );
};

export default Dashboard;
