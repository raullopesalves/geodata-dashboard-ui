import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'react-feather';
import { DataPoint } from '../../types/DataPoint';

interface TrendsProps {
  filteredData: DataPoint[];
  dateRange: [Date, Date];
  selectedStrains: string[];
  trendPeriod: '10' | '50' | '100' | '500';
  setTrendPeriod: React.Dispatch<React.SetStateAction<'10' | '50' | '100' | '500'>>;
}

const Trends: React.FC<TrendsProps> = ({ filteredData, dateRange, selectedStrains, trendPeriod, setTrendPeriod }) => {
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

    return Object.entries(trendData)
      // Strains the user filtered out would only ever show "no change"
      .filter(([variant]) => selectedStrains.length === 0 || selectedStrains.includes(variant))
      .map(([variant, { current, previous }]) => {
        const change = current - previous;
        const sign = change > 0 ? '+' : change < 0 ? '−' : '';
        return {
          variant,
          change,
          countLabel: change === 0 ? '0' : `${sign}${Math.abs(change)}`,
          // No cases in the previous period: a percentage would be infinite
          percentLabel: change === 0 ? '0%' : previous === 0 ? 'new' : `${sign}${Math.abs((change / previous) * 100).toFixed(1)}%`,
        };
      });
  }, [filteredData, dateRange, selectedStrains, trendPeriod]);

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-sm">
      <div className="flex items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-200">Trends</h3>
          <p className="text-xs text-gray-400">Compared with the {trendPeriod} years before</p>
        </div>
        <select
          aria-label="Trend period"
          value={trendPeriod}
          onChange={(e) => setTrendPeriod(e.target.value as '10' | '50' | '100' | '500')}
          className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm border border-gray-500 hover:bg-gray-600 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <option value="10">Last 10 years</option>
          <option value="50">Last 50 years</option>
          <option value="100">Last 100 years</option>
          <option value="500">Last 500 years</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getTrendData.map(({ variant, change, countLabel, percentLabel }) => {
          // More cases = red, fewer = green (red-300/green-400/gray-300 keep 4.5:1 on gray-700); the arrow repeats it for colour-blind users
          const tone = change > 0 ? 'text-red-300' : change < 0 ? 'text-green-400' : 'text-gray-300';
          return (
            <div key={variant} className="bg-gray-700 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-white">{variant}</span>
                <span className={tone} aria-hidden="true">
                  {change === 0 ? <Minus size={16} /> : change > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </span>
              </div>
              <div className={`mt-1 flex items-center justify-between text-sm tabular-nums ${tone}`}>
                <span>{countLabel}</span>
                <span>{percentLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Trends);