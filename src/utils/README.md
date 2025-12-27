# Layout Algorithms

This directory contains various layout algorithms for automatically arranging nodes in the React Flow canvas.

## Available Layouts

### 1. **Auto Layout (Hierarchical Top-Bottom)**
- Uses Dagre algorithm for automatic hierarchical layout
- Arranges nodes from top to bottom based on edge relationships
- Best for: Flowcharts, decision trees, organizational charts

### 2. **Hierarchical Left-Right**
- Same as auto layout but arranges nodes from left to right
- Best for: Process flows, timelines

### 3. **Tree Layout**
- Custom tree algorithm that creates a proper tree structure
- Finds root node automatically or uses specified root
- Best for: Family trees, file systems, hierarchical data

### 4. **Force-Directed Layout**
- Physics-based simulation with attraction and repulsion forces
- Creates organic, balanced arrangements
- Best for: Network graphs, social networks, general graphs

### 5. **Grid Layout**
- Arranges nodes in a regular grid pattern
- Configurable number of columns
- Best for: Catalogs, galleries, uniform data display

### 6. **Circular Layout**
- Arranges nodes in a circle
- Configurable radius
- Best for: Cyclic processes, equal relationships

## Usage

```javascript
import { useLayout } from '../hooks/useLayout';

const { applyLayout, LAYOUT_TYPES } = useLayout(nodes, edges, setNodes, setEdges);

// Apply different layouts
applyLayout(LAYOUT_TYPES.AUTO);
applyLayout(LAYOUT_TYPES.FORCE, { iterations: 100 });
applyLayout(LAYOUT_TYPES.GRID, { columns: 4 });
applyLayout(LAYOUT_TYPES.CIRCULAR, { radius: 300 });
```

## Configuration

Layout parameters can be customized in `src/constants/flowConfig.js`:

- `NODE_SPACING.HORIZONTAL`: Horizontal spacing between nodes
- `NODE_SPACING.VERTICAL`: Vertical spacing between nodes

## Algorithm Details

### Dagre Layout
- Uses the Dagre library for hierarchical layouts
- Automatically handles edge routing and node positioning
- Supports both top-bottom and left-right orientations

### Force-Directed Algorithm
- Implements repulsion forces between all nodes
- Implements attraction forces between connected nodes
- Uses velocity damping for smooth convergence
- Configurable number of iterations for performance tuning

### Tree Algorithm
- Uses BFS to assign levels to nodes
- Automatically centers nodes within each level
- Handles disconnected components gracefully