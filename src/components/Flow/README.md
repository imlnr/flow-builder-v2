# React Flow Components

This directory contains the React Flow implementation with custom nodes that have + buttons for adding connected nodes.

## Structure

```
src/
├── components/
│   └── Flow/
│       ├── FlowCanvas.jsx     # Main flow container component
│       ├── CustomNode.jsx     # Custom node with + buttons
│       ├── index.js          # Export barrel
│       └── README.md         # This file
├── hooks/
│   └── useFlowState.js       # Custom hook for flow state management
├── constants/
│   └── flowConfig.js         # Configuration constants
└── lib/
    └── utils.js              # Utility functions

```

## Features

- **Custom Nodes**: Each node has + buttons on all four sides (top, bottom, left, right)
- **Dynamic Node Addition**: Click any + button to add a new connected node in that direction
- **Automatic Edge Creation**: New nodes are automatically connected with smooth step edges
- **Proper Spacing**: Nodes are positioned with consistent spacing based on direction
- **Industry Standard Structure**: Component-based architecture with proper separation of concerns

## Usage

```jsx
import { FlowCanvas } from './components/Flow';

function App() {
  return <FlowCanvas />;
}
```

## Customization

- Modify `NODE_SPACING` in `flowConfig.js` to adjust node positioning
- Change `EDGE_TYPES` to use different edge styles
- Customize node appearance in `CustomNode.jsx`
- Extend `useFlowState` hook for additional functionality