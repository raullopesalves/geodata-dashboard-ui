import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'react-feather';
import GraphView from './GraphView';
import TimelineView from './TimelineView';
import Filters from './Filters';
import DataSummary from './DataSummary';
import { parseCSV, filterData, getUniqueSpecies, DataPoint } from '../services/dataUtils';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedData = await parseCSV('/fake_bird_data_switzerland_v2.csv');
        setData(parsedData);
        const sortedData = [...parsedData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setDateRange([new Date(sortedData[sortedData.length - 1].timestamp), new Date(sortedData[0].timestamp)]);
        setFilteredData(sortedData);
      } catch (error) {
        setError(`Error fetching data: ${error}`);
      }
    };

    fetchData();
  }, []);

  const handleDateRangeChange = (newRange: [Date, Date]) => {
    setDateRange(newRange);
    setFilteredData(filterData(data, newRange, selectedSpecies));
  };

  const handleSpeciesChange = (species: string) => {
    const updatedSpecies = selectedSpecies.includes(species)
      ? selectedSpecies.filter(s => s !== species)
      : [...selectedSpecies, species];
    setSelectedSpecies(updatedSpecies);
    setFilteredData(filterData(data, dateRange, updatedSpecies));
  };

  const uniqueSpecies = getUniqueSpecies(data);

  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0 z-0">
        <GraphView data={filteredData} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Filters
          isOpen={isFilterDrawerOpen}
          toggleOpen={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          selectedSpecies={selectedSpecies}
          uniqueSpecies={uniqueSpecies}
          onSpeciesChange={handleSpeciesChange}
        />

        <DataSummary filteredData={filteredData} dateRange={dateRange} />

        <div className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 transition-all duration-300 ease-in-out pointer-events-auto ${isTimelineOpen ? 'h-64' : 'h-8'}`}>
          <button 
            className="w-full h-8 bg-gray-200 flex justify-center items-center"
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          >
            {isTimelineOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
          {isTimelineOpen && (
            <div className="p-4 h-56">
              <TimelineView data={filteredData} dateRange={dateRange} onRangeChange={handleDateRangeChange} />
            </div>
          )}
        </div>

        {error && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;