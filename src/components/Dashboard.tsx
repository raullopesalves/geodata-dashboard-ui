import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import GraphView from './GraphView';
import TimelineView from './TimelineView';

interface DataPoint {
  latitude: number;
  longitude: number;
  species: string;
  H5N1: number;
  H5N2: number;
  H7N2: number;
  H7N8: number;
  timestamp: string;
  provenance: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);

  // ... (keep the addDebugInfo function and data fetching useEffect)

  useEffect(() => {
    if (data.length > 0) {
      const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setDateRange([new Date(sortedData[0].timestamp), new Date(sortedData[sortedData.length - 1].timestamp)]);
      setFilteredData(sortedData);
    }
  }, [data]);

  const handleDateRangeChange = (newRange: [Date, Date]) => {
    setDateRange(newRange);
    setFilteredData(data.filter(point => {
      const date = new Date(point.timestamp);
      return date >= newRange[0] && date <= newRange[1];
    }));
  };

  return (
    <div className="h-full relative">
      {/* Full-screen map (background) */}
      <div className="absolute inset-0 z-0">
        <GraphView data={filteredData} />
      </div>

      {/* Overlay components */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Floating components */}
        <div className="absolute top-4 left-4 w-64 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg pointer-events-auto">
          <h2 className="text-xl font-semibold mb-2">Data Summary</h2>
          <p>Total data points: {filteredData.length}</p>
          <p>Date range: {dateRange[0].toDateString()} - {dateRange[1].toDateString()}</p>
        </div>

        <div className="absolute top-4 right-4 w-64 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg pointer-events-auto">
          <h2 className="text-xl font-semibold mb-2">Recent Reports</h2>
          <ul className="space-y-2">
            {filteredData.slice(0, 5).map((item, index) => (
              <li key={index} className="text-sm">
                <span className="font-semibold">{item.timestamp}</span>: {item.H5N1 + item.H5N2 + item.H7N2 + item.H7N8} cases
              </li>
            ))}
          </ul>
        </div>

        {/* Collapsible timeline */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 transition-all duration-300 ease-in-out pointer-events-auto ${isTimelineOpen ? 'h-64' : 'h-12'}`}>
          <button 
            className="w-full h-12 bg-gray-200 text-center"
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          >
            {isTimelineOpen ? 'Collapse Timeline' : 'Expand Timeline'}
          </button>
          {isTimelineOpen && (
            <div className="p-4 h-52">
              <TimelineView data={filteredData} dateRange={dateRange} onRangeChange={handleDateRangeChange} />
            </div>
          )}
        </div>

        {/* Debug information button */}
        <button
          className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded pointer-events-auto"
          onClick={() => setIsDebugVisible(!isDebugVisible)}
        >
          {isDebugVisible ? 'Hide' : 'Show'} Debug Info
        </button>
        
        {isDebugVisible && (
          <div className="absolute bottom-16 right-4 w-96 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg overflow-auto max-h-96 pointer-events-auto">
            <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
            <pre className="text-xs">
              {debugInfo.join('\n')}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;