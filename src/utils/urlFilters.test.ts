import { dateRangeForYears, readFilters, writeFilters } from './urlFilters';

const full: [Date, Date] = [new Date(5970, 1, 6), new Date(7437, 0, 20)];

test('the default view has no query string', () => {
  expect(writeFilters(readFilters('', full), full)).toBe('');
});

test('selections and years survive a round trip', () => {
  const query = '?species=Eurasian+Blue+Tit,Duck&strains=H5N1&provenance=Wild&from=6500&to=7000';
  const filters = readFilters(query, full);
  expect(filters.selectedSpecies).toEqual(['Eurasian Blue Tit', 'Duck']);
  expect(filters.selectedStrains).toEqual(['H5N1']);
  expect(filters.selectedProvenances).toEqual(['Wild']);
  expect(filters.dateRange.map((d) => d.getFullYear())).toEqual([6500, 7000]);
  expect(writeFilters(filters, full)).toBe(query);
});

test('invalid, reversed or out-of-range years fall back to the full range', () => {
  expect(readFilters('?from=abc&to=6000.5', full).dateRange).toEqual(full);
  expect(readFilters('?from=1000&to=99999', full).dateRange).toEqual(full);
  expect(readFilters('?from=7000&to=6000', full).dateRange).toEqual(full);
});

test('a single selected year includes January 1 through December 31 after reopening its URL', () => {
  const dateRange = dateRangeForYears(7000, 7000, full);
  expect(dateRange).toEqual([new Date(7000, 0, 1), new Date(7000, 11, 31)]);

  const filters = { ...readFilters('', full), dateRange };
  const query = writeFilters(filters, full);
  expect(query).toBe('?from=7000&to=7000');
  expect(readFilters(query, full).dateRange).toEqual(dateRange);
});

test('selecting the first and last years respects the actual data boundaries', () => {
  const dateRange = dateRangeForYears(5970, 7437, full);
  expect(dateRange).toEqual(full);
  expect(writeFilters({ ...readFilters('', full), dateRange }, full)).toBe('');
});
