import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint } from '../../types/DataPoint';
import Trends from './Trends';
import RecentReports from './RecentReports';
import { SCROLLBAR_COLORS, STRAIN_COLORS, WILD_LIVESTOCK_CHART_COLORS } from '../../constants/colors';
import { prefersReducedMotion } from '../../utils/motion';

type Slice = { name: string; value: number; color: string };

// Percentage pie. Slices get a dark divider, except a lone 100% slice (it would show a seam)
const SharePie: React.FC<{ data: Slice[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={52}
        stroke={data.filter((d) => d.value > 0).length > 1 ? '#111827' : 'none'}
        strokeWidth={2}
        isAnimationActive={!prefersReducedMotion}
      >
        {data.map((d) => <Cell key={d.name} fill={d.color} />)}
      </Pie>
      <Legend
        verticalAlign="top"
        iconType="square"
        iconSize={10}
        // Percentages in the legend, not only in the hover tooltip
        formatter={(value, entry) => (
          <span className="text-xs text-gray-300">
            {value} {Math.round((entry.payload as unknown as Slice | undefined)?.value ?? 0)}%
          </span>
        )}
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
  // Totals before filtering, to show "832 of 6,967"
  allCases?: number;
  allSpecies?: number;
}

const DataSummary: React.FC<DataSummaryProps> = ({ filteredData, dateRange, selectedStrains = [], allCases, allSpecies }) => {
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

  const empty = totalCases === 0;
  const ofTotal = (n: number, all?: number) =>
    all !== undefined && all !== n ? <span className="text-base font-normal text-gray-400"> of {all.toLocaleString('en-GB')}</span> : null;

  return (
    <div className="p-4 grid grid-cols-1 gap-3" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: SCROLLBAR_COLORS.Colors
    }}>
      <h2 className="sr-only">Summary</h2>
      {/* Announces filter results to screen readers */}
      <p role="status" className="sr-only">
        {totalCases.toLocaleString('en-GB')} cases match the current filters
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm font-medium text-gray-400">Cases</p>
          <p className="text-3xl font-bold text-white tabular-nums">{totalCases.toLocaleString('en-GB')}{ofTotal(totalCases, allCases)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Species</p>
          <p className="text-3xl font-bold text-white tabular-nums">{uniqueSpecies}{ofTotal(uniqueSpecies, allSpecies)}</p>
        </div>
      </div>

      <Trends
        filteredData={filteredData}
        dateRange={dateRange}
        selectedStrains={selectedStrains}
        trendPeriod={trendPeriod}
        setTrendPeriod={setTrendPeriod}
      />

      {empty ? (
        <p className="bg-gray-900 p-4 rounded-lg text-gray-300">No reports match these filters. Clear some to see more.</p>
      ) : (
        <>
          <RecentReports filteredData={filteredData}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">Provenance</h3>
              <div className="h-40">
                <SharePie data={wildVsLivestockSlices} />
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">Virus strains</h3>
              <div className="h-40">
                <SharePie data={strainSlices} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(DataSummary);