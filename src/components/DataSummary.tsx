import React from 'react';

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

interface DataSummaryProps {
  filteredData: DataPoint[];
  dateRange: [Date, Date];
}

const DataSummary: React.FC<DataSummaryProps> = ({ filteredData, dateRange }) => {
  const recentReports = filteredData.slice(0, 5);

  return (
    <div className="absolute top-24 right-4 w-64 space-y-4">
      <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg pointer-events-auto">
        <h2 className="text-xl font-semibold mb-2">Data Summary</h2>
        <p>Total data points: {filteredData.length}</p>
        <p>Date range: {dateRange[0].toDateString()} - {dateRange[1].toDateString()}</p>
      </div>

      <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg pointer-events-auto">
        <h2 className="text-xl font-semibold mb-2">Recent Reports</h2>
        <ul className="space-y-2">
          {recentReports.map((item, index) => (
            <li key={index} className="text-sm">
              <span className="font-semibold">{new Date(item.timestamp).toLocaleDateString()}</span>: {item.H5N1 + item.H5N2 + item.H7N2 + item.H7N8} cases of {item.species}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataSummary;