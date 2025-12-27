import {
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import FlowContent from './FlowContent';

const nodeTypes = {
    customNode: CustomNode,
};

const initialNodes = [
    {
        id: '1',
        type: 'customNode',
        position: { x: 250, y: 250 },
        data: { label: 'Node 1' },
    },
];

const initialEdges = [];

function FlowCanvas() {
    return (
        <ReactFlowProvider>
            <FlowContent
                initialNodes={initialNodes}
                initialEdges={initialEdges}
                nodeTypes={nodeTypes}
            />
        </ReactFlowProvider>
    );
}

export default FlowCanvas;