import React, { useRef } from 'react';
import { HelpCircle } from 'react-feather';
import swissFlag from '../assets/images/flag.png';

const Navbar: React.FC = () => {
  // Native modal <dialog>: dialog role, Esc to close and focus handling come from the browser
  const helpRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <header className="bg-gray-900 shadow-lg">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={swissFlag} alt="" width={64} height={64} className="h-16 w-16" />
              <h1 className="text-white font-bold text-xl">Bird Flu Cases in Switzerland</h1>
              {/* Up front, so the far-future years don't read as a bug */}
              <span className="rounded-full px-2 py-0.5 text-xs text-gray-300 ring-1 ring-gray-500">Synthetic data</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                onClick={() => helpRef.current?.showModal()}
              >
                <HelpCircle size={18} className="mr-2" aria-hidden="true" />
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      <dialog
        ref={helpRef}
        aria-labelledby="help-title"
        className="bg-gray-800 p-6 rounded-lg max-w-md text-white backdrop:bg-black/50"
        // A click on the dialog element itself (not its content) is a click on the backdrop
        onClick={(e) => e.target === e.currentTarget && helpRef.current?.close()}
      >
        <h2 id="help-title" className="text-xl font-bold mb-4">Dashboard Help</h2>
        <p className="mb-4">Synthetic bird flu reports for Switzerland: locations and dates are generated, not real surveillance records.</p>
        <ul className="mb-4 list-disc pl-5 space-y-1">
          <li><strong>Filters:</strong> pick species, strains or provenance to narrow every panel.</li>
          <li><strong>Map:</strong> each bubble is a group of nearby reports, with its ring split by strain. Zoom in or click a bubble to see individual reports.</li>
          <li><strong>Timeline:</strong> drag the handles or set Start and End to limit every panel to those years.</li>
        </ul>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          onClick={() => helpRef.current?.close()}
        >
          Close
        </button>
      </dialog>
    </>
  );
};

export default Navbar;
