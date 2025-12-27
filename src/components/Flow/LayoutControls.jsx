import { Button } from '@/components/ui/button';
import {
    LayoutGrid,
    GitBranch,
    Zap,
    Grid3X3,
    Circle,
    ArrowDown,
    ArrowRight
} from 'lucide-react';

const LayoutControls = ({ onLayoutChange }) => {
    const layoutOptions = [
        {
            key: 'auto',
            label: 'Auto Layout',
            icon: <GitBranch className="w-4 h-4" />,
            description: 'Hierarchical top-to-bottom'
        },
        {
            key: 'hierarchical-lr',
            label: 'Left-Right',
            icon: <ArrowRight className="w-4 h-4" />,
            description: 'Hierarchical left-to-right'
        },
        {
            key: 'tree',
            label: 'Tree',
            icon: <LayoutGrid className="w-4 h-4" />,
            description: 'Tree structure'
        },
        {
            key: 'force',
            label: 'Force',
            icon: <Zap className="w-4 h-4" />,
            description: 'Force-directed layout'
        },
        {
            key: 'grid',
            label: 'Grid',
            icon: <Grid3X3 className="w-4 h-4" />,
            description: 'Grid arrangement'
        },
        {
            key: 'circular',
            label: 'Circle',
            icon: <Circle className="w-4 h-4" />,
            description: 'Circular arrangement'
        }
    ];

    return (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Layout Options</h3>
            <div className="grid grid-cols-2 gap-2">
                {layoutOptions.map((option) => (
                    <Button
                        key={option.key}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 h-auto p-2 text-xs"
                        onClick={() => onLayoutChange(option.key)}
                        title={option.description}
                    >
                        {option.icon}
                        <span className="hidden sm:inline">{option.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default LayoutControls;