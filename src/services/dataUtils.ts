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
            }));
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

export const filterData = (data: DataPoint[], dateRange: [Date, Date], species: string[]): DataPoint[] => {
  return data.filter(point => {
    const date = new Date(point.timestamp);
    return date >= dateRange[0] && date <= dateRange[1] && 
           (species.length === 0 || species.includes(point.species));
  });
};

export const getUniqueSpecies = (data: DataPoint[]): string[] => {
  return Array.from(new Set(data.map(item => item.species)));
};