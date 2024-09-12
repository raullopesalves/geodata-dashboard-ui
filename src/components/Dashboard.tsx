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

  return (
    <div className="h-full w-full relative bg-gray-900 bg-opacity-80">
      <div className="absolute inset-0 z-0">
        <GraphView data={filteredData} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Filters
          selectedSpecies={selectedSpecies}
          uniqueSpecies={getUniqueSpecies(data)}
          onSpeciesChange={handleSpeciesChange}
        />

        <DataSummary filteredData={filteredData} dateRange={dateRange} />

        <div className={`absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 transition-all duration-300 ease-in-out pointer-events-auto z-20 ${isTimelineOpen ? 'h-64' : 'h-12'}`}>
          <button 
            className="w-full h-12 bg-gray-800 flex justify-center items-center text-white"
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          >
            {isTimelineOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
          {isTimelineOpen && (
            <div className="p-4 h-52">
              <TimelineView data={filteredData} dateRange={dateRange} onRangeChange={handleDateRangeChange} />
            </div>
          )}
        </div>

        {error && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-red-900 bg-opacity-80 text-white p-4 rounded shadow-md z-40">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;