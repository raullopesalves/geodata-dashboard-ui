import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { DataPoint } from '../types/DataPoint';
import { STRAIN_COLORS_TRANSPARENT } from '../constants/colors';

interface GraphViewProps {
    data: DataPoint[];
}

const strainColorsTransparent = STRAIN_COLORS_TRANSPARENT;

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
        const mcgs: { [key: string]: L.MarkerClusterGroup } = {};
        Object.keys(strainColorsTransparent).forEach(strain => {
            mcgs[strain] = L.markerClusterGroup({
                chunkedLoading: true,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                maxClusterRadius: 100,
                iconCreateFunction: (cluster) => {
                    const childCount = cluster.getChildCount();
                    const size = Math.min(60, childCount * 3 + 20);
                    return L.divIcon({
                        html: `<div style="background-color: ${strainColorsTransparent[strain as keyof typeof strainColorsTransparent]}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 0 10px rgba(0,0,0,0.2);">${childCount}</div>`,
                        className: 'marker-cluster-custom',
                        iconSize: L.point(size, size)
                    });
                }
            });
        });

        filteredData.forEach((point) => {
            Object.keys(strainColorsTransparent).forEach(strain => {
                const strainCount = point[strain as keyof DataPoint];
                if (typeof strainCount === 'number' && strainCount > 0) {
                    const size = Math.max(10, Math.min(30, Math.sqrt(strainCount) * 3));
                    const marker = L.circleMarker([point.latitude, point.longitude], {
                        radius: size / 2,
                        fillColor: strainColorsTransparent[strain as keyof typeof strainColorsTransparent],
                        fillOpacity: 0.7,
                        color: 'white',
                        weight: 1,
                        opacity: 0.8
                    });

                    const tooltipContent = `
            <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4;">
              <strong style="font-size: 14px;">${point.species}</strong><br>
              <strong>Date:</strong> ${formatDate(point.timestamp)}<br>
              <strong>Provenance:</strong> ${point.provenance}<br>
              <strong>${strain}:</strong> ${strainCount}
            </div>
          `;

                    marker.bindTooltip(tooltipContent, {
                        direction: 'top',
                        offset: L.point(0, -size / 2),
                        opacity: 0.9
                    });

                    mcgs[strain].addLayer(marker);
                }
            });
        });

        Object.values(mcgs).forEach(mcg => map.addLayer(mcg));

        // Add legend
        const LegendControl = L.Control.extend({
            onAdd: () => {
                const div = L.DomUtil.create('div', 'info legend');
                div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                div.style.padding = '10px';
                div.style.borderRadius = '5px';
                div.style.color = 'white';
                div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

                Object.entries(strainColorsTransparent).forEach(([strain, color]) => {
                    div.innerHTML += `<div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; margin-right: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.1);"></div>
            <span>${strain}</span>
          </div>`;
                });

                return div;
            }
        });

        const legend = new LegendControl({ position: 'bottomright' });
        legend.addTo(map);

        return () => {
            Object.values(mcgs).forEach(mcg => map.removeLayer(mcg));
            map.removeControl(legend);
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

    const apiKey = process.env.REACT_APP_MAPTILER_API_KEY;

    const fallbackUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const url = apiKey
        ? `https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/{z}/{x}/{y}.png?key=${apiKey}`
        : fallbackUrl;

    return (
        <div className="h-full w-full relative" style={{ zIndex: 0 }}>
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url={url}
                    attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a> contributors'
                />
                <MarkerClusterGroup data={data} />
            </MapContainer>
        </div>
    );
};

export default GraphView;