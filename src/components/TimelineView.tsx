import React, { useState, useMemo, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush } from 'recharts';

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

interface TimelineViewProps {
  data: DataPoint[];
  dateRange: [Date, Date];
  onRangeChange: (newRange: [Date, Date]) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ data, dateRange, onRangeChange }) => {
  const [grouping, setGrouping] = useState<'10y' | '50y' | '100y' | '500y'>('50y');

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const aggregatedData = useMemo(() => {
    const groupedData: { date: number; totalCases: number }[] = [];
    const groupSize = grouping === '10y' ? 10 : grouping === '50y' ? 50 : grouping === '100y' ? 100 : 500;

    data.forEach(point => {
      const date = parseDate(point.timestamp);
      if (isNaN(date.getTime())) {
        return;
      }

      const year = date.getFullYear();
      const groupedYear = Math.floor(year / groupSize) * groupSize;
      const existingEntry = groupedData.find(item => item.date === groupedYear);

      if (existingEntry) {
        existingEntry.totalCases += point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8;
      } else {
        groupedData.push({ date: groupedYear, totalCases: point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8 });
      }
    });

    return groupedData.sort((a, b) => a.date - b.date);
  }, [data, grouping]);

  const handleBrushChange = useCallback((brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      const startDate = new Date(aggregatedData[brushData.startIndex].date, 0, 1);
      const endDate = new Date(aggregatedData[brushData.endIndex].date + Number(grouping.slice(0, -1)) - 1, 11, 31);
      onRangeChange([startDate, endDate]);
    }
  }, [aggregatedData, grouping, onRangeChange]);

  const brushStartIndex = useMemo(() => {
    return Math.max(0, aggregatedData.findIndex(d => d.date >= dateRange[0].getFullYear()));
  }, [aggregatedData, dateRange]);

  const brushEndIndex = useMemo(() => {
    return Math.min(
      aggregatedData.length - 1,
      aggregatedData.findIndex(d => d.date > dateRange[1].getFullYear()) - 1
    );
  }, [aggregatedData, dateRange]);

  const formatXAxis = (tickItem: number) => tickItem.toString();

  const formatTooltip = (value: number, name: string, props: any) => {
    const year = props.payload.date;
    return [`Total cases: ${value}`, `Year: ${year}`];
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <div className="mb-4 flex items-center space-x-4">
        <select
          value={grouping}
          onChange={(e) => setGrouping(e.target.value as '10y' | '50y' | '100y' | '500y')}
          className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
        >
          <option value="10y">10 Years</option>
          <option value="50y">50 Years</option>
          <option value="100y">100 Years</option>
          <option value="500y">500 Years</option>
        </select>
        <input
          type="date"
          value={dateRange[0].toISOString().split('T')[0]}
          onChange={(e) => onRangeChange([new Date(e.target.value), dateRange[1]])}
          className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
        />
        <input
          type="date"
          value={dateRange[1].toISOString().split('T')[0]}
          onChange={(e) => onRangeChange([dateRange[0], new Date(e.target.value)])}
          className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
        />
      </div>
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatXAxis} stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#ddd' }} formatter={formatTooltip} />
            <Area type="monotone" dataKey="totalCases" stroke="#4f9da6" fill="#4f9da6" />
            <Brush
              dataKey="date"
              height={30}
              stroke="#8884d8"
              onChange={handleBrushChange}
              startIndex={brushStartIndex}
              endIndex={brushEndIndex}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(TimelineView);