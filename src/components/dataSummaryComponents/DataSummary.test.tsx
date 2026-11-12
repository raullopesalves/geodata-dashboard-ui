import React from 'react';
import { render, screen } from '@testing-library/react';
import DataSummary from './DataSummary';
import { DataPoint } from '../../types/DataPoint';

const range: [Date, Date] = [new Date(2000, 0, 1), new Date(2010, 11, 31)];

test('shows an empty state instead of charts when nothing matches', () => {
  render(<DataSummary filteredData={[]} dateRange={range} />);
  // Recent Reports and the chart area both say so
  expect(screen.getAllByText('No reports match the current filters.')).toHaveLength(2);
  expect(screen.queryByText('Wild vs Livestock')).not.toBeInTheDocument();
});

test('counts cases across strains and unique species', () => {
  const data: DataPoint[] = [
    { latitude: 47, longitude: 8, species: 'Duck', H5N1: 1, H5N2: 0, H7N2: 1, H7N8: 0, timestamp: '01.01.2005', provenance: 'Wild' },
    { latitude: 46, longitude: 7, species: 'Duck', H5N1: 0, H5N2: 1, H7N2: 0, H7N8: 0, timestamp: '02.02.2006', provenance: 'Livestock' },
  ];
  render(<DataSummary filteredData={data} dateRange={range} />);
  expect(screen.getByText('Total Cases').nextSibling).toHaveTextContent('3');
  expect(screen.getByText('Unique Species').nextSibling).toHaveTextContent('1');
  expect(screen.getByText('Wild vs Livestock')).toBeInTheDocument();
});
