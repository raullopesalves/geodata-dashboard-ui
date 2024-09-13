import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <Navbar />
      <div className="h-full overflow-hidden">
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
