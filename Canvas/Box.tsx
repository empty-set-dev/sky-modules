import { BoxProps } from './jsx'

/**
 * Box component with asChild pattern for Canvas JSX
 *
 * Allows applying styles to child elements without adding wrapper
 *
 * @example
 * <Box w="100" h="50" bg="red.500" asChild>
 *   <rect />
 * </Box>
 *
 * @example
 * <Box r="30" fill="blue.400" x="100" y="50" asChild>
 *   <circle />
 * </Box>
 */
export function Box({ asChild = false, children, ...styleProps }: BoxProps) {
    if (!asChild) {
        // Render as regular rect when asChild is false
        return {
            type: 'rect',
            props: styleProps,
            children: null
        }
    }

    if (!children) {
        console.warn('Box with asChild requires a child element')
        return null
    }

    // Clone child and merge props
    const child = Array.isArray(children) ? children[0] : children

    if (!child) {
        return null
    }

    // Merge Box props with child props, giving precedence to child props
    const mergedProps = {
        ...styleProps,
        ...child.props
    }

    return {
        type: child.type,
        props: mergedProps,
        children: child.children
    }
}

// Convenience components with predefined shapes
export function BoxRect(props: BoxProps) {
    return Box({ ...props, asChild: false })
}

export function BoxCircle({ r, radius, ...props }: BoxProps & { r?: string | number; radius?: string | number }) {
    return {
        type: 'circle',
        props: {
            ...props,
            r: r || radius
        },
        children: null
    }
}

export function BoxText({ children, ...props }: BoxProps & { children?: string | number }) {
    return {
        type: 'text',
        props: props,
        children: children
    }
}

// Compound component pattern
Box.Rect = BoxRect
Box.Circle = BoxCircle
Box.Text = BoxText

export default Box