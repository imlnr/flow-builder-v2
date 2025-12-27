import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import {
    getLayoutedElements,
    getTreeLayout,
    getForceLayout,
    getGridLayout,
    getCircularLayout
} from '../utils/layoutUtils';

export const LAYOUT_TYPES = {
    AUTO: 'auto',
    TREE: 'tree',
    FORCE: 'force',
    GRID: 'grid',
    CIRCULAR: 'circular',
    HIERARCHICAL_TB: 'hierarchical-tb',
    HIERARCHICAL_LR: 'hierarchical-lr',
};

export const useLayout = (nodes, edges, setNodes, setEdges) => {
    const { fitView } = useReactFlow();

    const applyLayout = useCallback((layoutType, options = {}) => {
        let layoutedElements;

        switch (layoutType) {
            case LAYOUT_TYPES.AUTO:
            case LAYOUT_TYPES.HIERARCHICAL_TB:
                layoutedElements = getLayoutedElements(nodes, edges, 'TB');
                break;

            case LAYOUT_TYPES.HIERARCHICAL_LR:
                layoutedElements = getLayoutedElements(nodes, edges, 'LR');
                break;

            case LAYOUT_TYPES.TREE:
                layoutedElements = getTreeLayout(nodes, edges, options.rootNodeId);
                break;

            case LAYOUT_TYPES.FORCE:
                layoutedElements = getForceLayout(nodes, edges, options.iterations || 50);
                break;

            case LAYOUT_TYPES.GRID:
                layoutedElements = getGridLayout(nodes, edges, options.columns || 3);
                break;

            case LAYOUT_TYPES.CIRCULAR:
                layoutedElements = getCircularLayout(nodes, edges, options.radius || 200);
                break;

            default:
                layoutedElements = getLayoutedElements(nodes, edges, 'TB');
        }

        setNodes(layoutedElements.nodes);
        setEdges(layoutedElements.edges);

        // Fit view after layout with animation
        setTimeout(() => {
            fitView({ padding: 0.1, duration: 800 });
        }, 100);
    }, [nodes, edges, setNodes, setEdges, fitView]);

    const autoLayout = useCallback(() => {
        applyLayout(LAYOUT_TYPES.AUTO);
    }, [applyLayout]);

    const treeLayout = useCallback((rootNodeId) => {
        applyLayout(LAYOUT_TYPES.TREE, { rootNodeId });
    }, [applyLayout]);

    const forceLayout = useCallback((iterations = 50) => {
        applyLayout(LAYOUT_TYPES.FORCE, { iterations });
    }, [applyLayout]);

    const gridLayout = useCallback((columns = 3) => {
        applyLayout(LAYOUT_TYPES.GRID, { columns });
    }, [applyLayout]);

    const circularLayout = useCallback((radius = 200) => {
        applyLayout(LAYOUT_TYPES.CIRCULAR, { radius });
    }, [applyLayout]);

    return {
        applyLayout,
        autoLayout,
        treeLayout,
        forceLayout,
        gridLayout,
        circularLayout,
        LAYOUT_TYPES,
    };
};