import React, { useState } from 'react';

const JsonInput = ({ onValidate, schema }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const handleValidate = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      onValidate(parsedJson);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
    }
  };

  const handleReset = () => {
    setJsonInput('');
    setError('');
    onValidate(null);
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2 dark:text-white">JSON Input</h2>
      
      <div className="relative h-[400px] border rounded-md overflow-hidden">
        <textarea
          className="w-full h-full p-4 font-mono text-sm resize-none bg-gray-50 dark:bg-gray-900 dark:text-gray-100"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder="Paste your JSON here..."
          spellCheck="false"
          style={{
            lineHeight: '1.5',
            tabSize: 2
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 bg-grid-pattern"></div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      
      <div className="mt-4 flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={handleValidate}
        >
          Validate
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default JsonInput;