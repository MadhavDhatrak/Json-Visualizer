import React, { useEffect, useState, useCallback, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { parseSchemaForVisualization, markInvalidNodes } from '../utils/schemaParser';

// Register the dagre layout
if (!cytoscape.prototype.hasInitialised) {
  cytoscape.use(dagre);
  cytoscape.prototype.hasInitialised = true;
}

const SchemaVisualizer = ({ data, validationErrors }) => {
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [cyRef, setCyRef] = useState(null);
  const containerRef = useRef(null);

  // Debug logs
  console.log('SchemaVisualizer rendering with data:', data);

  useEffect(() => {
    if (data) {
      try {
        console.log('Parsing data for visualization:', data);
        const parsedElements = parseSchemaForVisualization(data);
        console.log('Parsed elements:', parsedElements);
        setElements(parsedElements);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  }, [data]);

  useEffect(() => {
    if (validationErrors && validationErrors.length > 0) {
      setElements(prevElements => markInvalidNodes(prevElements, validationErrors));
    }
  }, [validationErrors]);

  const cytoscapeStylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': 'data(color)',
        'label': 'data(label)',
        'width': 'label',
        'height': 'label',
        'padding': '10px',
        'text-valign': 'center',
        'text-halign': 'center',
        'border-width': 2,
        'border-color': '#ddd',
        'font-size': '14px',
        'text-wrap': 'wrap',
        'text-max-width': '120px',
        'shape': 'round-rectangle'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '12px',
        'text-rotation': 'autorotate',
        'text-margin-y': -10
      }
    },
    {
      selector: 'node[type = "object"]',
      style: {
        'shape': 'round-rectangle',
        'border-style': 'solid'
      }
    },
    {
      selector: 'node[type = "array"]',
      style: {
        'shape': 'round-rectangle',
        'border-style': 'dashed'
      }
    },
    {
      selector: 'node[type = "value"]',
      style: {
        'shape': 'round-rectangle',
        'border-style': 'dotted',
        'font-style': 'italic'
      }
    }
  ];

  // Force re-render on window resize
  useEffect(() => {
    const handleResize = () => {
      if (cyRef) {
        console.log('Window resized, triggering layout');
        cyRef.resize();
        cyRef.fit();
        
        // Re-run layout
        cyRef.layout({
          name: 'dagre',
          rankDir: 'TB',
          padding: 50,
          animate: true
        }).run();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cyRef]);

  // Log when the component renders and when elements change
  console.log('Elements for rendering:', elements);
  console.log('Nodes count:', elements.nodes.length, 'Edges count:', elements.edges.length);

  return (
    <div className="border rounded-md shadow-sm bg-white dark:bg-gray-800 h-[600px]" ref={containerRef}>
      <h2 className="text-xl font-semibold p-4 dark:text-white">Data Visualization</h2>
      
      <div className="h-[calc(100%-60px)]" style={{ position: 'relative' }}>
        {elements.nodes.length > 0 ? (
          <CytoscapeComponent
            elements={[...elements.nodes, ...elements.edges]}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            stylesheet={cytoscapeStylesheet}
            layout={{
              name: 'dagre',
              rankDir: 'TB',
              padding: 50,
              spacingFactor: 1.1,
              nodeSep: 60,
              rankSep: 80,
              animate: true,
              animationDuration: 500,
              fit: true
            }}
            cy={(cy) => {
              console.log('Cytoscape instance created');
              setCyRef(cy);
              cy.fit();
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
            No data to visualize
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaVisualizer;