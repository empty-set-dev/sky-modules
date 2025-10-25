import { createRenderer } from 'solid-js/universal'

// Re-export JSX namespace
export type { JSX } from './JSX'

// Create a minimal universal renderer that just builds JSX objects
// babel-preset-solid will wrap reactive props in getters, which we can read in Canvas renderer
const {
    render,
    effect,
    memo,
    createComponent: solidCreateComponent,
    createElement,
    createTextNode,
    insertNode,
    insert,
    spread,
    setProp,
    mergeProps,
} = createRenderer({
    createElement(type: string | Function): JSX.Element {
        // Create a JSX element object
        // If type is a class, keep it as-is so it can be instantiated with 'new' later
        // If type is a function component, it will be called with props later
        return {
            type,
            props: {},
            key: '',
        } as any
    },

    createTextNode(_value: string): any {
        // Canvas doesn't support text nodes
        return null
    },

    replaceText(_textNode: any, _value: string): void {
        // Canvas doesn't support text nodes
    },

    setProperty(node: any, name: string, value: any): void {
        // Set props on the JSX element
        if (!node.props) {
            node.props = {}
        }
        node.props[name] = value
    },

    insertNode(parent: any, node: any, _anchor: any): void {
        // Add children to the JSX element
        if (!node) return

        if (!parent.props) {
            parent.props = {}
        }

        if (!parent.props.children) {
            parent.props.children = []
        }

        if (Array.isArray(parent.props.children)) {
            parent.props.children.push(node)
        } else {
            parent.props.children = [parent.props.children, node]
        }
    },

    isTextNode(_node: any): boolean {
        return false
    },

    removeNode(parent: any, node: any): void {
        if (!parent.props || !parent.props.children) return

        if (Array.isArray(parent.props.children)) {
            const index = parent.props.children.indexOf(node)
            if (index !== -1) {
                parent.props.children.splice(index, 1)
            }
        }
    },

    getParentNode(_node: any): any {
        return null
    },

    getFirstChild(node: any): any {
        if (!node.props || !node.props.children) return null
        if (Array.isArray(node.props.children)) {
            return node.props.children[0]
        }
        return node.props.children
    },

    getNextSibling(_node: any): any {
        return null
    },
})

// Helper to check if something is a class
function isClass(func: any): boolean {
    return typeof func === 'function' &&
           /^class\s/.test(Function.prototype.toString.call(func))
}

// Custom createComponent that handles classes (doesn't try to call them as functions)
function createComponent(component: any, props: any): any {
    // Check if component is a class
    if (isClass(component)) {
        // It's a class - return JSX object with class as type (don't call it)
        return {
            type: component,
            props: props || {},
        }
    }

    // It's a function component - call it directly and return the result
    // The function is already being tracked by Solid.js reactive context
    // Don't unwrap here - let the renderer handle it to avoid infinite loops
    return component(props || {})
}

// Export our custom createComponent and other renderer functions
export {
    render,
    effect,
    memo,
    createComponent,
    createElement,
    createTextNode,
    insertNode,
    insert,
    spread,
    setProp,
    mergeProps,
}

// Re-export Fragment
export { Fragment } from './jsx-runtime'

// Re-export SolidJS reactive primitives for use in components
export {
    createSignal,
    createEffect,
    createMemo,
    createRoot,
    onCleanup,
    onMount,
    untrack,
    batch,
    on,
    createContext,
    useContext,
} from 'solid-js'
