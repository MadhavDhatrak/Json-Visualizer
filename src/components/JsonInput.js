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
    <div className="p-4 border rounded-md shadow-sm bg-gray-800 h-full">
      <h2 className="text-xl font-semibold mb-2 text-white flex justify-between items-center">
        JSON Input
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-sm text-white rounded hover:bg-blue-600"
            onClick={handleValidate}
          >
            Validate
          </button>
          <button
            className="px-3 py-1 bg-gray-600 text-sm text-white rounded hover:bg-gray-700"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </h2>
      
      <div className="relative h-[calc(100vh-200px)] border border-gray-700 rounded-md overflow-hidden">
        <textarea
          className="w-full h-full p-4 font-mono text-sm resize-none bg-gray-900 text-gray-100 focus:outline-none"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder="// Paste your JSON here..."
          spellCheck="false"
          style={{
            lineHeight: '1.6',
            tabSize: 2,
            caretColor: '#fff'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-grid-pattern"></div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  );
};

export default JsonInput;