import Papa from 'papaparse';

export const parseCSV = (csvFile: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      complete: (results) => resolve(results.data as any[]),
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      error: (error) => reject(error),
    });
  });
};
