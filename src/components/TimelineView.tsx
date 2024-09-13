import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [intervalRange, setIntervalRange] = useState<[number, number]>([0, 100]);

  const aggregatedData = useMemo(() => {
    const aggregated: { date: string; totalCases: number }[] = [];
    data.forEach(point => {
      const date = new Date(point.timestamp);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date: ${point.timestamp}`);
        return;
      }
      const dateString = date.toISOString().split('T')[0];
      const existingEntry = aggregated.find(item => item.date === dateString);
      if (existingEntry) {
        existingEntry.totalCases += point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8;
      } else {
        aggregated.push({ date: dateString, totalCases: point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8 });
      }
    });
    return aggregated.sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const filteredData = useMemo(() => {
    const startIndex = Math.floor(aggregatedData.length * intervalRange[0] / 100);
    const endIndex = Math.floor(aggregatedData.length * intervalRange[1] / 100);
    return aggregatedData.slice(startIndex, endIndex + 1);
  }, [aggregatedData, intervalRange]);

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    const newRange: [number, number] = [...intervalRange];
    newRange[event.target.name === 'min' ? 0 : 1] = value;
    setIntervalRange(newRange);
    
    const startIndex = Math.floor(aggregatedData.length * newRange[0] / 100);
    const endIndex = Math.floor(aggregatedData.length * newRange[1] / 100);
    
    if (aggregatedData[startIndex] && aggregatedData[endIndex]) {
      const newDateRange: [Date, Date] = [
        new Date(aggregatedData[startIndex].date),
        new Date(aggregatedData[endIndex].date)
      ];
      onRangeChange(newDateRange);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="range"
          name="min"
          min="0"
          max="100"
          value={intervalRange[0]}
          onChange={handleIntervalChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <input
          type="range"
          name="max"
          min="0"
          max="100"
          value={intervalRange[1]}
          onChange={handleIntervalChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
            <Line type="monotone" dataKey="totalCases" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineView;