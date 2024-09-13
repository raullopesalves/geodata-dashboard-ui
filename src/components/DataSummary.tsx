import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ArrowUpRight, ArrowDownRight } from 'react-feather';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

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

const mockTrendData = {
  'Last 7 Days': { H5N1: 150, H5N2: 120, H7N2: 80, H7N8: 60 },
  'Last 30 Days': { H5N1: 500, H5N2: 400, H7N2: 300, H7N8: 200 },
  'Last 6 Months': { H5N1: 2000, H5N2: 1600, H7N2: 1200, H7N8: 800 },
};

const mockPieData = {
  wild: 60,
  livestock: 40,
};

const mockVariantData = {
  H5N1: 40,
  H5N2: 30,
  H7N2: 20,
  H7N8: 10,
};

const DataSummary: React.FC<DataSummaryProps> = ({ filteredData, dateRange }) => {
  const totalCases = filteredData.reduce((sum, point) =>
    sum + point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8, 0
  );

  const uniqueSpecies = new Set(filteredData.map(point => point.species)).size;

  const [timeframe, setTimeframe] = useState<'Last 7 Days' | 'Last 30 Days' | 'Last 6 Months'>('Last 7 Days');

  const trendData = mockTrendData[timeframe];
  const totalTrendCases = Object.values(trendData).reduce((sum, count) => sum + count, 0);

  const trendEntries = Object.entries(trendData);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow grid grid-cols-1 gap-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
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
      </div>

      {/* Trends Section */}
      <div className="bg-gray-900 p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-300 flex-1">Trends</h3>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as 'Last 7 Days' | 'Last 30 Days' | 'Last 6 Months')}
            className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 6 Months">Last 6 Months</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendEntries.map(([variant, count]) => {
            const percentage = ((count / totalTrendCases) * 100).toFixed(2);
            const isIncrease = count >= 0;
            return (
              <div key={variant} className="bg-gray-700 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-white">{variant}</span>
                  <span className={`text-xs ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                    {isIncrease ? <ArrowDownRight /> : <ArrowUpRight />}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-white">{count}</span>
                  <span className={`text-sm ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Wild vs Livestock</h3>
          <div className="h-40">
            <Pie
              data={{
                labels: ['Wild', 'Livestock'],
                datasets: [{
                  data: Object.values(mockPieData),
                  backgroundColor: ['#4ade80', '#f87171'],
                }],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Virus Strains</h3>
          <div className="h-40">
            <Pie
              data={{
                labels: ['H5N1', 'H5N2', 'H7N2', 'H7N8'],
                datasets: [{
                  data: Object.values(mockVariantData),
                  backgroundColor: ['#4ade80', '#f87171', '#fbbf24', '#60a5fa'],
                }],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} cases`,
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-gray-900 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Recent Reports</h3>
        <div className="h-48 overflow-y-auto">
          <ul className="space-y-2">
            {filteredData.slice(-5).map((report, index) => (
              <li key={index} className="bg-gray-800 p-2 rounded-md">
                <p className="text-white text-sm">
                  <strong>Species:</strong> {report.species} <br />
                  <strong>Provenance:</strong> {report.provenance} <br />
                  <strong>Cases:</strong> H5N1: {report.H5N1}, H5N2: {report.H5N2}, H7N2: {report.H7N2}, H7N8: {report.H7N8}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;
