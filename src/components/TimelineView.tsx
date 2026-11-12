import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Brush,
  ResponsiveContainer,
} from "recharts";
import debounce from "lodash/debounce";
import { DataPoint } from "../types/DataPoint";
import { parseCustomDate } from "../utils/dataUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimelineViewProps {
  data: DataPoint[];
  initialDateRange: [Date, Date];
  onRangeChange: (range: [Date, Date]) => void;
}

const CustomTooltip = ({ active, payload, label, groupBy }: TooltipProps<number, string> & { groupBy: number }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#000', padding: '5px' }}>
        <p className="intro">{`${label}–${label + groupBy - 1}: ${payload[0].value} cases`}</p>
      </div>
    );
  }

  return null;
};

const TimelineView: React.FC<TimelineViewProps> = ({
  data,
  initialDateRange,
  onRangeChange,
}) => {
  const [groupBy, setGroupBy] = useState(10);
  const [pickedStart, setStartDate] = useState(initialDateRange[0]);
  const [pickedEnd, setEndDate] = useState(initialDateRange[1]);

  const chartData = useMemo(() => {
    const yearData: { [key: number]: number } = {};

    data.forEach((item) => {
      const date = parseCustomDate(item.timestamp);
      const year = date.getFullYear();
      const groupedYear = Math.floor(year / groupBy) * groupBy;

      if (!yearData[groupedYear]) {
        yearData[groupedYear] = 0;
      }
      yearData[groupedYear] +=
        (item.H5N1 ? 1 : 0) +
        (item.H5N2 ? 1 : 0) +
        (item.H7N2 ? 1 : 0) +
        (item.H7N8 ? 1 : 0);
    });

    return Object.entries(yearData)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [data, groupBy]);

  const chartRange = useMemo(() => {
    if (chartData.length > 0) {
      const minYear = chartData[0].year;
      const maxYear = chartData[chartData.length - 1].year;
      // Each point is the first year of a bucket; the range ends where the last bucket ends
      return [new Date(minYear, 0, 1), new Date(maxYear + groupBy - 1, 11, 31)];
    }
    // No matching data: keep the full range so the year inputs aren't clamped to today
    return initialDateRange;
  }, [chartData, groupBy, initialDateRange]);

  // Keep the picked years inside the chart's range, with start <= end
  const startDate = pickedStart < chartRange[0] ? chartRange[0] : pickedStart;
  const clampedEnd = pickedEnd > chartRange[1] ? chartRange[1] : pickedEnd;
  const endDate = clampedEnd < startDate ? startDate : clampedEnd;

  const handleBrushChange = debounce((newRange: { startIndex?: number; endIndex?: number }) => {
    if (
      newRange.startIndex !== undefined &&
      newRange.endIndex !== undefined
    ) {
      const startYear = chartData[newRange.startIndex].year;
      const endYear = chartData[newRange.endIndex].year;
      const newStartDate = new Date(startYear, 0, 1);
      const newEndDate = new Date(endYear + groupBy - 1, 11, 31);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      onRangeChange([newStartDate, newEndDate]);
    }
  }, 300);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
      onRangeChange([start, end]);
    }
  };

  const formatXAxis = (year: number) => year.toString();

  const startIndex = chartData.findIndex(
    (d) => d.year === startDate.getFullYear()
  );
  const endIndex = chartData.findIndex((d) => d.year === endDate.getFullYear());

  // Adjust the brush range to the actual data range
  const brushRange = useMemo(() => {
    if (chartData.length > 0) {
      const minYear = chartData[0].year;
      const maxYear = chartData[chartData.length - 1].year;
      return [minYear, maxYear];
    }
    return [0, 0];
  }, [chartData]);

  return (
    <div className="w-full h-80 bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Timeline</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-white whitespace-nowrap">
            <label htmlFor="timeline-group-by">Group By: </label>
            <select
              id="timeline-group-by"
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
            <label htmlFor="timeline-start" className="text-white mr-2">Start: </label>
            <DatePicker
              id="timeline-start"
              selected={startDate}
              onChange={(date) => handleDateChange(date as Date, endDate)}
              dateFormat="yyyy"
              showYearPicker
              className="w-16 text-sm bg-gray-700 text-white p-1 rounded"
              minDate={chartRange[0]}
              maxDate={endDate || chartRange[1]}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="timeline-end" className="text-white mr-2">End: </label>
            <DatePicker
              id="timeline-end"
              selected={endDate}
              onChange={(date) => handleDateChange(startDate, date as Date)}
              dateFormat="yyyy"
              showYearPicker
              className="w-16 text-sm bg-gray-700 text-white p-1 rounded"
              minDate={startDate || chartRange[0]}
              maxDate={chartRange[1]}
            />
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData.filter(
            (d) => d.year >= brushRange[0] && d.year <= brushRange[1]
          )}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1e90ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="year" stroke="#fff" tickFormatter={formatXAxis} />
          <YAxis stroke="#fff" />
          <Tooltip content={<CustomTooltip groupBy={groupBy} />} />
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
            travellerWidth={10}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineView;
