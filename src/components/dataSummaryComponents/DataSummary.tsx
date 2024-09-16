import React, { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, ChartData } from 'chart.js';
import { DataPoint } from '../../types/DataPoint';
import Trends from './Trends';
import RecentReports from './RecentReports';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface DataSummaryProps {
  filteredData: DataPoint[];
  dateRange: [Date, Date];
}

const DataSummary: React.FC<DataSummaryProps> = ({ filteredData, dateRange }) => {
  const [trendPeriod, setTrendPeriod] = useState<'10' | '50' | '100' | '500'>('50');

  const totalCases = useMemo(() => filteredData.reduce((sum, point) =>
    sum + point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8, 0
  ), [filteredData]);

  const uniqueSpecies = useMemo(() => 
    new Set(filteredData.map(point => point.species)).size
  , [filteredData]);

  const wildVsLivestockData = useMemo(() => {
    const counts = filteredData.reduce(
      (acc, curr) => {
        if (curr.provenance.toLowerCase() === 'wild') {
          acc.wild++;
        } else {
          acc.livestock++;
        }
        return acc;
      },
      { wild: 0, livestock: 0 }
    );
    const total = counts.wild + counts.livestock;
    return {
      wild: (counts.wild / total) * 100,
      livestock: (counts.livestock / total) * 100
    };
  }, [filteredData]);

  const virusVariantData = useMemo(() => {
    const variantCounts = filteredData.reduce((acc, curr) => {
      ['H5N1', 'H5N2', 'H7N2', 'H7N8'].forEach(variant => {
        if (!acc[variant]) acc[variant] = 0;
        acc[variant] += curr[variant as keyof DataPoint] as number;
      });
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(variantCounts).reduce((sum, count) => sum + count, 0);
    return Object.entries(variantCounts).reduce((acc, [variant, count]) => {
      acc[variant] = (count / total) * 100;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredData]);

  const wildVsLivestockChartData: ChartData<'pie'> = {
    labels: ['Wild', 'Livestock'],
    datasets: [{
      data: Object.values(wildVsLivestockData),
      backgroundColor: ['#4ade80', '#f87171'],
    }],
  };

  const virusVariantChartData: ChartData<'pie'> = {
    labels: ['H5N1', 'H5N2', 'H7N2', 'H7N8'],
    datasets: [{
      data: Object.values(virusVariantData),
      backgroundColor: ['#4ade80', '#f87171', '#fbbf24', '#60a5fa'],
    }],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow grid grid-cols-1 gap-3">
      <div className="grid grid-cols-3 gap-4">
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

      <Trends
        filteredData={filteredData}
        dateRange={dateRange}
        trendPeriod={trendPeriod}
        setTrendPeriod={setTrendPeriod}
      />

      <RecentReports filteredData={filteredData}/>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Wild vs Livestock</h3>
          <div className="h-40">
            <Pie data={wildVsLivestockChartData} options={pieChartOptions} />
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Virus Strains</h3>
          <div className="h-40">
            <Pie data={virusVariantChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DataSummary);