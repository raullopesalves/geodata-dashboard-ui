import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { DataPoint } from "../types/DataPoint";
import { STRAIN_COLORS } from "../constants/colors";

interface GraphViewProps {
  data: DataPoint[];
}

const STRAINS = Object.keys(STRAIN_COLORS) as (keyof typeof STRAIN_COLORS)[];

// Ring split by each strain's share of cases, dark centre for the label
const strainRing = (counts: Record<string, number>, size: number, label: string, title: string): L.DivIcon => {
  const total = STRAINS.reduce((sum, s) => sum + counts[s], 0) || 1;
  let at = 0;
  const stops = STRAINS.filter((s) => counts[s] > 0).map((s) => {
    const from = at;
    at += (counts[s] / total) * 100;
    return `${STRAIN_COLORS[s]} ${from}% ${at}%`;
  });
  return L.divIcon({
    html: `<div class="strain-ring" title="${title}" style="width:${size}px;height:${size}px;background:conic-gradient(${stops.join(",")})">${label ? `<span>${label}</span>` : ""}</div>`,
    className: "",
    iconSize: L.point(size, size),
  });
};

const countStrains = (points: DataPoint[]): Record<string, number> =>
  Object.fromEntries(STRAINS.map((s) => [s, points.reduce((sum, p) => sum + (p[s] > 0 ? 1 : 0), 0)]));

const describe = (counts: Record<string, number>) =>
  STRAINS.filter((s) => counts[s] > 0).map((s) => `${s} ${counts[s]}`).join(", ");

const MarkerClusterGroup = ({ data }: { data: DataPoint[] }) => {
  const map = useMap();

  const filteredData = useMemo(() => {
    return data.filter((point) => totalCases(point) > 0);
  }, [data]);

  const formatDate = (dateString: string): string => {
    const [day, month, year] = dateString.split(".");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime())
      ? "Unknown Date"
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  useEffect(() => {
    const pointOf = new Map<L.Layer, DataPoint>();
    // One cluster layer for all strains, so a location is a single bubble
    // No chunkedLoading: its deferred chunks can fire after cleanup removed the layer
    const mcg = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      iconCreateFunction: (cluster) => {
        const reports = cluster.getAllChildMarkers().map((m) => pointOf.get(m)!);
        const counts = countStrains(reports);
        const size = Math.round(Math.min(56, 26 + Math.log2(reports.length) * 4));
        return strainRing(counts, size, String(reports.length), `${reports.length} reports: ${describe(counts)}`);
      },
    });

    const markers = filteredData.map((point) => {
      const counts = countStrains([point]);
      const marker = L.marker([point.latitude, point.longitude], {
        icon: strainRing(counts, 14, "", describe(counts)),
      });
      marker.bindTooltip(
        `<strong>${point.species}</strong><br>${formatDate(point.timestamp)} · ${point.provenance}<br>${STRAINS.filter((s) => point[s] > 0).join(", ")}`,
        { direction: "top", offset: L.point(0, -8), className: "map-tooltip" }
      );
      pointOf.set(marker, point);
      return marker;
    });

    mcg.addLayers(markers);
    map.addLayer(mcg);

    // Add legend
    const LegendControl = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create("div", "map-legend");
        STRAINS.forEach((strain) => {
          div.innerHTML += `<div><i style="background:${STRAIN_COLORS[strain]}"></i>${strain}</div>`;
        });
        return div;
      },
    });

    const legend = new LegendControl({ position: "bottomright" });
    legend.addTo(map);

    return () => {
      map.removeLayer(mcg);
      map.removeControl(legend);
    };
  }, [map, filteredData]);

  return null;
};

const totalCases = (point: DataPoint): number => {
  return (
    (point.H5N1 || 0) +
    (point.H5N2 || 0) +
    (point.H7N2 || 0) +
    (point.H7N8 || 0)
  );
};

const GraphView: React.FC<GraphViewProps> = ({ data }) => {
  const center: [number, number] = [46.8182, 8.2275]; // Approximate center of Switzerland
  const zoom = 8;

  // Standard OpenStreetMap tiles (no API key), darkened in CSS via .dark-tiles
  const url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="h-full w-full relative" style={{ zIndex: 0 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={url}
          className="dark-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup data={data} />
      </MapContainer>
    </div>
  );
};

export default GraphView;
