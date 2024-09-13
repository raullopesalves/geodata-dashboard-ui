import React from 'react';
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

  const totalCases = (point: DataPoint) => point.H5N1 + point.H5N2 + point.H7N2 + point.H7N8;

  return (
    <div className="h-full w-full">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((point, index) => (
          <CircleMarker
            key={index}
            center={[point.latitude, point.longitude]}
            radius={Math.sqrt(totalCases(point)) + 2}
            fillColor="#ff0000"
            color="#000"
            weight={1}
            opacity={1}
            fillOpacity={0.7}
          >
            <Tooltip>
              <div>
                <strong>Date:</strong> {point.timestamp}<br />
                <strong>Species:</strong> {point.species}<br />
                <strong>Total Cases:</strong> {totalCases(point)}<br />
                <strong>Location:</strong> {point.provenance}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GraphView;