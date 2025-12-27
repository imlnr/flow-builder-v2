import dagre from 'dagre';
import { NODE_SPACING } from '../constants/flowConfig';

// Create a new directed graph
const createDagreGraph = () => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    return dagreGraph;
};

// Auto-layout using Dagre algorithm
export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = createDagreGraph();

    // Set graph properties
    dagreGraph.setGraph({
        rankdir: direction,
        nodesep: NODE_SPACING.HORIZONTAL,
        ranksep: NODE_SPACING.VERTICAL,
        marginx: 50,
        marginy: 50,
    });

    // Add nodes to dagre graph
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            width: node.width || 120,
            height: node.height || 60
        });
    });

    // Add edges to dagre graph
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Apply layout to nodes
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - (node.width || 120) / 2,
                y: nodeWithPosition.y - (node.height || 60) / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

// Tree layout algorithm for hierarchical structures
export const getTreeLayout = (nodes, edges, rootNodeId = null) => {
    if (nodes.length === 0) return { nodes, edges };

    // Find root node (node with no incoming edges or specified root)
    const incomingEdges = new Set(edges.map(edge => edge.target));
    const root = rootNodeId
        ? nodes.find(node => node.id === rootNodeId)
        : nodes.find(node => !incomingEdges.has(node.id)) || nodes[0];

    if (!root) return { nodes, edges };

    // Build adjacency list
    const adjacencyList = {};
    nodes.forEach(node => {
        adjacencyList[node.id] = [];
    });
    edges.forEach(edge => {
        if (adjacencyList[edge.source]) {
            adjacencyList[edge.source].push(edge.target);
        }
    });

    // Calculate positions using BFS
    const positions = {};
    const levels = {};
    const queue = [{ id: root.id, level: 0, parentX: 0 }];
    const visited = new Set();

    // First pass: assign levels
    while (queue.length > 0) {
        const { id, level } = queue.shift();

        if (visited.has(id)) continue;
        visited.add(id);

        levels[id] = level;

        adjacencyList[id].forEach(childId => {
            if (!visited.has(childId)) {
                queue.push({ id: childId, level: level + 1 });
            }
        });
    }

    // Group nodes by level
    const nodesByLevel = {};
    Object.entries(levels).forEach(([nodeId, level]) => {
        if (!nodesByLevel[level]) nodesByLevel[level] = [];
        nodesByLevel[level].push(nodeId);
    });

    // Calculate positions
    Object.entries(nodesByLevel).forEach(([level, nodeIds]) => {
        const levelNum = parseInt(level);
        const y = levelNum * NODE_SPACING.VERTICAL;

        nodeIds.forEach((nodeId, index) => {
            const totalWidth = (nodeIds.length - 1) * NODE_SPACING.HORIZONTAL;
            const startX = -totalWidth / 2;
            const x = startX + index * NODE_SPACING.HORIZONTAL;

            positions[nodeId] = { x, y };
        });
    });

    // Apply positions to nodes
    const layoutedNodes = nodes.map(node => ({
        ...node,
        position: positions[node.id] || { x: 0, y: 0 },
    }));

    return { nodes: layoutedNodes, edges };
};

// Force-directed layout for organic arrangements
export const getForceLayout = (nodes, edges, iterations = 50) => {
    if (nodes.length === 0) return { nodes, edges };

    const nodePositions = new Map();
    const nodeVelocities = new Map();

    // Initialize positions and velocities
    nodes.forEach((node, index) => {
        nodePositions.set(node.id, {
            x: node.position?.x || Math.random() * 400,
            y: node.position?.y || Math.random() * 400,
        });
        nodeVelocities.set(node.id, { x: 0, y: 0 });
    });

    // Build adjacency list for connected nodes
    const connections = new Map();
    nodes.forEach(node => connections.set(node.id, []));
    edges.forEach(edge => {
        if (connections.has(edge.source)) {
            connections.get(edge.source).push(edge.target);
        }
        if (connections.has(edge.target)) {
            connections.get(edge.target).push(edge.source);
        }
    });

    // Force simulation
    for (let i = 0; i < iterations; i++) {
        const forces = new Map();
        nodes.forEach(node => forces.set(node.id, { x: 0, y: 0 }));

        // Repulsion force between all nodes
        nodes.forEach(nodeA => {
            nodes.forEach(nodeB => {
                if (nodeA.id === nodeB.id) return;

                const posA = nodePositions.get(nodeA.id);
                const posB = nodePositions.get(nodeB.id);
                const dx = posA.x - posB.x;
                const dy = posA.y - posB.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                const repulsionForce = 1000 / (distance * distance);
                const forceA = forces.get(nodeA.id);
                forceA.x += (dx / distance) * repulsionForce;
                forceA.y += (dy / distance) * repulsionForce;
            });
        });

        // Attraction force between connected nodes
        edges.forEach(edge => {
            const posSource = nodePositions.get(edge.source);
            const posTarget = nodePositions.get(edge.target);

            if (!posSource || !posTarget) return;

            const dx = posTarget.x - posSource.x;
            const dy = posTarget.y - posSource.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;

            const attractionForce = distance * 0.01;

            const forceSource = forces.get(edge.source);
            const forceTarget = forces.get(edge.target);

            forceSource.x += (dx / distance) * attractionForce;
            forceSource.y += (dy / distance) * attractionForce;
            forceTarget.x -= (dx / distance) * attractionForce;
            forceTarget.y -= (dy / distance) * attractionForce;
        });

        // Update positions
        nodes.forEach(node => {
            const force = forces.get(node.id);
            const velocity = nodeVelocities.get(node.id);
            const position = nodePositions.get(node.id);

            velocity.x = (velocity.x + force.x) * 0.8; // Damping
            velocity.y = (velocity.y + force.y) * 0.8;

            position.x += velocity.x;
            position.y += velocity.y;
        });
    }

    // Apply final positions
    const layoutedNodes = nodes.map(node => ({
        ...node,
        position: nodePositions.get(node.id),
    }));

    return { nodes: layoutedNodes, edges };
};

// Grid layout for structured arrangements
export const getGridLayout = (nodes, edges, columns = 3) => {
    const layoutedNodes = nodes.map((node, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;

        return {
            ...node,
            position: {
                x: col * NODE_SPACING.HORIZONTAL,
                y: row * NODE_SPACING.VERTICAL,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

// Circular layout
export const getCircularLayout = (nodes, edges, radius = 200) => {
    if (nodes.length === 0) return { nodes, edges };

    const layoutedNodes = nodes.map((node, index) => {
        const angle = (2 * Math.PI * index) / nodes.length;

        return {
            ...node,
            position: {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};