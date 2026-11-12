import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint } from '../../types/DataPoint';
import Trends from './Trends';
import RecentReports from './RecentReports';
import { SCROLLBAR_COLORS, STRAIN_COLORS, WILD_LIVESTOCK_CHART_COLORS } from '../../constants/colors';

type Slice = { name: string; value: number; color: string };

// Percentage pie; slice borders off so a 100% slice has no seam
const SharePie: React.FC<{ data: Slice[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" stroke="none" outerRadius={52}>
        {data.map((d) => <Cell key={d.name} fill={d.color} />)}
      </Pie>
      <Legend
        verticalAlign="top"
        iconType="square"
        iconSize={10}
        formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
      />
      <Tooltip
        formatter={(value) => `${Number(value).toFixed(2)}%`}
        contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: 6 }}
        itemStyle={{ color: '#e5e7eb' }}
      />
    </PieChart>
  </ResponsiveContainer>
);

interface DataSummaryProps {
  filteredData: DataPoint[];
  dateRange: [Date, Date];
  selectedStrains?: string[];
}

const DataSummary: React.FC<DataSummaryProps> = ({ filteredData, dateRange, selectedStrains = [] }) => {
  const [trendPeriod, setTrendPeriod] = useState<'10' | '50' | '100' | '500'>('10');

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

  const wildVsLivestockSlices: Slice[] = [
    { name: 'Wild', value: wildVsLivestockData.wild, color: WILD_LIVESTOCK_CHART_COLORS.Wild },
    { name: 'Livestock', value: wildVsLivestockData.livestock, color: WILD_LIVESTOCK_CHART_COLORS.Livestock },
  ];

  const strainSlices: Slice[] = (['H5N1', 'H5N2', 'H7N2', 'H7N8'] as const).map((strain) => ({
    name: strain,
    value: virusVariantData[strain],
    color: STRAIN_COLORS[strain],
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow grid grid-cols-1 gap-3" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: SCROLLBAR_COLORS.Colors
    }}>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Total Cases</h3>
          <p className="text-3xl font-bold text-white">{totalCases}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Year Range</h3>
          <p className="text-white text-2xl font-bold whitespace-nowrap">{dateRange[0].getFullYear()}–{dateRange[1].getFullYear()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Unique Species</h3>
          <p className="text-3xl font-bold text-white">{uniqueSpecies}</p>
        </div>
      </div>

      <Trends
        filteredData={filteredData}
        dateRange={dateRange}
        selectedStrains={selectedStrains}
        trendPeriod={trendPeriod}
        setTrendPeriod={setTrendPeriod}
      />

      <RecentReports filteredData={filteredData}/>

      {/* Pie Charts */}
      {filteredData.length === 0 ? (
        <p className="bg-gray-900 p-4 rounded-lg text-gray-300">No reports match the current filters.</p>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Wild vs Livestock</h3>
          <div className="h-40">
            <SharePie data={wildVsLivestockSlices} />
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Virus Strains</h3>
          <div className="h-40">
            <SharePie data={strainSlices} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default React.memo(DataSummary);