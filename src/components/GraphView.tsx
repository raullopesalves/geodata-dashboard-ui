import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

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

const MarkerClusterGroup = ({ data }: { data: DataPoint[] }) => {
    const map = useMap();

    const filteredData = useMemo(() => {
        return data.filter(point => totalCases(point) > 0);
    }, [data]);

    const formatDate = (dateString: string): string => {
        const [day, month, year] = dateString.split('.');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return isNaN(date.getTime())
            ? 'Unknown Date'
            : date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    useEffect(() => {
        const mcg = L.markerClusterGroup({
            chunkedLoading: true,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 50,
            iconCreateFunction: (cluster) => {
                const childCount = cluster.getChildCount();
                const size = Math.min(60, childCount * 3 + 20);
                return L.divIcon({
                    html: `<div style="background-color: rgba(255, 0, 0, 0.6); width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${childCount}</div>`,
                    className: 'marker-cluster-custom',
                    iconSize: L.point(size, size)
                });
            }
        });

        filteredData.forEach((point) => {
            const size = Math.max(10, Math.min(30, Math.sqrt(totalCases(point)) * 3));
            const marker = L.circleMarker([point.latitude, point.longitude], {
                radius: size / 2,
                fillColor: 'rgba(255, 0, 0, 0.6)',
                fillOpacity: 1,
                stroke: false
            });

            const tooltipContent = `
        <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="font-size: 14px;">${point.species}</strong><br>
          <strong>Date:</strong> ${formatDate(point.timestamp)}<br>
          <strong>Provenance:</strong> ${point.provenance}<br>
          <strong>Variants Detected:</strong><br>
          ${point.H5N1 > 0 ? `H5N1: ${point.H5N1}<br>` : ''}
          ${point.H5N2 > 0 ? `H5N2: ${point.H5N2}<br>` : ''}
          ${point.H7N2 > 0 ? `H7N2: ${point.H7N2}<br>` : ''}
          ${point.H7N8 > 0 ? `H7N8: ${point.H7N8}<br>` : ''}
          <strong>Total:</strong> ${totalCases(point)}
        </div>
      `;

            marker.bindTooltip(tooltipContent, {
                direction: 'top',
                offset: L.point(0, -size / 2),
                opacity: 0.9
            });

            mcg.addLayer(marker);
        });

        map.addLayer(mcg);

        return () => {
            map.removeLayer(mcg);
        };
    }, [map, filteredData]);

    return null;
};

const totalCases = (point: DataPoint): number => {
    return (point.H5N1 || 0) + (point.H5N2 || 0) + (point.H7N2 || 0) + (point.H7N8 || 0);
};

const GraphView: React.FC<GraphViewProps> = ({ data }) => {
    const center: [number, number] = [46.8182, 8.2275]; // Approximate center of Switzerland
    const zoom = 8;

    return (
        <div className="h-full w-full">
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/{z}/{x}/{y}.png?key=***REMOVED***"
                    attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a> contributors'
                />

                <MarkerClusterGroup data={data} />
            </MapContainer>
        </div>
    );
};

export default GraphView;