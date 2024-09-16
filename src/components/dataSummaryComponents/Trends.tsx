import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'react-feather';
import { DataPoint } from '../../types/DataPoint';

interface TrendsProps {
  filteredData: DataPoint[];
  dateRange: [Date, Date];
  trendPeriod: '10' | '50' | '100' | '500';
  setTrendPeriod: React.Dispatch<React.SetStateAction<'10' | '50' | '100' | '500'>>;
}

const Trends: React.FC<TrendsProps> = ({ filteredData, dateRange, trendPeriod, setTrendPeriod }) => {
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const getTrendData = React.useMemo(() => {
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

  return (
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
  );
};

export default React.memo(Trends);