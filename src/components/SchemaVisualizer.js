import React, { useEffect, useState, useCallback, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { parseSchemaForVisualization, markInvalidNodes } from '../utils/schemaParser';


if (!cytoscape.prototype.hasInitialised) {
  cytoscape.use(dagre);
  cytoscape.prototype.hasInitialised = true;
}

const SchemaVisualizer = ({ data, validationErrors }) => {
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [cyRef, setCyRef] = useState(null);
  const containerRef = useRef(null);

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
          padding: 40,
          spacingFactor: 1.2,
          nodeSep: 60,
          rankSep: 80,
          edgeSep: 40,
          animate: true,
          animationDuration: 500,
          fit: true,
          ranker: 'network-simplex',
          minLen: function(edge) {
            return 1;
          },
          edgeWeight: function(edge) {
            return 1;
          },
          overlap: false,
          avoidOverlap: true,
          maxSimulationTime: 2000
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
    <div className="border rounded-md shadow-sm bg-gray-900 h-[calc(100vh-100px)]">
      <h2 className="text-xl font-semibold p-4 text-white border-b border-gray-700">
        Data Visualization
      </h2>
      
      <div className="h-[calc(100%-60px)] cytoscape-container">
        {elements.nodes.length > 0 ? (
          <CytoscapeComponent
            elements={[...elements.nodes, ...elements.edges]}
            style={{ width: '100%', height: '100%' }}
            stylesheet={cytoscapeStylesheet}
            layout={{
              name: 'dagre',
              rankDir: 'TB',
              padding: 30,
              spacingFactor: 1.1,
              nodeSep: 50,
              rankSep: 70,
              edgeSep: 30,
              animate: true,
              animationDuration: 300,
              fit: true,
              avoidOverlap: true,
              ranker: 'tight-tree',
              minLen: function(edge) { return 1; },
              edgeWeight: function(edge) { return 2; },
              nodeDimensionsIncludeLabels: true,
              routingStyle: 'orthogonal'
            }}
            cy={(cy) => {
              setCyRef(cy);
              cy.fit();
              cy.minZoom(0.5);
              cy.maxZoom(2);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data to visualize
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaVisualizer;