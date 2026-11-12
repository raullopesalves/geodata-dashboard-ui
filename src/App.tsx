import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  // Below xl (1280px) the panels stack and the page scrolls; from xl up it's a fixed one-screen dashboard
  return (
    <div className="min-h-screen relative bg-gray-900 xl:h-screen xl:overflow-hidden">
      <Navbar />
      <div className="xl:h-full xl:overflow-hidden">
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
