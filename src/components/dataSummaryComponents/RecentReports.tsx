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
        <div className="bg-gray-900 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-300">Recent Reports</h3>
            <div className="h-48 overflow-y-auto pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: SCROLLBAR_COLORS.Colors
            }}>
                <ul className="space-y-2">
                    {reportsWithStrains
                        .sort((a, b) => parseDate(b.timestamp).getTime() - parseDate(a.timestamp).getTime())
                        .slice(0, 10)
                        .map((report, index) => (
                            <li key={index} className="bg-gray-800 p-2 rounded-md text-sm">
                                <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-gray-300">
                                    <div><span className="font-bold">Date:</span> {report.timestamp}</div>
                                    <div><span className="font-bold">Location:</span> {report.latitude.toFixed(2)}, {report.longitude.toFixed(2)}</div>
                                    <div>
                                        <span className="font-bold">Strains: </span>
                                        {getDetectedStrains(report).map((strain, i) => (
                                            <span key={i} className="mr-2" style={{ color: strainColors[strain] }}>
                                                {strain}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-1">Species:</span>
                                        <span
                                            className="truncate"
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: 'calc(100% - 60px)'
                                            }}
                                            title={report.species} // Tooltip with species name on hover
                                        >
                                            {report.species}
                                        </span>
                                    </div>


                                    <div><span className="font-bold">Provenance:</span> {report.provenance}</div>
                                    <div></div> {/* Empty cell to maintain grid structure */}
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default React.memo(RecentReports);