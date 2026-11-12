import { filterData, parseCustomDate, getUniqueSpecies, getUniqueStrains, getUniqueProvenances } from './dataUtils';
import { DataPoint } from '../types/DataPoint';

const point = (overrides: Partial<DataPoint>): DataPoint => ({
  latitude: 47,
  longitude: 8,
  species: 'Duck',
  H5N1: 0,
  H5N2: 0,
  H7N2: 0,
  H7N8: 0,
  timestamp: '01.01.2000',
  provenance: 'Wild',
  ...overrides,
});

const data = [
  point({ species: 'Duck', H5N1: 1, timestamp: '15.03.2000', provenance: 'Wild' }),
  point({ species: 'Chicken', H7N2: 1, timestamp: '20.06.2005', provenance: 'Livestock' }),
  point({ species: 'Goose', H5N1: 1, H7N8: 1, timestamp: '01.12.2010', provenance: 'Wild' }),
];
const allTime: [Date, Date] = [new Date(1900, 0, 1), new Date(2100, 0, 1)];

describe('parseCustomDate', () => {
  test('reads DD.MM.YYYY', () => {
    const d = parseCustomDate('06.02.7121');
    expect([d.getDate(), d.getMonth(), d.getFullYear()]).toEqual([6, 1, 7121]);
  });
});

describe('filterData', () => {
  test('returns everything when no filters are selected', () => {
    expect(filterData(data, allTime, [], [], [])).toHaveLength(3);
  });

  test('keeps only points inside the date range, inclusive', () => {
    const range: [Date, Date] = [new Date(2000, 2, 15), new Date(2005, 5, 20)];
    expect(filterData(data, range, [], [], []).map(p => p.species)).toEqual(['Duck', 'Chicken']);
  });

  test('matches any of the selected strains', () => {
    expect(filterData(data, allTime, [], ['H7N2', 'H7N8'], []).map(p => p.species)).toEqual(['Chicken', 'Goose']);
  });

  test('combines species, strain and provenance filters', () => {
    expect(filterData(data, allTime, ['Duck', 'Goose'], ['H5N1'], ['Wild'])).toHaveLength(2);
    expect(filterData(data, allTime, ['Duck'], ['H7N2'], [])).toHaveLength(0);
  });
});

describe('unique values', () => {
  test('lists species and provenances once each', () => {
    expect(getUniqueSpecies([...data, data[0]])).toEqual(['Duck', 'Chicken', 'Goose']);
    expect(getUniqueProvenances(data)).toEqual(['Wild', 'Livestock']);
  });

  test('lists only strains that appear in the data', () => {
    expect(getUniqueStrains(data)).toEqual(['H5N1', 'H7N2', 'H7N8']);
  });
});
