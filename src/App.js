import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import JsonInput from './components/JsonInput';
import SchemaVisualizer from './components/SchemaVisualizer';
import ValidationResults from './components/ValidationResults';
import { validateJson } from './utils/validator';
import './index.css';

// Example schema - you can replace this with your own or load it dynamically
const exampleSchema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: {
      type: 'string',
      description: 'The person\'s name'
    },
    age: {
      type: 'integer',
      description: 'Age in years',
      minimum: 0
    },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        zipCode: { type: 'string' }
      }
    },
    hobbies: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
};

function App() {
  const [schema] = useState(exampleSchema);
  const [validationResults, setValidationResults] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  
  // Check for user's preferred color scheme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleValidate = (data) => {
    if (!data) {
      setValidationResults(null);
      setJsonData(null);
      return;
    }
    
    setJsonData(data);
    const results = validateJson(schema, data);
    setValidationResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-80px)]">
          <div className="flex flex-col">
            <JsonInput onValidate={handleValidate} schema={schema} />
            <ValidationResults results={validationResults} />
          </div>
          
          <div className="h-full">
            <SchemaVisualizer 
              data={jsonData}
              validationErrors={validationResults?.errors || []} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;