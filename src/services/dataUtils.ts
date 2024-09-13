import Papa from 'papaparse';

export interface DataPoint {
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

// Custom date parsing function
function parseCustomDate(dateString: string): Date {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day);
}

export const parseCSV = async (url: string): Promise<DataPoint[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse<DataPoint>(csvText, {
        header: true,
        delimiter: ',',
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          const validData = result.data
            .filter((item) => item.latitude && item.longitude && item.timestamp)
            .map((item) => ({
              ...item,
              latitude: parseFloat(String(item.latitude)),
              longitude: parseFloat(String(item.longitude)),
              H5N1: parseInt(String(item.H5N1)) || 0,
              H5N2: parseInt(String(item.H5N2)) || 0,
              H7N2: parseInt(String(item.H7N2)) || 0,
              H7N8: parseInt(String(item.H7N8)) || 0,
              timestamp: item.timestamp, // Keep the original string format
            }));
          console.log('Sample data point:', validData[0]);
          resolve(validData);
        },
        error: (error: Error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching data: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while fetching data');
    }
  }
};

export const filterData = (
  data: DataPoint[],
  dateRange: [Date, Date],
  selectedSpecies: string[],
  selectedStrains: string[],
  selectedProvenances: string[]
): DataPoint[] => {
  return data.filter(point => {
    const date = parseCustomDate(point.timestamp);
    const inDateRange = date >= dateRange[0] && date <= dateRange[1];
    const speciesMatch = selectedSpecies.length === 0 || selectedSpecies.includes(point.species);
    const strainMatch = selectedStrains.length === 0 || 
      (selectedStrains.includes('H5N1') && point.H5N1 > 0) ||
      (selectedStrains.includes('H5N2') && point.H5N2 > 0) ||
      (selectedStrains.includes('H7N2') && point.H7N2 > 0) ||
      (selectedStrains.includes('H7N8') && point.H7N8 > 0);
    const provenanceMatch = selectedProvenances.length === 0 || selectedProvenances.includes(point.provenance);
    
    return inDateRange && speciesMatch && strainMatch && provenanceMatch;
  });
};

export const getUniqueSpecies = (data: DataPoint[]): string[] => {
  return Array.from(new Set(data.map(point => point.species)));
};

export const getUniqueStrains = (data: DataPoint[]): string[] => {
  return ['H5N1', 'H5N2', 'H7N2', 'H7N8'].filter(strain => 
    data.some(point => (point[strain as keyof DataPoint] as number) > 0)
  );
};

export const getUniqueProvenances = (data: DataPoint[]): string[] => {
  return Array.from(new Set(data.map(point => point.provenance)));
};

export { parseCustomDate };