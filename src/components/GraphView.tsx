import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface DataPoint {
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

interface GraphViewProps {
  data: DataPoint[];
}

const GraphView: React.FC<GraphViewProps> = ({ data }) => {
  const center: [number, number] = [46.8182, 8.2275]; // Approximate center of Switzerland
  const zoom = 8;

  const aggregatedData = useMemo(() => {
    const grid: { [key: string]: DataPoint[] } = {};
    const gridSize = 0.1; // Adjust this value to change the aggregation level

    data.forEach(point => {
      const key = `${Math.floor(point.latitude / gridSize)},${Math.floor(point.longitude / gridSize)}`;
      if (!grid[key]) {
        grid[key] = [];
      }
      grid[key].push(point);
    });

    return Object.values(grid).map(points => {
      const totalCases = points.reduce((sum, point) => sum + point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8, 0);
      return {
        latitude: points.reduce((sum, point) => sum + point.latitude, 0) / points.length,
        longitude: points.reduce((sum, point) => sum + point.longitude, 0) / points.length,
        totalCases,
        points
      };
    });
  }, [data]);

  const maxCases = Math.max(...aggregatedData.map(point => point.totalCases));

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://api.maptiler.com/maps/basic-v2-dark/256/{z}/{x}/{y}.png?key=***REMOVED***"
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
      />
      {aggregatedData.map((point, index) => {
        const radius = 5 + (point.totalCases / maxCases) * 20; // Scale radius between 5 and 25
        const opacity = 0.2 + (point.totalCases / maxCases) * 0.25; // Scale opacity between 0.2 and 0.45
        return (
          <CircleMarker
            key={index}
            center={[point.latitude, point.longitude]}
            radius={radius}
            fillColor="#ff0000"
            color="#ff0000"
            weight={2}
            fillOpacity={opacity}
          >
            <Tooltip>
              <div>
                <strong>Total Cases:</strong> {point.totalCases}<br />
                <strong>Locations:</strong> {point.points.length}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default GraphView;