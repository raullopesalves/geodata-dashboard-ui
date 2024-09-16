import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Brush, ResponsiveContainer, Line } from 'recharts';
import debounce from 'lodash/debounce';
import { DataPoint } from '../types/DataPoint';
import { parseCustomDate } from '../utils/dataUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'react-feather'; // Calendar icon from react-feather

interface TimelineViewProps {
  data: DataPoint[];
  dateRange: [Date, Date];
  initialDateRange: [Date, Date];
  onRangeChange: (range: [Date, Date]) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ data, dateRange, initialDateRange, onRangeChange }) => {
  const [groupBy, setGroupBy] = useState(10); // Default group by 50 years
  const [startDate, setStartDate] = useState(initialDateRange[0]);
  const [endDate, setEndDate] = useState(initialDateRange[1]);

  // Compute chart data and range based on data prop
  const chartData = useMemo(() => {
    const yearData: { [key: number]: number } = {};
    data.forEach((item) => {
      const date = parseCustomDate(item.timestamp);
      const year = Math.floor(date.getFullYear() / groupBy) * groupBy;
      if (!yearData[year]) {
        yearData[year] = 0;
      }
      yearData[year] += (item.H5N1 ? 1 : 0) + (item.H5N2 ? 1 : 0) + (item.H7N2 ? 1 : 0) + (item.H7N8 ? 1 : 0);
    });

    return Object.entries(yearData)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [data, groupBy]);

  const chartRange = useMemo(() => {
    if (chartData.length > 0) {
      const minYear = chartData[0].year;
      const maxYear = chartData[chartData.length - 1].year;
      return [new Date(minYear, 0, 1), new Date(maxYear, 11, 31)];
    }
    return [new Date(), new Date()];
  }, [chartData]);

  const handleBrushChange = useCallback(debounce((newRange: { startIndex?: number; endIndex?: number }) => {
    if (newRange.startIndex !== undefined && newRange.endIndex !== undefined) {
      const startYear = chartData[newRange.startIndex].year;
      const endYear = chartData[newRange.endIndex].year;
      const newStartDate = new Date(startYear, 0, 1);
      const newEndDate = new Date(endYear, 11, 31);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      onRangeChange([newStartDate, newEndDate]);
    }
  }, 300), [chartData, onRangeChange]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
      onRangeChange([start, end]);
    }
  };

  useEffect(() => {
    // Ensure startDate and endDate are within chartRange
    if (startDate < chartRange[0]) setStartDate(chartRange[0]);
    if (endDate > chartRange[1]) setEndDate(chartRange[1]);
  }, [chartRange, startDate, endDate]);

  useEffect(() => {
    // Ensure endDate is not before startDate
    if (endDate && startDate && endDate < startDate) {
      setEndDate(startDate);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // Ensure startDate is not after endDate
    if (endDate && startDate && startDate > endDate) {
      setStartDate(endDate);
    }
  }, [endDate, startDate]);

  const formatXAxis = (year: number) => year.toString();

  const formatTooltip = (value: number, name: string, props: any) => {
    if (props && props.payload && props.payload[0]) {
      const year = props.payload[0].payload.year;
      return [`Total variants: ${value}`, `Year: ${year}`];
    }
    return [];
  };

  const startIndex = chartData.findIndex(d => d.year === startDate.getFullYear());
  const endIndex = chartData.findIndex(d => d.year === endDate.getFullYear());

  return (
    <div className="w-full h-80 bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Timeline</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-white">
            <span>Group By: </span>
            <select
              className="ml-2 text-sm bg-gray-700 text-white p-1 rounded"
              value={groupBy}
              onChange={(e) => setGroupBy(Number(e.target.value))}
            >
              <option value={10}>10 years</option>
              <option value={50}>50 years</option>
              <option value={100}>100 years</option>
              <option value={500}>500 years</option>
            </select>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-2">Start: </span>
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date as Date, endDate)}
              dateFormat="yyyy"
              showYearPicker
              className="text-sm bg-gray-700 text-white p-1 rounded"
              minDate={chartRange[0]}
              maxDate={endDate || chartRange[1]}
            />
            <Calendar className="text-white ml-2" size={16} />
          </div>
          <div className="flex items-center">
            <span className="text-white mr-2">End: </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(startDate, date as Date)}
              dateFormat="yyyy"
              showYearPicker
              className="text-sm bg-gray-700 text-white p-1 rounded"
              minDate={startDate || chartRange[0]}
              maxDate={chartRange[1]}
            />
            <Calendar className="text-white ml-2" size={16} />
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis 
            dataKey="year" 
            stroke="#fff"
            tickFormatter={formatXAxis}
          />
          <YAxis stroke="#fff" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', border: 'none' }}
            itemStyle={{ color: '#fff' }}
            formatter={formatTooltip}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#1e90ff" 
            fill="url(#colorCount)"
            fillOpacity={0.5}
          />
          <Brush 
            dataKey="year"
            height={30}
            stroke="#1e90ff"
            fill="#444"
            onChange={handleBrushChange}
            startIndex={startIndex !== -1 ? startIndex : 0}
            endIndex={endIndex !== -1 ? endIndex : chartData.length - 1}
          >
            <Line type="monotone" dataKey="count" stroke="#6b8e23" strokeOpacity={0.5} />
          </Brush>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1e90ff" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineView;
