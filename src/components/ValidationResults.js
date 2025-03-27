import React from 'react';

const ValidationResults = ({ results }) => {
  if (!results) return null;
  
  const { isValid, errors } = results;
  return (
    <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800 mt-4">
      <h2 className="text-xl font-semibold mb-2 dark:text-white">Validation Results</h2>
      
      {isValid ? (
        <div className="text-green-500 font-semibold">
          ✓ JSON is valid against the schema
        </div>
      ) : (
        <div>
          <div className="text-red-500 font-semibold mb-2">
            ✗ JSON is invalid against the schema
          </div>
          
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index} className="text-red-500 text-sm">
                {error.instancePath} {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationResults;