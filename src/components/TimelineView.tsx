import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const aggregatedData = React.useMemo(() => {
    const aggregated: { [key: string]: { date: string; totalCases: number } } = {};

    data.forEach(point => {
      const date = point.timestamp.split('T')[0];
      if (!aggregated[date]) {
        aggregated[date] = { date, totalCases: 0 };
      }
      aggregated[date].totalCases += point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8;
    });

    return Object.values(aggregated).sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      onRangeChange([date, dateRange[1]]);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      onRangeChange([dateRange[0], date]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <DatePicker
          selected={dateRange[0]}
          onChange={handleStartDateChange}
          selectsStart
          startDate={dateRange[0]}
          endDate={dateRange[1]}
        />
        <DatePicker
          selected={dateRange[1]}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          minDate={dateRange[0]}
        />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={aggregatedData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalCases" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineView;