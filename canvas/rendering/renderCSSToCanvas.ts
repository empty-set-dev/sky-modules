/**
 * Renders CSS properties to Canvas context
 * Supports both camelCase and kebab-case property names
 * Handles text, shapes, backgrounds, borders, shadows, and other CSS properties
 */

// Import utilities
import { normalizeProperties, parseUnit, parsePadding } from './utils/parsing'
import type { ParsedBox } from './utils/drawing'
import { drawBackground, drawBorder, drawBoxShadow } from './utils/drawing'
import { applyTextStyles, renderText } from './utils/text'
import { calculateFlexLayout, calculateGridLayout } from './utils/layout'

export interface CSSProperties {
    // Text properties
    color?: string
    fontSize?: string
    fontFamily?: string
    fontWeight?: string | number
    fontStyle?: string
    textAlign?: CanvasTextAlign
    textBaseline?: CanvasTextBaseline
    lineHeight?: string | number

    // Box model
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

    // Background
    background?: string
    backgroundColor?: string
    backgroundImage?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundRepeat?: string

    // Border
    border?: string
    borderWidth?: string | number
    borderStyle?: string
    borderColor?: string
    borderRadius?: string | number
    borderTopLeftRadius?: string | number
    borderTopRightRadius?: string | number
    borderBottomLeftRadius?: string | number
    borderBottomRightRadius?: string | number

    // Shadow
    boxShadow?: string
    textShadow?: string

    // Transform
    transform?: string
    opacity?: number

    // Layout
    display?: string
    position?: string
    top?: string | number
    left?: string | number
    right?: string | number
    bottom?: string | number
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
    overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
    overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'

    // Flexbox
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

    // Grid
    gridTemplateColumns?: string
    gridTemplateRows?: string
    gridGap?: string | number
    gridRowGap?: string | number
    gridColumnGap?: string | number
    gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense'

    // Kebab-case layout variants
    'flex-direction'?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    'justify-content'?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    'align-items'?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    'align-content'?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'stretch'
    'flex-wrap'?: 'nowrap' | 'wrap' | 'wrap-reverse'
    'row-gap'?: string | number
    'column-gap'?: string | number
    'grid-template-columns'?: string
    'grid-template-rows'?: string
    'grid-gap'?: string | number
    'grid-row-gap'?: string | number
    'grid-column-gap'?: string | number
    'grid-auto-flow'?: 'row' | 'column' | 'row dense' | 'column dense'

    // Kebab-case variants
    'font-size'?: string
    'font-family'?: string
    'font-weight'?: string | number
    'font-style'?: string
    'text-align'?: CanvasTextAlign
    'text-baseline'?: CanvasTextBaseline
    'line-height'?: string | number
    'background-color'?: string
    'background-image'?: string
    'background-size'?: string
    'background-position'?: string
    'background-repeat'?: string
    'border-width'?: string | number
    'border-style'?: string
    'border-color'?: string
    'border-radius'?: string | number
    'box-shadow'?: string
    'text-shadow'?: string
    [key: string]: unknown
}

export interface RenderOptions {
    /** Text content to render */
    text?: string
    /** X position */
    x?: number
    /** Y position */
    y?: number
    /** Clear canvas before rendering */
    clear?: boolean
    /** Draw rectangle/box */
    box?: boolean
    /** Fill text/shape */
    fill?: boolean
    /** Stroke text/shape */
    stroke?: boolean
    /** Child elements for flex/grid layout */
    children?: ChildElement[]
    /** Pixel ratio for high-DPI displays */
    pixelRatio?: number
}

export interface ChildElement {
    /** Child CSS properties */
    css: CSSProperties
    /** Child render options */
    options?: Omit<RenderOptions, 'children' | 'x' | 'y'>
}

/**
 * Renders CSS properties to Canvas
 */
