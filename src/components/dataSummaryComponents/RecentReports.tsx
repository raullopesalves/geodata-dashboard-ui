import React from 'react';
import { DataPoint } from '../../types/DataPoint';
import { SCROLLBAR_COLORS, STRAIN_COLORS } from '../../constants/colors';

interface RecentReportsProps {
    filteredData: DataPoint[];
}

const strainColors: { [key: string]: string } = STRAIN_COLORS;

const RecentReports: React.FC<RecentReportsProps> = ({ filteredData }) => {
    const parseDate = (dateString: string): Date => {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day);
    };

    const getDetectedStrains = (report: DataPoint): string[] => {
        return ['H5N1', 'H5N2', 'H7N2', 'H7N8'].filter(strain => {
            const value = report[strain as keyof DataPoint];
            return typeof value === 'number' && value > 0;
        });
    };

    const reportsWithStrains = filteredData.filter(report => getDetectedStrains(report).length > 0);

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-200">Recent reports</h3>
            {/* Rows are h-14 with 0.5rem gaps: 11.5rem shows exactly three whole rows */}
            <div className="h-46 overflow-y-auto pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: SCROLLBAR_COLORS.Colors
            }}>
                <ul className="space-y-2">
                    {reportsWithStrains
                        .sort((a, b) => parseDate(b.timestamp).getTime() - parseDate(a.timestamp).getTime())
                        .slice(0, 10)
                        .map((report, index) => (
                            <li key={index} className="h-14 bg-gray-800 px-3 py-2 rounded-md text-sm flex flex-col justify-center">
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="font-medium text-gray-100 truncate" title={report.species}>{report.species}</span>
                                    <span className="shrink-0 text-gray-300 tabular-nums">{report.timestamp}</span>
                                </div>
                                <div className="mt-0.5 flex items-baseline gap-2 text-xs text-gray-400">
                                    {getDetectedStrains(report).map((strain) => (
                                        <span key={strain} className="font-medium" style={{ color: strainColors[strain] }}>
                                            {strain}
                                        </span>
                                    ))}
                                    <span>{report.provenance}</span>
                                    <span className="ml-auto tabular-nums">
                                        {report.latitude.toFixed(2)}°N {report.longitude.toFixed(2)}°E
                                    </span>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default React.memo(RecentReports);