// Filters <-> query string, so a filtered view can be bookmarked or shared.
// The URL is user input: unknown names simply match nothing, and invalid or
// out-of-range years fall back to the full date range.

export interface FilterState {
  dateRange: [Date, Date];
  selectedSpecies: string[];
  selectedStrains: string[];
  selectedProvenances: string[];
}

const list = (value: string | null) => (value ? value.split(',').filter(Boolean) : []);

const year = (value: string | null) => {
  const n = Number(value);
  return value && Number.isInteger(n) ? n : null;
};

export const readFilters = (search: string, full: [Date, Date]): FilterState => {
  const params = new URLSearchParams(search);
  const from = year(params.get('from'));
  const to = year(params.get('to'));
  const start = from !== null && new Date(from, 0, 1) > full[0] ? new Date(from, 0, 1) : full[0];
  const end = to !== null && new Date(to, 11, 31) < full[1] ? new Date(to, 11, 31) : full[1];
  return {
    dateRange: start <= end ? [start, end] : full,
    selectedSpecies: list(params.get('species')),
    selectedStrains: list(params.get('strains')),
    selectedProvenances: list(params.get('provenance')),
  };
};

export const writeFilters = (filters: FilterState, full: [Date, Date]): string => {
  const params = new URLSearchParams();
  if (filters.selectedSpecies.length) params.set('species', filters.selectedSpecies.join(','));
  if (filters.selectedStrains.length) params.set('strains', filters.selectedStrains.join(','));
  if (filters.selectedProvenances.length) params.set('provenance', filters.selectedProvenances.join(','));
  // Only write years that narrow the full range, so the default view has a clean URL
  if (filters.dateRange[0] > full[0]) params.set('from', String(filters.dateRange[0].getFullYear()));
  if (filters.dateRange[1] < full[1]) params.set('to', String(filters.dateRange[1].getFullYear()));
  // Commas are valid in a query string; keep them readable instead of %2C
  const query = params.toString().replace(/%2C/g, ',');
  return query ? `?${query}` : '';
};
