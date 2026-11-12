import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { DataPoint } from "../types/DataPoint";
import { STRAIN_COLORS } from "../constants/colors";
import { prefersReducedMotion } from "../utils/motion";

interface GraphViewProps {
  data: DataPoint[];
}

const STRAINS = Object.keys(STRAIN_COLORS) as (keyof typeof STRAIN_COLORS)[];

// Ring split by each strain's share of cases, dark centre for the label
// Leaflet makes the icon wrapper a focusable button; role="img" + aria-label gives it a name
const strainRing = (counts: Record<string, number>, size: number, label: string, title: string, hit = size): L.DivIcon => {
  const total = STRAINS.reduce((sum, s) => sum + counts[s], 0) || 1;
  let at = 0;
  const stops = STRAINS.filter((s) => counts[s] > 0).map((s) => {
    const from = at;
    at += (counts[s] / total) * 100;
    return `${STRAIN_COLORS[s]} ${from}% ${at}%`;
  });
  return L.divIcon({
    html: `<div class="strain-ring" role="img" aria-label="${title}" title="${title}" style="width:${size}px;height:${size}px;margin:${(hit - size) / 2}px;background:conic-gradient(${stops.join(",")})">${label ? `<span aria-hidden="true">${label}</span>` : ""}</div>`,
    className: "",
    iconSize: L.point(hit, hit),
  });
};

const countStrains = (points: DataPoint[]): Record<string, number> =>
  Object.fromEntries(STRAINS.map((s) => [s, points.reduce((sum, p) => sum + (p[s] > 0 ? 1 : 0), 0)]));

// Tooltip HTML is built from data; escape it so a different data source can't inject markup
const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const describe = (counts: Record<string, number>) =>
  STRAINS.filter((s) => counts[s] > 0).map((s) => `${s} ${counts[s]}`).join(", ");

const MarkerClusterGroup = ({ data }: { data: DataPoint[] }) => {
  const map = useMap();

  const filteredData = useMemo(() => {
    return data.filter((point) => totalCases(point) > 0);
  }, [data]);

  useEffect(() => {
    const pointOf = new Map<L.Layer, DataPoint>();
    // One cluster layer for all strains, so a location is a single bubble
    // No chunkedLoading: its deferred chunks can fire after cleanup removed the layer
    const mcg = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      animate: !prefersReducedMotion,
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
        // 14px dot inside a 24px target (WCAG 2.5.8 minimum target size)
        icon: strainRing(counts, 14, "", `${point.species}: ${describe(counts)}`, 24),
      });
      marker.bindTooltip(
        `<strong>${escapeHtml(point.species)}</strong><br>${escapeHtml(point.timestamp)} · ${escapeHtml(point.provenance)}<br>${STRAINS.filter((s) => point[s] > 0).join(", ")}`,
        { direction: "top", offset: L.point(0, -12), className: "map-tooltip" }
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

    // Bottom-left: bottom-right already holds the attribution and covered clusters
    const legend = new LegendControl({ position: "bottomleft" });
    legend.addTo(map);

    return () => {
      map.removeLayer(mcg);
      map.removeControl(legend);
    };
  }, [map, filteredData]);

  return null;
};

// Frame all reports on first load only, so filtering doesn't keep moving the map
const FitToData = ({ data }: { data: DataPoint[] }) => {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || data.length === 0) return;
    map.fitBounds(L.latLngBounds(data.map((p) => [p.latitude, p.longitude] as [number, number])), {
      padding: [24, 24],
      animate: false,
    });
    fitted.current = true;
  }, [map, data]);
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
        zoomAnimation={!prefersReducedMotion}
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
        <FitToData data={data} />
      </MapContainer>
    </div>
  );
};

export default GraphView;
