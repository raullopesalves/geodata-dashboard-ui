import React from 'react';
import { DataPoint } from '../../types/DataPoint';

interface RecentReportsProps {
  filteredData: DataPoint[];
}

const RecentReports: React.FC<RecentReportsProps> = ({ filteredData }) => {
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-gray-300">Recent Reports</h3>
      <div className="h-48 overflow-y-auto pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4B5563 #1F2937'
      }}>
        <ul className="space-y-2">
          {filteredData
            .sort((a, b) => parseDate(b.timestamp).getTime() - parseDate(a.timestamp).getTime())
            .slice(0, 10)
            .map((report, index) => (
              <li key={index} className="bg-gray-800 p-2 rounded-md">
                <p className="text-white text-sm">
                  <strong>Date:</strong> {report.timestamp} <br />
                  <strong>Species:</strong> {report.species} <br />
                  <strong>Provenance:</strong> {report.provenance} <br />
                  <strong>Cases:</strong> H5N1: {report.H5N1}, H5N2: {report.H5N2}, H7N2: {report.H7N2}, H7N8: {report.H7N8}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(RecentReports);