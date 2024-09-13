import React, { useEffect, useState, useMemo, useCallback } from 'react';
import GraphView from './GraphView';
import TimelineView from './TimelineView';
import Filters from './Filters';
import DataSummary from './DataSummary';
import { parseCSV, filterData, getUniqueSpecies, getUniqueStrains, getUniqueProvenances, DataPoint, parseCustomDate } from '../services/dataUtils';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: [new Date(0), new Date()] as [Date, Date],
    selectedSpecies: [] as string[],
    selectedStrains: [] as string[],
    selectedProvenances: [] as string[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data...');
        const parsedData = await parseCSV('/fake_bird_data_switzerland_v2.csv');
        console.log('Parsed data:', parsedData.length, 'items');
        console.log('Sample data point:', parsedData[0]);
        setData(parsedData);
        
        if (parsedData.length > 0) {
          const dates = parsedData.map(item => parseCustomDate(item.timestamp)).filter(date => !isNaN(date.getTime()));
          const startDate = new Date(Math.min(...dates.map(Number)));
          const endDate = new Date(Math.max(...dates.map(Number)));
          
          console.log('Setting initial date range:', startDate, 'to', endDate);
          setFilters(prev => ({
            ...prev,
            dateRange: [startDate, endDate]
          }));
        } else {
          console.warn('No data found in the CSV file');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Error fetching data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    console.log('Filtering data with date range:', filters.dateRange.map(d => d.toISOString()));
    return filterData(
      data,
      filters.dateRange,
      filters.selectedSpecies,
      filters.selectedStrains,
      filters.selectedProvenances
    );
  }, [data, filters]);

  const handleDateRangeChange = useCallback((newRange: [Date, Date]) => {
    console.log('Date range changed:', newRange.map(d => d.toISOString()));
    setFilters(prev => ({ ...prev, dateRange: newRange }));
  }, []);

  const handleSpeciesChange = useCallback((species: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSpecies: prev.selectedSpecies.includes(species)
        ? prev.selectedSpecies.filter(s => s !== species)
        : [...prev.selectedSpecies, species]
    }));
  }, []);

  const handleStrainChange = useCallback((strain: string) => {
    setFilters(prev => ({
      ...prev,
      selectedStrains: prev.selectedStrains.includes(strain)
        ? prev.selectedStrains.filter(s => s !== strain)
        : [...prev.selectedStrains, strain]
    }));
  }, []);

  const handleProvenanceChange = useCallback((provenance: string) => {
    setFilters(prev => ({
      ...prev,
      selectedProvenances: prev.selectedProvenances.includes(provenance)
        ? prev.selectedProvenances.filter(p => p !== provenance)
        : [...prev.selectedProvenances, provenance]
    }));
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-1 pb-4">
        {/* Filters */}
        <aside className="w-1/10 bg-gray-800 ml-4">
          <Filters
            selectedSpecies={filters.selectedSpecies}
            uniqueSpecies={getUniqueSpecies(data)}
            selectedStrains={filters.selectedStrains}
            uniqueStrains={getUniqueStrains(data)}
            selectedProvenances={filters.selectedProvenances}
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
            <TimelineView 
              data={data}
              dateRange={filters.dateRange} 
              onRangeChange={handleDateRangeChange} 
            />
          </div>
        </main>

        {/* Data Summary */}
        <aside className="w-auto bg-gray-800 mr-4">
          <DataSummary filteredData={filteredData} dateRange={filters.dateRange} />
        </aside>
      </div>

      {/* Debug Information */}
      <div className="bg-gray-800 p-4 mt-4">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Total data points: {data.length}</p>
        <p>Filtered data points: {filteredData.length}</p>
        <p>Date range: {filters.dateRange[0].toISOString()} to {filters.dateRange[1].toISOString()}</p>
        <p>Selected Species: {filters.selectedSpecies.join(', ') || 'None'}</p>
        <p>Selected Strains: {filters.selectedStrains.join(', ') || 'None'}</p>
        <p>Selected Provenances: {filters.selectedProvenances.join(', ') || 'None'}</p>
      </div>
    </div>
  );
};

export default Dashboard;