import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">JSON Schema Visualizer & Validator</h1>
          <p className="text-sm">Visualize and validate JSON schemas with ease</p>
        </div>
        <button 
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="px-3 py-2 bg-blue-700 dark:bg-blue-900 rounded-md hover:bg-blue-800 dark:hover:bg-blue-950"
        >
          Toggle Dark Mode
        </button>
      </div>
    </header>
  );
};

export default Header;