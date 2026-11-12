import React from 'react';
import { render, screen } from '@testing-library/react';
import DataSummary from './DataSummary';
import { DataPoint } from '../../types/DataPoint';

const range: [Date, Date] = [new Date(2000, 0, 1), new Date(2010, 11, 31)];

test('shows an empty state instead of charts when nothing matches', () => {
  render(<DataSummary filteredData={[]} dateRange={range} />);
  expect(screen.getByText('No reports match these filters. Clear some to see more.')).toBeInTheDocument();
  expect(screen.queryByText('Provenance')).not.toBeInTheDocument();
  expect(screen.queryByText('Recent reports')).not.toBeInTheDocument();
});

test('counts cases across strains and unique species', () => {
  const data: DataPoint[] = [
    { latitude: 47, longitude: 8, species: 'Duck', H5N1: 1, H5N2: 0, H7N2: 1, H7N8: 0, timestamp: '01.01.2005', provenance: 'Wild' },
    { latitude: 46, longitude: 7, species: 'Duck', H5N1: 0, H5N2: 1, H7N2: 0, H7N8: 0, timestamp: '02.02.2006', provenance: 'Livestock' },
  ];
  render(<DataSummary filteredData={data} dateRange={range} allCases={6967} allSpecies={12} />);
  expect(screen.getByText('Cases').nextSibling).toHaveTextContent('3 of 6,967');
  expect(screen.getByText('Species').nextSibling).toHaveTextContent('1 of 12');
  expect(screen.getByRole('status')).toHaveTextContent('3 cases match the current filters');
  expect(screen.getByText('Provenance')).toBeInTheDocument();
});
