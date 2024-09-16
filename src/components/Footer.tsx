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
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span>Version: 0.1.0</span>
          <span>|</span>
          <a
            href="mailto:support@example.com"
            className="text-blue-400 hover:underline"
          >
            Contact Us
          </a>
        </div>
        <button
          onClick={handleDebugToggle}
          className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {showDebugInfo ? "Hide" : "Show"} Debug Info (Dev only)
        </button>
      </div>

      {showDebugInfo && (
        <div className="mt-2 bg-gray-700 p-2 text-xs rounded border border-gray-600">
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
