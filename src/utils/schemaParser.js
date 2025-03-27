/**
 * Converts JSON data into a format suitable for Cytoscape visualization
 */
export const parseSchemaForVisualization = (jsonData, parentId = null, propertyName = null) => {
  if (!jsonData || typeof jsonData !== 'object') {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  // For the root node, use the person's name
  if (!parentId) {
    nodes.push({
      data: {
        id: 'root',
        label: jsonData.name || 'root', // Use name as label for root
        type: 'object',
        color: '#6FB1FC'
      }
    });

    // Process all properties except 'name' since it's used as root label
    Object.entries(jsonData).forEach(([key, value]) => {
      if (key === 'name') return; // Skip name property

      const childId = `${key}`;
      nodes.push({
        data: {
          id: childId,
          label: key,
          type: typeof value === 'object' ? (Array.isArray(value) ? 'array' : 'object') : 'property',
          color: Array.isArray(value) ? '#EDA1ED' : '#82E0AA'
        }
      });

      edges.push({
        data: {
          id: `root-to-${childId}`,
          source: 'root',
          target: childId
        }
      });

      // Handle values
      if (Array.isArray(value)) {
        const valueId = `${childId}-value`;
        nodes.push({
          data: {
            id: valueId,
            label: `[${value.join(', ')}]`,
            type: 'value',
            color: '#F5A45D'
          }
        });
        edges.push({
          data: {
            id: `${childId}-to-value`,
            source: childId,
            target: valueId
          }
        });
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const subId = `${childId}-${subKey}`;
          nodes.push({
            data: {
              id: subId,
              label: subKey,
              type: 'property',
              color: '#82E0AA'
            }
          });
          edges.push({
            data: {
              id: `${childId}-to-${subId}`,
              source: childId,
              target: subId
            }
          });

          const valueId = `${subId}-value`;
          nodes.push({
            data: {
              id: valueId,
              label: String(subValue),
              type: 'value',
              color: '#F5A45D'
            }
          });
          edges.push({
            data: {
              id: `${subId}-to-value`,
              source: subId,
              target: valueId
            }
          });
        });
      } else {
        const valueId = `${childId}-value`;
        nodes.push({
          data: {
            id: valueId,
            label: String(value),
            type: 'value',
            color: '#F5A45D'
          }
        });
        edges.push({
          data: {
            id: `${childId}-to-value`,
            source: childId,
            target: valueId
          }
        });
      }
    });
  }

  return { nodes, edges };
};

export const markInvalidNodes = (elements, errors) => {
  if (!errors || errors.length === 0 || !elements || !elements.nodes) {
    return elements;
  }
  
  const updatedNodes = [...elements.nodes];
  
  errors.forEach(error => {
    const path = error.instancePath.split('/').filter(Boolean);
    let nodeId = 'root';
    
    if (path.length > 0) {
      nodeId = path.reduce((id, segment) => `${id}-${segment}`, 'root');
    }
    
    const nodeIndex = updatedNodes.findIndex(node => node.data.id === nodeId);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        data: {
          ...updatedNodes[nodeIndex].data,
          color: '#FF6B6B',
          error: error.message
        }
      };
    }
  });
  
  return { nodes: updatedNodes, edges: elements.edges };
};