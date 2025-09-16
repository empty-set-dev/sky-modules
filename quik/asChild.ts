import type { JSXNode, QwikIntrinsicElements } from '@builder.io/qwik'

export interface CloneElementProps {
    [key: string]: unknown
}

/**
 * Clones a Qwik JSX element with new props
 * @param element - Original JSX element
 * @param props - New props to apply
 * @param children - New children elements (optional)
 * @returns Cloned element with merged props
 */
export default function asChild<T = unknown>(
    element: JSXNode<T>,
    props?: CloneElementProps,
    ...children: JSXNode[]
): JSXNode<T> {
    if (!element || typeof element !== 'object') {
        return element
    }

    // If element has JSX structure
    if ('type' in element && 'props' in element) {
        const mergedProps = {
            ...(element.props as Record<string, unknown>),
            ...props,
        }

        // If new children are passed
        if (children.length > 0) {
            mergedProps.children = children.length === 1 ? children[0] : children
        } else if (props?.children !== undefined) {
            mergedProps.children = props.children
        }

        return {
            ...element,
            props: mergedProps,
        } as JSXNode<T>
    }

    return element
}

/**
 * Utility for creating asChild component in Qwik
 * @param asChild - Flag for using asChild pattern
 * @param defaultTag - Default tag if asChild = false
 * @param props - Component props
 * @param children - Children elements
 * @returns Element or cloned child element
 */
export function createAsChildElement<T extends keyof QwikIntrinsicElements>(
    asChild: boolean,
    defaultTag: T,
    props: QwikIntrinsicElements[T] & { children?: JSXNode },
    children?: JSXNode
): JSXNode {
    const { children: propsChildren, ...restProps } = props

    if (asChild && children) {
        // If there's a child element and asChild is used
        if (Array.isArray(children)) {
            // Clone the first child element
            const firstChild = children[0]
            if (firstChild) {
                return asChild(firstChild, restProps as CloneElementProps)
            }
        } else {
            return asChild(children, restProps as CloneElementProps)
        }
    }

    // Create regular element
    const elementProps: Record<string, unknown> = {
        ...restProps,
        children: children || propsChildren,
    }

    return {
        type: defaultTag,
        props: elementProps,
        children: elementProps.children as JSXNode,
        key: null,
    } as JSXNode
}

/**
 * Hook for merging props with asChild logic
 * @param baseProps - Base props
 * @param userProps - User props
 * @param asChild - asChild flag
 * @returns Merged props
 */
export function mergeAsChildProps<T extends Record<string, unknown> = Record<string, unknown>>(
    baseProps: T,
    userProps?: Partial<T>,
    asChild?: boolean
): T {
    if (!asChild) {
        return { ...baseProps, ...userProps } as T
    }

    // For asChild components merge only necessary props
    const merged = { ...baseProps }

    if (userProps) {
        Object.keys(userProps).forEach(key => {
            const value = (userProps as Record<string, unknown>)[key]
            if (value !== undefined) {
                ;(merged as Record<string, unknown>)[key] = value
            }
        })
    }

    return merged
}
