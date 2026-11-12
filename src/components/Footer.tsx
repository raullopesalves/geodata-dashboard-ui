import React, { useState } from "react";

interface DebugInfo {
  dataLength: number;
  filteredDataLength: number;
  dateRange: [Date, Date];
  selectedSpecies: string[];
  selectedStrains: string[];
  selectedProvenances: string[];
}

const Footer: React.FC<DebugInfo> = ({
  dataLength,
  filteredDataLength,
  dateRange,
  selectedSpecies,
  selectedStrains,
  selectedProvenances,
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const handleDebugToggle = () => {
    setShowDebugInfo((prev) => !prev);
  };

  return (
    <footer className="bg-gray-800 p-2 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Synthetic data, not real surveillance records</span>
          <a
            href="https://github.com/raullopesalves/geodata-dashboard-ui"
            className="text-blue-400 hover:underline"
          >
            Source on GitHub
          </a>
        </div>
        {import.meta.env.DEV && (
          <button
            onClick={handleDebugToggle}
            className="px-2 py-1 bg-blue-600 text-xs rounded-sm hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            {showDebugInfo ? "Hide" : "Show"} Debug Info
          </button>
        )}
      </div>

      {showDebugInfo && (
        <div className="mt-2 bg-gray-700 p-2 text-xs rounded-sm border border-gray-600">
          <p>Total Data Points: {dataLength}</p>
          <p>Filtered Data Points: {filteredDataLength}</p>
          <p>
            Date Range: {dateRange[0].toISOString().split("T")[0]} to{" "}
            {dateRange[1].toISOString().split("T")[0]}
          </p>
          <p>Filtered Species: {selectedSpecies.join(", ") || "None"}</p>
          <p>Filtered Strains: {selectedStrains.join(", ") || "None"}</p>
          <p>
            Filtered Provenances: {selectedProvenances.join(", ") || "None"}
          </p>
        </div>
      )}
    </footer>
  );
};

export default Footer;
