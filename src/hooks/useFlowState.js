import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow } from '@xyflow/react';
import { NODE_SPACING, NODE_DIRECTIONS, EDGE_TYPES } from '../constants/flowConfig';
import { getLayoutedElements } from '../utils/layoutUtils';

export const useFlowState = (initialNodes = [], initialEdges = []) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [nodeHistory, setNodeHistory] = useState([]); // Track node creation order
    const { fitView } = useReactFlow();

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeClick = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const applyAutoLayout = useCallback(() => {
        const layouted = getLayoutedElements(nodes, edges, 'TB');
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
        // Fit view after layout with a small delay to ensure nodes are positioned
        setTimeout(() => {
            fitView({ padding: 0.1, duration: 800 });
        }, 100);
    }, [nodes, edges, setNodes, setEdges, fitView]);

    const deleteNode = useCallback((nodeIdToDelete) => {
        // Don't delete if it's the only node
        if (nodes.length <= 1) return;

        // Find the index of the node to delete in history
        const historyIndex = nodeHistory.findIndex(id => id === nodeIdToDelete);

        // Select the previous node in history, or the next one if it's the first
        let newSelectedId = null;
        if (historyIndex > 0) {
            // Select the previous node in creation order
            newSelectedId = nodeHistory[historyIndex - 1];
        } else if (historyIndex === 0 && nodeHistory.length > 1) {
            // If deleting the first node, select the next one
            newSelectedId = nodeHistory[1];
        }

        // Make sure the new selected node still exists
        if (newSelectedId && !nodes.find(n => n.id === newSelectedId)) {
            // If the selected node doesn't exist, find any remaining node
            const remainingNodes = nodes.filter(n => n.id !== nodeIdToDelete);
            newSelectedId = remainingNodes.length > 0 ? remainingNodes[0].id : null;
        }

        // Remove node from nodes
        const updatedNodes = nodes.filter(node => node.id !== nodeIdToDelete);

        // Remove all edges connected to this node
        const updatedEdges = edges.filter(edge =>
            edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
        );

        // Update node history
        const updatedHistory = nodeHistory.filter(id => id !== nodeIdToDelete);

        // Apply layout and update state
        const layouted = getLayoutedElements(updatedNodes, updatedEdges, 'TB');
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
        setNodeHistory(updatedHistory);
        setSelectedNodeId(newSelectedId);

        // Fit view after deletion
        setTimeout(() => {
            fitView({ padding: 0.1, duration: 800 });
        }, 100);
    }, [nodes, edges, nodeHistory, setNodes, setEdges, fitView]);

    const addNode = useCallback((sourceNodeId, direction) => {
        const sourceNode = nodes.find(node => node.id === sourceNodeId);
        if (!sourceNode) return;

        const newNodeId = `node-${Date.now()}`;
        let newPosition = { ...sourceNode.position };

        // Calculate position based on direction
        switch (direction) {
            case NODE_DIRECTIONS.TOP:
                newPosition.y -= NODE_SPACING.VERTICAL;
                break;
            case NODE_DIRECTIONS.BOTTOM:
                newPosition.y += NODE_SPACING.VERTICAL;
                break;
            case NODE_DIRECTIONS.LEFT:
                newPosition.x -= NODE_SPACING.HORIZONTAL;
                newPosition.y = sourceNode.position.y; // Same level (sibling)
                break;
            case NODE_DIRECTIONS.RIGHT:
                newPosition.x += NODE_SPACING.HORIZONTAL;
                newPosition.y = sourceNode.position.y; // Same level (sibling)
                break;
            default:
                break;
        }

        const newNode = {
            id: newNodeId,
            type: 'customNode',
            position: newPosition,
            data: {
                label: `Node ${nodes.length + 1}`,
            },
        };

        let newEdge = null;
        let updatedNodes = nodes.concat(newNode);
        let updatedEdges = edges;

        // Handle edge creation based on direction and hierarchy
        if (direction === NODE_DIRECTIONS.TOP || direction === NODE_DIRECTIONS.BOTTOM) {
            // Vertical directions create parent-child relationships
            if (direction === NODE_DIRECTIONS.TOP) {
                // New node is parent of source node
                newEdge = {
                    id: `edge-${newNodeId}-${sourceNodeId}`,
                    source: newNodeId,
                    target: sourceNodeId,
                    type: EDGE_TYPES.SMOOTH_STEP,
                };
            } else {
                // New node is child of source node
                newEdge = {
                    id: `edge-${sourceNodeId}-${newNodeId}`,
                    source: sourceNodeId,
                    target: newNodeId,
                    type: EDGE_TYPES.SMOOTH_STEP,
                };
            }
            updatedEdges = edges.concat(newEdge);
        } else {
            // Horizontal directions create sibling relationships
            // Find the parent of the source node to connect the new sibling
            const parentEdge = edges.find(edge => edge.target === sourceNodeId);

            if (parentEdge) {
                // Source node has a parent, connect new node to the same parent
                newEdge = {
                    id: `edge-${parentEdge.source}-${newNodeId}`,
                    source: parentEdge.source,
                    target: newNodeId,
                    type: EDGE_TYPES.SMOOTH_STEP,
                };
                updatedEdges = edges.concat(newEdge);
            } else {
                // Source node has no parent, check if it's a parent of other nodes
                const childEdges = edges.filter(edge => edge.source === sourceNodeId);

                if (childEdges.length > 0) {
                    // Source node is a parent, create a new parent for both nodes
                    const parentNodeId = `parent-${Date.now()}`;
                    const parentNode = {
                        id: parentNodeId,
                        type: 'customNode',
                        position: {
                            x: (sourceNode.position.x + newPosition.x) / 2,
                            y: sourceNode.position.y - NODE_SPACING.VERTICAL
                        },
                        data: {
                            label: `Node ${nodes.length + 2}`,
                        },
                    };

                    // Add parent node
                    updatedNodes = updatedNodes.concat(parentNode);

                    // Create edges from parent to both siblings
                    const parentToSource = {
                        id: `edge-${parentNodeId}-${sourceNodeId}`,
                        source: parentNodeId,
                        target: sourceNodeId,
                        type: EDGE_TYPES.SMOOTH_STEP,
                    };

                    const parentToNew = {
                        id: `edge-${parentNodeId}-${newNodeId}`,
                        source: parentNodeId,
                        target: newNodeId,
                        type: EDGE_TYPES.SMOOTH_STEP,
                    };

                    updatedEdges = edges.concat([parentToSource, parentToNew]);

                    // Add parent to history as well
                    setNodeHistory(prev => [...prev, parentNodeId, newNodeId]);
                }
                // If source node has no parent and no children, don't create any edge (isolated sibling)
            }
        }

        // Update node history
        if (!nodeHistory.includes(newNodeId)) {
            setNodeHistory(prev => [...prev, newNodeId]);
        }

        // Apply auto-layout after adding the node
        const layouted = getLayoutedElements(updatedNodes, updatedEdges, 'TB');
        setNodes(layouted.nodes);
        setEdges(layouted.edges);

        // Select the newly created node
        setSelectedNodeId(newNodeId);

        // Fit view to show all nodes with animation
        setTimeout(() => {
            fitView({ padding: 0.1, duration: 800 });
        }, 100);
    }, [nodes, edges, nodeHistory, setNodes, setEdges, fitView]);

    return {
        nodes,
        edges,
        selectedNodeId,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodeClick,
        onPaneClick,
        addNode,
        deleteNode,
        applyAutoLayout,
    };
};