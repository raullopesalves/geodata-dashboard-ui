import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-grow relative overflow-hidden">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;