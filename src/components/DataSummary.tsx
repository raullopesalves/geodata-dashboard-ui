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
  const totalCases = filteredData.reduce((sum, point) => 
    sum + point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8, 0
  );

  const uniqueSpecies = new Set(filteredData.map(point => point.species)).size;
  const uniqueProvenances = new Set(filteredData.map(point => point.provenance)).size;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Total Cases</h3>
        <p className="text-3xl font-bold text-white">{totalCases}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Date Range</h3>
        <p className="text-white">{dateRange[0].toLocaleDateString()} - {dateRange[1].toLocaleDateString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Unique Species</h3>
        <p className="text-3xl font-bold text-white">{uniqueSpecies}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Unique Provenances</h3>
        <p className="text-3xl font-bold text-white">{uniqueProvenances}</p>
      </div>
    </div>
  );
};

export default DataSummary;