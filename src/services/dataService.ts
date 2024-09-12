import Papa from 'papaparse';

export const loadBirdFluData = async () => {
    const response = await fetch('/path-to-dataset.csv');
    const csvData = await response.text();
    return Papa.parse(csvData, { header: true }).data;
};
