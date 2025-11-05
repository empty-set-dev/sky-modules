/**
 * Box Component for Canvas JSX
 * Supports CSS properties, style prop, className (with twrn), and direct CSS props
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    extractDirectCSSProps,
    mergeStyles,
    normalizeProperties,
    type ParsedStyles,
} from './styles-parser'
import { mergeTailwindClasses, tailwindClassesToCSS } from './twrn'

import type { CSSProperties } from '../../rendering/renderCSSToCanvas'

export interface BoxProps {
    // Standard props
    children?: any
    ref?: (mesh: any) => void
    position?: [number, number]
    rotation?: number
    scale?: [number, number]
    visible?: boolean
    onUpdate?: (mesh: any, time: number, delta: number) => void

    // Style props
    style?: CSSProperties | Record<string, unknown>
    className?: string | string[]
    twrn?: boolean // Enable Tailwind merge (default: true)

    // sx prop (styled-system style)
    sx?: CSSProperties | Record<string, unknown>

    // Text content
    text?: string

    // CSS Properties (all from CSSProperties but allowing overrides)
    width?: string | number
    height?: string | number
    padding?: string | number
    paddingTop?: string | number
    paddingRight?: string | number
    paddingBottom?: string | number
    paddingLeft?: string | number
    margin?: string | number
    marginTop?: string | number
    marginRight?: string | number
    marginBottom?: string | number
    marginLeft?: string | number
    backgroundColor?: string
    background?: string
    backgroundImage?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundRepeat?: string
    border?: string
    borderWidth?: string | number
    borderStyle?: string
    borderColor?: string
    borderRadius?: string | number
    borderTopLeftRadius?: string | number
    borderTopRightRadius?: string | number
    borderBottomLeftRadius?: string | number
    borderBottomRightRadius?: string | number
    boxShadow?: string
    textShadow?: string
    color?: string
    fontSize?: string
    fontFamily?: string
    fontWeight?: string | number
    fontStyle?: string
    textAlign?: CanvasTextAlign
    lineHeight?: string | number
    opacity?: number
    transform?: string
    display?: string
    // position prop conflicts with Mesh position, use top/left instead for CSS positioning
    top?: string | number
    left?: string | number
    right?: string | number
    bottom?: string | number
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    justifyContent?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    alignContent?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'stretch'
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    gap?: string | number
    rowGap?: string | number
    columnGap?: string | number
    gridTemplateColumns?: string
    gridTemplateRows?: string
    gridGap?: string | number
    gridRowGap?: string | number
    gridColumnGap?: string | number
    gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense'
}

/**
 * Box component - renders a styled rectangle on canvas
 * Merges styles in priority order:
 * 1. Direct CSS props (highest priority)
 * 2. style prop
 * 3. className (Tailwind utilities)
 * 4. sx prop (lowest priority)
 */
export function Box(props: BoxProps): any {
    const {
        children,
        ref,
        position,
        rotation,
        scale,
        visible,
        onUpdate,
        style,
        className,
        twrn = true,
        sx,
        text,
        ...directProps
    } = props

    // Extract direct CSS properties from props
    const directCSSProps = extractDirectCSSProps(directProps)

    // Parse className to CSS (with twrn if enabled)
    let classNameCSS: CSSProperties = {}

    if (className) {
        const classString = typeof className === 'string' ? className : className.join(' ')

        // Merge conflicting Tailwind classes if twrn is enabled
        const mergedClasses = twrn ? mergeTailwindClasses(classString) : classString

        // Convert to CSS
        classNameCSS = tailwindClassesToCSS(mergedClasses)
    }

    // Normalize sx prop
    const sxCSS = sx ? normalizeProperties(sx as Record<string, unknown>) : {}

    // Normalize style prop
    const styleCSS = style ? normalizeProperties(style as Record<string, unknown>) : {}

    // Merge all styles with proper priority
    // Priority: directCSSProps > styleCSS > classNameCSS > sxCSS
    const mergedStyles: ParsedStyles = mergeStyles(sxCSS, classNameCSS, styleCSS, directCSSProps)

    // Extract width and height for geometry
    const width =
        typeof mergedStyles.width === 'number'
            ? mergedStyles.width
            : parseFloat(String(mergedStyles.width || 100))

    const height =
        typeof mergedStyles.height === 'number'
            ? mergedStyles.height
            : parseFloat(String(mergedStyles.height || 100))

    // Extract background color for material
    const backgroundColor = mergedStyles.backgroundColor || mergedStyles.background || '#ffffff'

    // Extract opacity
    const opacity = mergedStyles.opacity !== undefined ? mergedStyles.opacity : 1

    // Build the Mesh element with RectGeometry and BasicMaterial
    // We'll use internal _boxStyles to pass CSS props to renderer
    const meshProps: any = {
        ref,
        rotation,
        scale,
        visible,
        onUpdate,
        position: position || [0, 0], // Always provide a position (default to [0, 0])
        _boxStyles: mergedStyles, // Internal prop for CSS rendering
        _isBox: true, // Mark as Box for special handling
        children: [
            // Geometry
            {
                type: 'RectGeometry',
                props: {
                    width,
                    height,
                    x: 0,
                    y: 0,
                },
            },
            // Material
            {
                type: 'BasicMaterial',
                props: {
                    color: backgroundColor,
                    opacity,
                },
            },
            // Nested children (Box components, text, etc.)
            // Include all children - text will be handled by jsx.tsx renderer
            ...(children ? (Array.isArray(children) ? children : [children]) : []),
        ],
    }

    return {
        type: 'Mesh',
        props: meshProps,
    }
}

// Export for use in jsx.tsx
export default Box
