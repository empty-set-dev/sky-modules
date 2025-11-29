/**
 * Box Component Implementation for Canvas JSX
 * Supports CSS properties, style prop, className (with twrn), and direct CSS props
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalify } from '@sky-modules/core'
import { computeLayout, type LayoutBox } from '@sky-modules/design'

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
import { wrapText } from '../../rendering/wrapText'

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
    flexGrow?: number
    flexShrink?: number
    flexBasis?: string | number
    gap?: string | number
    rowGap?: string | number
    columnGap?: string | number
    gridTemplateColumns?: string
    gridTemplateRows?: string
    gridGap?: string | number
    gridRowGap?: string | number
    gridColumnGap?: string | number
    gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense'
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
    overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
    overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'

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
            .filter(child => {
                // Check if child is a Box component (before it's processed)
                if (!child) return false
                // Check type name (for function components)
                if (child.type === Box || child.type?.name === 'Box') return true
                // Check if already processed (has _isBox flag)
                if (child.props?._isBox) return true
                return false
            })
            .map((child, idx) => {
                // Try to get styles from already processed Box, or from original props
                let childStyles = child.props._boxStyles

                // If not processed yet, extract and merge CSS props from raw props
                if (!childStyles) {
                    const childDirectProps = extractDirectCSSProps(child.props)
                    const childPandaProps = expandPandaCSSProps(child.props)
                    childStyles = mergeStyles(childPandaProps, childDirectProps)
                }

                return {
                    id: child.props.id || `child-${idx}`,
                    // Pass styles as-is - layout engine will handle auto-width
                    styles: childStyles,
                }
            }),
    }

    // Compute layout with window size as parent context for root boxes
    // This allows auto-width to work from the root level
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 600

    const layoutedBox = computeLayout(layoutBox, {
        width: windowWidth,
        height: windowHeight,
    })

    // Extract width and height with auto-sizing support
    const widthValue = mergedStyles.width
    const heightValue = mergedStyles.height

    let width: number
    let height: number

    // Check if this is a text-only Box (children are all strings)
    const hasOnlyTextChildren =
        childArray.length > 0 && childArray.every(child => typeof child === 'string')

    // Check if width needs auto-sizing
    if (
        !widthValue ||
        widthValue === 'auto' ||
        widthValue === 'min-content' ||
        widthValue === 'max-content' ||
        widthValue === 'fit-content'
    ) {
        const contentWidth = (layoutedBox.styles._contentWidth as number) || 0
        // For text-only boxes without explicit width, use a large default width
        // This allows text to render at natural width
        if (hasOnlyTextChildren && contentWidth === 0) {
            width = 800 // Default width for text content
        } else {
            width = contentWidth || 100
        }
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
        const contentHeight = (layoutedBox.styles._contentHeight as number) || 0
        // For text-only boxes, calculate height based on wrapped lines
        if (hasOnlyTextChildren && contentHeight === 0) {
            const fontSize = mergedStyles.fontSize
                ? parseUnit(String(mergedStyles.fontSize))
                : 16
            const lineHeight = mergedStyles.lineHeight
                ? typeof mergedStyles.lineHeight === 'number'
                    ? mergedStyles.lineHeight
                    : parseUnit(String(mergedStyles.lineHeight))
                : fontSize * 1.2

            // Calculate number of lines after text wrapping
            const text = childArray.join(' ')
            let lineCount = 1

            // Only calculate wrapping if we have a width constraint
            if (width > 0) {
                // Create temporary canvas for measuring text
                const tempCanvas =
                    typeof document !== 'undefined'
                        ? document.createElement('canvas')
                        : ({
                              getContext: () => ({
                                  measureText: () => ({ width: 0 }),
                                  font: '',
                              }),
                          } as any)

                const ctx = tempCanvas.getContext('2d')
                if (ctx) {
                    // Set font for accurate measurement
                    const fontFamily = mergedStyles.fontFamily || 'sans-serif'
                    const fontWeight = mergedStyles.fontWeight || 'normal'
                    const fontStyle = mergedStyles.fontStyle || 'normal'
                    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

                    // Calculate text width minus padding
                    const paddingLeft = mergedStyles.paddingLeft
                        ? parseUnit(String(mergedStyles.paddingLeft))
                        : mergedStyles.padding
                          ? parseUnit(String(mergedStyles.padding))
                          : 0
                    const paddingRight = mergedStyles.paddingRight
                        ? parseUnit(String(mergedStyles.paddingRight))
                        : mergedStyles.padding
                          ? parseUnit(String(mergedStyles.padding))
                          : 0
                    const textMaxWidth = width - paddingLeft - paddingRight

                    // Wrap text and count lines
                    const lines = wrapText({
                        text,
                        maxWidth: textMaxWidth,
                        ctx,
                        wordWrap: 'normal',
                    })
                    lineCount = lines.length
                }
            }

            height = lineHeight * lineCount
        } else {
            height = contentHeight || 100
        }
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
        // Check if this is a Box component (same logic as filter above)
        const isBoxComponent =
            child &&
            (child.type === Box || child.type?.name === 'Box' || child.props?._isBox)

        if (!isBoxComponent) {
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
