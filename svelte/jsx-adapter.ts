import JSXRenderer from './index.svelte'

import type { JSXNode } from './index.svelte'

/**
 * Create JSX-like node for Svelte rendering
 */
export function jsx(type: string | any, props?: Record<string, any>, ...children: any[]): JSXNode {
    return {
        type,
        props: props || {},
        children:
            children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
        key: props?.key || null,
    }
}

/**
 * Fragment helper for grouping elements without wrapper
 */
export function Fragment(props: { children?: any }): JSXNode {
    return {
        type: 'Fragment',
        props: {},
        children: props.children,
        key: null,
    }
}

/**
 * Convert JSX-like structure to renderable format
 */
export function createJSXTree(element: any): JSXNode {
    if (typeof element === 'string') {
        return {
            type: 'span',
            props: {},
            children: element,
            key: null,
        }
    }

    if (Array.isArray(element)) {
        return {
            type: Fragment,
            props: {},
            children: element.map(createJSXTree),
            key: null,
        }
    }

    return element as JSXNode
}

// Export the renderer component
export { JSXRenderer }
export type { JSXNode }

// Default export for convenience
export default {
    jsx,
    Fragment,
    createJSXTree,
    JSXRenderer,
    render: (node: JSXNode) => ({ node }),
}
