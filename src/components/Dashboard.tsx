import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import GraphView from './GraphView';
import TimelineView from './TimelineView';
import Filters from './Filters';
import DataSummary from './dataSummaryComponents/DataSummary';
import Footer from './Footer';
import { parseCSV, filterData, getUniqueSpecies, getUniqueStrains, getUniqueProvenances, parseCustomDate } from '../utils/dataUtils';
import { DataPoint } from '../types/DataPoint';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const initialDateRangeRef = useRef<[Date, Date] | null>(null);

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
          if (initialDateRangeRef.current === null) {
            initialDateRangeRef.current = [startDate, endDate];
          }
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
    return filterData(
      data,
      filters.dateRange,
      filters.selectedSpecies,
      filters.selectedStrains,
      filters.selectedProvenances
    );
  }, [data, filters]);

  const timelineData = useMemo(() => {
    // Filter data with all filters except date range
    return filterData(
      data,
      initialDateRangeRef.current || [new Date(0), new Date()],
      filters.selectedSpecies,
      filters.selectedStrains,
      filters.selectedProvenances
    );
  }, [data, filters.selectedSpecies, filters.selectedStrains, filters.selectedProvenances]);

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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-900 text-white overflow-hidden">
      <div className="flex flex-1 pb-4 pl-4 pr-4 space-x-4 overflow-hidden">
        <aside className="w-1/5 bg-gray-800 overflow-y-auto">
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
        
        <main className="flex-1 flex flex-col space-y-4 overflow-hidden w">
          <div className="flex-1 bg-gray-800 overflow-hidden">
            <GraphView data={filteredData} />
          </div>

          <div className="h-fit bg-gray-800 overflow-hidden">
            <TimelineView 
              data={timelineData}
              dateRange={filters.dateRange}
              initialDateRange={initialDateRangeRef.current || filters.dateRange}
              onRangeChange={handleDateRangeChange} 
            />
          </div>
        </main>

        <aside className="w-1/3 bg-gray-800 overflow-y-auto">
          <DataSummary filteredData={filteredData} dateRange={filters.dateRange} />
        </aside>
      </div>

      <Footer
        dataLength={data.length}
        filteredDataLength={filteredData.length}
        dateRange={filters.dateRange}
        selectedSpecies={filters.selectedSpecies}
        selectedStrains={filters.selectedStrains}
        selectedProvenances={filters.selectedProvenances}
      />
    </div>
  );
};

export default Dashboard;