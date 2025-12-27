import { useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
} from '@xyflow/react';
import LayoutControls from './LayoutControls';
import { useFlowState } from '../../hooks/useFlowState';
import { useLayout } from '../../hooks/useLayout';

function FlowContent({ initialNodes, initialEdges, nodeTypes }) {
    const {
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
    } = useFlowState(initialNodes, initialEdges);

    const { applyLayout, LAYOUT_TYPES } = useLayout(nodes, edges, setNodes, setEdges);

    // Apply initial layout on mount
    useEffect(() => {
        if (nodes.length > 0) {
            setTimeout(() => {
                applyAutoLayout();
            }, 100);
        }
    }, []); // Only run on mount

    // Update nodes with the addNode and deleteNode functions, and selection state
    const nodesWithHandlers = nodes.map(node => ({
        ...node,
        selected: node.id === selectedNodeId,
        data: {
            ...node.data,
            onAddNode: addNode,
            onDeleteNode: deleteNode,
        }
    }));

    const handleLayoutChange = (layoutType) => {
        switch (layoutType) {
            case 'auto':
                applyLayout(LAYOUT_TYPES.AUTO);
                break;
            case 'hierarchical-lr':
                applyLayout(LAYOUT_TYPES.HIERARCHICAL_LR);
                break;
            case 'tree':
                applyLayout(LAYOUT_TYPES.TREE);
                break;
            case 'force':
                applyLayout(LAYOUT_TYPES.FORCE);
                break;
            case 'grid':
                applyLayout(LAYOUT_TYPES.GRID, { columns: 3 });
                break;
            case 'circular':
                applyLayout(LAYOUT_TYPES.CIRCULAR, { radius: 200 });
                break;
            default:
                applyLayout(LAYOUT_TYPES.AUTO);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }} className="relative">
            <LayoutControls onLayoutChange={handleLayoutChange} />
            <ReactFlow
                nodes={nodesWithHandlers}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                    padding: 0.1,
                    includeHiddenNodes: false,
                }}
                minZoom={0.1}
                maxZoom={2}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}

export default FlowContent;