/**
 * Box Component Implementation for Canvas JSX
 * Supports CSS properties, style prop, className (with twrn), and direct CSS props
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalify } from '@sky-modules/core'

import { computeLayout, type LayoutBox } from '../../../design/Layout/Layout.Engine'

import {
    expandPandaCSSProps,
    extractDirectCSSProps,
    mergeStyles,
    normalizeProperties,
    parseUnit,
    type ParsedStyles,
} from './styles-parser'
import { mergeTailwindClasses, tailwindClassesToCSS } from './twrn'

import type { CSSProperties } from '../../rendering/renderCSSToCanvas'

export interface BoxProps {
    // Standard props
    id?: string
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

    // Panda CSS shorthand props
    m?: string | number
    mt?: string | number
    mr?: string | number
    mb?: string | number
    ml?: string | number
    mx?: string | number
    my?: string | number
    p?: string | number
    pt?: string | number
    pr?: string | number
    pb?: string | number
    pl?: string | number
    px?: string | number
    py?: string | number
    w?: string | number
    h?: string | number
    bg?: string
    rounded?: string | number
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
        ...directProps
    } = props

    // Extract direct CSS properties from props
    const directCSSProps = extractDirectCSSProps(directProps)

    // Expand Panda CSS shorthand props (m, mt, p, w, h, etc.)
    const pandaCSSProps = expandPandaCSSProps(directProps)

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
    // Priority: directCSSProps > pandaCSSProps > styleCSS > classNameCSS > sxCSS
    const mergedStyles: ParsedStyles = mergeStyles(
        sxCSS,
        classNameCSS,
        styleCSS,
        pandaCSSProps,
        directCSSProps
    )

    // Process children with layout engine
    const childArray = children ? (Array.isArray(children) ? children : [children]) : []

    // Generate unique ID for this box
    const id = props.id || `box-${Math.random().toString(36).substr(2, 9)}`

    // Build layout box tree
    const layoutBox: LayoutBox = {
        id,
        styles: mergedStyles as any,
        children: childArray
            .filter(child => child && child.props?._isBox)
            .map((child, idx) => {
                const childStyles = child.props._boxStyles || {}
                return {
                    id: child.props.id || `child-${idx}`,
                    styles: {
                        ...childStyles,
                        width: childStyles.width || 100,
                        height: childStyles.height || 100,
                    },
                }
            }),
    }

    // Compute layout
    const layoutedBox = computeLayout(layoutBox)

    // Extract width and height with auto-sizing support
    const widthValue = mergedStyles.width
    const heightValue = mergedStyles.height

    let width: number
    let height: number

    // Check if width needs auto-sizing
    if (
        !widthValue ||
        widthValue === 'auto' ||
        widthValue === 'min-content' ||
        widthValue === 'max-content' ||
        widthValue === 'fit-content'
    ) {
        width = (layoutedBox.styles._contentWidth as number) || 100
    } else {
        width = typeof widthValue === 'number' ? widthValue : parseUnit(String(widthValue))
    }

    // Check if height needs auto-sizing
    if (
        !heightValue ||
        heightValue === 'auto' ||
        heightValue === 'min-content' ||
        heightValue === 'max-content' ||
        heightValue === 'fit-content'
    ) {
        height = (layoutedBox.styles._contentHeight as number) || 100
    } else {
        height = typeof heightValue === 'number' ? heightValue : parseUnit(String(heightValue))
    }

    // Extract background color for material
    const backgroundColor = mergedStyles.backgroundColor || mergedStyles.background || '#ffffff'

    // Extract opacity
    const opacity = mergedStyles.opacity !== undefined ? mergedStyles.opacity : 1

    // Apply computed positions to children
    let boxChildIndex = 0
    const layoutedChildren = childArray.map(child => {
        if (!child || !child.props?._isBox) {
            // Non-Box child (text, etc.) - pass through
            return child
        }

        const layoutInfo = layoutedBox.children?.[boxChildIndex]
        boxChildIndex++

        if (layoutInfo && layoutInfo.position) {
            // Apply computed position
            return {
                ...child,
                props: {
                    ...child.props,
                    position: layoutInfo.position,
                },
            }
        }

        return child
    })

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
        id, // Add ID for layout engine
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
            // Nested children with computed positions
            ...layoutedChildren,
        ],
    }

    return {
        type: 'Mesh',
        props: meshProps,
    }
}

globalify({ Box })