export default function renderCSSToCanvas(
    ctx: CanvasRenderingContext2D,
    css: CSSProperties,
    options: RenderOptions = {}
): void {
    const normalized = normalizeProperties(css)
    const {
        text,
        x = 0,
        y = 0,
        clear = false,
        box = false,
        fill = true,
        stroke = false,
        children = [],
        pixelRatio = 1,
    } = options

    // Clear canvas if requested
    if (clear) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    // Apply opacity
    if (normalized.opacity !== undefined) {
        ctx.globalAlpha = normalized.opacity
    }

    // Parse box dimensions
    const width = parseUnit(normalized.width || ctx.canvas.width)
    const height = parseUnit(normalized.height || ctx.canvas.height)
    const padding = parsePadding(normalized.padding || 0)

    // Override individual padding values
    if (normalized.paddingTop || normalized['padding-top']) {
        padding.top = parseUnit(
            (normalized.paddingTop || normalized['padding-top']!) as string | number
        )
    }

    if (normalized.paddingRight || normalized['padding-right']) {
        padding.right = parseUnit(
            (normalized.paddingRight || normalized['padding-right']!) as string | number
        )
    }

    if (normalized.paddingBottom || normalized['padding-bottom']) {
        padding.bottom = parseUnit(
            (normalized.paddingBottom || normalized['padding-bottom']!) as string | number
        )
    }

    if (normalized.paddingLeft || normalized['padding-left']) {
        padding.left = parseUnit(
            (normalized.paddingLeft || normalized['padding-left']!) as string | number
        )
    }

    const parsedBox: ParsedBox = {
        x,
        y,
        width,
        height,
        padding,
    }

    // Draw box if requested
    if (box) {
        drawBoxShadow(ctx, normalized, parsedBox)
        drawBackground(ctx, normalized, parsedBox)
        drawBorder(ctx, normalized, parsedBox)
    }

    // Apply clipping for overflow
    const overflow = normalized.overflow || 'visible'
    const shouldClip = overflow === 'hidden' || overflow === 'scroll' || overflow === 'auto'

    if (shouldClip) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        ctx.clip()
    }

    // Render text if provided
    if (text) {
        applyTextStyles(ctx, normalized, pixelRatio)

        const textX = x + padding.left
        const textY = y + padding.top

        // Calculate available width for text wrapping
        const textMaxWidth = width - padding.left - padding.right

        // Get line height from CSS or calculate from font size
        const fontSizeValue = normalized.fontSize || '16px'
        const fontSize =
            typeof fontSizeValue === 'string' ? parseUnit(fontSizeValue) : fontSizeValue
        const lineHeightValue = normalized.lineHeight
        const lineHeight = lineHeightValue
            ? typeof lineHeightValue === 'number'
                ? lineHeightValue
                : parseUnit(String(lineHeightValue))
            : fontSize * 1.2

        // Render text with wrapping
        renderText({
            text,
            ctx,
            x: textX,
            y: textY,
            maxWidth: textMaxWidth,
            lineHeight,
            fill,
            stroke,
            pixelRatio,
        })
    }

    // Render children with layout
    if (children.length > 0) {
        const display = normalized.display
        let childPositions: Array<{ x: number; y: number; width: number; height: number }> = []

        if (display === 'flex') {
            childPositions = calculateFlexLayout(normalized, parsedBox, children)
        } else if (display === 'grid') {
            childPositions = calculateGridLayout(normalized, parsedBox, children)
        }

        // Render each child at calculated position
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            const pos = childPositions[i]

            if (pos) {
                // Merge child size with calculated position
                const childCSS = {
                    ...child.css,
                    width: child.css.width || pos.width,
                    height: child.css.height || pos.height,
                }

                renderCSSToCanvas(ctx, childCSS, {
                    ...child.options,
                    x: pos.x,
                    y: pos.y,
                    box: true,
                })
            }
        }
    }

    // Restore context if clipping was applied
    if (shouldClip) {
        ctx.restore()
    }

    // Reset global alpha
    ctx.globalAlpha = 1
}
