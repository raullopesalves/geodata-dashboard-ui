import React, { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, ChartData } from 'chart.js';
import { ArrowUpRight, ArrowDownRight, Minus } from 'react-feather';
import { DataPoint } from '../types/DataPoint';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface DataSummaryProps {
  filteredData: DataPoint[];
  dateRange: [Date, Date];
}

const DataSummary: React.FC<DataSummaryProps> = ({ filteredData, dateRange }) => {
  const [trendPeriod, setTrendPeriod] = useState<'10' | '50' | '100' | '500'>('50');

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const totalCases = useMemo(() => filteredData.reduce((sum, point) =>
    sum + point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8, 0
  ), [filteredData]);

  const uniqueSpecies = useMemo(() => 
    new Set(filteredData.map(point => point.species)).size
  , [filteredData]);

  const getTrendData = useMemo(() => {
    const endDate = dateRange[1];
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - parseInt(trendPeriod));

    const trendData = filteredData
      .filter(d => {
        const date = parseDate(d.timestamp);
        return date >= startDate && date <= endDate;
      })
      .reduce((acc, curr) => {
        ['H5N1', 'H5N2', 'H7N2', 'H7N8'].forEach(variant => {
          if (!acc[variant]) acc[variant] = { current: 0, previous: 0 };
          acc[variant].current += curr[variant as keyof DataPoint] as number;
        });
        return acc;
      }, {} as Record<string, { current: number; previous: number }>);

    // Calculate previous period data
    const previousStartDate = new Date(startDate);
    previousStartDate.setFullYear(previousStartDate.getFullYear() - parseInt(trendPeriod));
    filteredData
      .filter(d => {
        const date = parseDate(d.timestamp);
        return date >= previousStartDate && date < startDate;
      })
      .forEach(curr => {
        ['H5N1', 'H5N2', 'H7N2', 'H7N8'].forEach(variant => {
          if (trendData[variant]) {
            trendData[variant].previous += curr[variant as keyof DataPoint] as number;
          }
        });
      });

    return Object.entries(trendData).map(([variant, { current, previous }]) => {
      const change = current - previous;
      const percentageChange = previous !== 0 ? (change / previous) * 100 : 0;
      return {
        variant,
        count: Math.abs(change),
        percentage: Math.abs(percentageChange),
        isIncrease: change > 0
      };
    });
  }, [filteredData, dateRange, trendPeriod]);

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
            value={trendPeriod}
            onChange={(e) => setTrendPeriod(e.target.value as '10' | '50' | '100' | '500')}
            className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
          >
            <option value="10">Last 10 years</option>
            <option value="50">Last 50 years</option>
            <option value="100">Last 100 years</option>
            <option value="500">Last 500 years</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getTrendData.map(({ variant, count, percentage, isIncrease }) => (
            <div key={variant} className="bg-gray-700 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-white">{variant}</span>
                <span className={`text-xs ${count === 0 ? 'text-gray-400' : isIncrease ? 'text-red-400' : 'text-green-400'}`}>
                  {count === 0 ? <Minus size={16} /> : isIncrease ? <ArrowUpRight /> : <ArrowDownRight />}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className={`text-sm ${count === 0 ? 'text-gray-400' : isIncrease ? 'text-red-400' : 'text-green-400'}`}>
                  {count === 0 ? '-' : (isIncrease ? '+' : '-') + count}
                </span>
                <span className={`text-sm ${count === 0 ? 'text-gray-400' : isIncrease ? 'text-red-400' : 'text-green-400'}`}>
                  {percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {/* Recent Reports */}
      <div className="bg-gray-900 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Recent Reports</h3>
        <div className="h-48 overflow-y-auto pr-2" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937'
        }}>
          <ul className="space-y-2">
            {filteredData
              .sort((a, b) => parseDate(b.timestamp).getTime() - parseDate(a.timestamp).getTime())
              .slice(0, 10)
              .map((report, index) => (
                <li key={index} className="bg-gray-800 p-2 rounded-md">
                  <p className="text-white text-sm">
                    <strong>Date:</strong> {report.timestamp} <br />
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

export default React.memo(DataSummary);