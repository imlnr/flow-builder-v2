import { Handle, Position } from '@xyflow/react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NODE_DIRECTIONS } from '../../constants/flowConfig';

function CustomNode({ id, data, selected }) {
    const handleAddNode = (direction) => {
        if (data.onAddNode) {
            data.onAddNode(id, direction);
        }
    };

    const handleDeleteNode = () => {
        if (data.onDeleteNode) {
            data.onDeleteNode(id);
        }
    };

    return (
        <div
            className={`group relative bg-white border-2 rounded-lg p-4 min-w-[120px] min-h-[60px] shadow-md hover:shadow-lg transition-all duration-200 ${selected
                    ? 'border-blue-500 shadow-blue-500/50 shadow-lg ring-2 ring-blue-300'
                    : 'border-gray-300'
                }`}
        >
            {/* Node Content */}
            <div className="text-center font-medium text-gray-800">
                {data.label}
            </div>

            {/* Delete Button - Only visible on hover and when selected */}
            {selected && (
                <Button
                    size="sm"
                    variant="outline"
                    className="absolute -top-3 -right-3 w-6 h-6 p-0 rounded-full bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={handleDeleteNode}
                >
                    <X className="w-3 h-3 text-white" />
                </Button>
            )}

            {/* Connection Handles - positioned at the edges */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
                style={{ top: -6 }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
                style={{ bottom: -6 }}
            />
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
                style={{ left: -6 }}
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
                style={{ right: -6 }}
            />

            {/* Add Node Buttons - Only visible on hover */}
            {/* Top Button */}
            <Button
                size="sm"
                variant="outline"
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 p-0 rounded-full bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => handleAddNode(NODE_DIRECTIONS.TOP)}
            >
                <Plus className="w-3 h-3 text-white" />
            </Button>

            {/* Bottom Button */}
            <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 p-0 rounded-full bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => handleAddNode(NODE_DIRECTIONS.BOTTOM)}
            >
                <Plus className="w-3 h-3 text-white" />
            </Button>

            {/* Left Button */}
            <Button
                size="sm"
                variant="outline"
                className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 rounded-full bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => handleAddNode(NODE_DIRECTIONS.LEFT)}
            >
                <Plus className="w-3 h-3 text-white" />
            </Button>

            {/* Right Button */}
            <Button
                size="sm"
                variant="outline"
                className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 rounded-full bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => handleAddNode(NODE_DIRECTIONS.RIGHT)}
            >
                <Plus className="w-3 h-3 text-white" />
            </Button>
        </div>
    );
}

export default CustomNode;