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
import { prefersReducedMotion } from "../utils/motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimelineViewProps {
  data: DataPoint[];
  initialDateRange: [Date, Date];
  onRangeChange: (range: [Date, Date]) => void;
}

type Bucket = { year: number; from: number; to: number; count: number; perYear: number };

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const b = payload[0].payload as Bucket;
    return (
      <div className="rounded-md bg-gray-900 px-2 py-1.5 text-xs text-gray-200 shadow-lg">
        <p>{`${b.from}–${b.to}: ${b.count.toLocaleString("en-GB")} cases (${b.perYear.toFixed(1)} a year)`}</p>
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
  // 50-year buckets read as a trend; 10-year buckets were ~147 noisy spikes
  const [groupBy, setGroupBy] = useState(50);
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

    // The first and last buckets only partly overlap the data (5970–7437), so plot cases per year:
    // raw counts would show a fake dip at both edges
    const firstYear = initialDateRange[0].getFullYear();
    const lastYear = initialDateRange[1].getFullYear();
    return Object.entries(yearData)
      .map(([year, count]): Bucket => {
        const from = Math.max(Number(year), firstYear);
        const to = Math.min(Number(year) + groupBy - 1, lastYear);
        return { year: Number(year), from, to, count, perYear: count / (to - from + 1) };
      })
      .sort((a, b) => a.year - b.year);
  }, [data, groupBy, initialDateRange]);

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

  // Text alternative for the chart
  const peak = chartData.reduce<Bucket | null>((max, d) => (!max || d.perYear > max.perYear ? d : max), null);
  const chartSummary = peak
    ? `Cases per year, averaged over ${groupBy}-year periods from ${chartData[0].from} to ${chartData[chartData.length - 1].to}. Highest: ${peak.perYear.toFixed(1)} a year in ${peak.from}–${peak.to}.`
    : "No cases for these filters.";

  return (
    <div className="w-full h-80 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-200">Timeline</h2>
          <p className="text-xs text-gray-400">Cases per year, averaged over each period</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-white whitespace-nowrap">
            <label htmlFor="timeline-group-by">Group by</label>
            <select
              id="timeline-group-by"
              className="ml-2 text-sm bg-gray-700 text-white p-1 rounded-sm border border-gray-500 hover:bg-gray-600 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
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
            <label htmlFor="timeline-start" className="text-white mr-2">Start</label>
            <DatePicker
              id="timeline-start"
              selected={startDate}
              onChange={(date: Date | null) => handleDateChange(date, endDate)}
              dateFormat="yyyy"
              showYearPicker
              className="w-16 text-sm bg-gray-700 text-white p-1 rounded-sm border border-gray-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
              minDate={chartRange[0]}
              maxDate={endDate || chartRange[1]}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="timeline-end" className="text-white mr-2">End</label>
            <DatePicker
              id="timeline-end"
              selected={endDate}
              onChange={(date: Date | null) => handleDateChange(startDate, date)}
              dateFormat="yyyy"
              showYearPicker
              className="w-16 text-sm bg-gray-700 text-white p-1 rounded-sm border border-gray-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
              minDate={startDate || chartRange[0]}
              maxDate={chartRange[1]}
            />
          </div>
        </div>
      </div>
      <p className="sr-only">{chartSummary}</p>
      {/* 234 = 250 minus the caption line, so the brush isn't clipped by the h-80 panel */}
      <ResponsiveContainer width="100%" height={234}>
        <AreaChart
          accessibilityLayer
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
          <CartesianGrid vertical={false} stroke="#374151" />
          <XAxis dataKey="year" stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={formatXAxis} minTickGap={24} />
          <YAxis stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="perYear"
            stroke="#1e90ff"
            fill="url(#colorCount)"
            fillOpacity={0.5}
            isAnimationActive={!prefersReducedMotion}
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
            ariaLabel={`Selected years ${startDate.getFullYear()}–${endDate.getFullYear()}`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineView;
