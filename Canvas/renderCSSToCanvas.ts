/**
 * Renders CSS properties to Canvas context
 * Supports both camelCase and kebab-case property names
 * Handles text, shapes, backgrounds, borders, shadows, and other CSS properties
 */

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
}

export interface ChildElement {
    /** Child CSS properties */
    css: CSSProperties
    /** Child render options */
    options?: Omit<RenderOptions, 'children' | 'x' | 'y'>
}

interface ParsedBox {
    x: number
    y: number
    width: number
    height: number
    padding: { top: number; right: number; bottom: number; left: number }
}

interface ParsedShadow {
    offsetX: number
    offsetY: number
    blur: number
    color: string
}

/**
 * Converts kebab-case to camelCase
 */
function kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Normalizes CSS properties object to camelCase
 */
function normalizeProperties(css: CSSProperties): CSSProperties {
    const normalized: CSSProperties = {}

    for (const [key, value] of Object.entries(css)) {
        if (value === undefined) continue

        const camelKey = key.includes('-') ? kebabToCamel(key) : key
        normalized[camelKey] = value
    }

    return normalized
}

/**
 * Parses CSS unit value to pixels
 */
function parseUnit(value: string | number, baseSize = 16): number {
    if (typeof value === 'number') return value

    const num = parseFloat(value)
    if (value.endsWith('px')) return num
    if (value.endsWith('em')) return num * baseSize
    if (value.endsWith('rem')) return num * baseSize
    if (value.endsWith('%')) return num // Will be calculated relative to parent
    return num
}

/**
 * Parses padding/margin shorthand
 */
function parsePadding(value: string | number): {
    top: number
    right: number
    bottom: number
    left: number
} {
    if (typeof value === 'number') {
        return { top: value, right: value, bottom: value, left: value }
    }

    const parts = value.split(/\s+/).map(p => parseUnit(p))

    if (parts.length === 1) {
        return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] }
    }

    if (parts.length === 2) {
        return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] }
    }

    if (parts.length === 3) {
        return {
            top: parts[0],
            right: parts[1],
            bottom: parts[2],
            left: parts[1],
        }
    }

    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] }
}

/**
 * Parses box shadow string
 */
function parseBoxShadow(shadow: string): ParsedShadow | null {
    // Format: offsetX offsetY blurRadius color
    const match = shadow.match(
        /(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(-?\d+(?:\.\d+)?(?:px)?)\s+(.+)/
    )

    if (!match) return null

    return {
        offsetX: parseUnit(match[1]),
        offsetY: parseUnit(match[2]),
        blur: parseUnit(match[3]),
        color: match[4],
    }
}

/**
 * Parses text shadow string
 */
function parseTextShadow(shadow: string): ParsedShadow | null {
    return parseBoxShadow(shadow)
}

/**
 * Parses border radius values
 */
function parseBorderRadius(css: CSSProperties): number[] {
    const radius = css.borderRadius || css['border-radius']

    if (radius !== undefined) {
        const value = parseUnit(radius)
        return [value, value, value, value]
    }

    return [
        parseUnit(
            (css.borderTopLeftRadius || css['border-top-left-radius'] || 0) as string | number
        ),
        parseUnit(
            (css.borderTopRightRadius || css['border-top-right-radius'] || 0) as string | number
        ),
        parseUnit(
            (css.borderBottomRightRadius || css['border-bottom-right-radius'] || 0) as
                | string
                | number
        ),
        parseUnit(
            (css.borderBottomLeftRadius || css['border-bottom-left-radius'] || 0) as string | number
        ),
    ]
}

/**
 * Applies text styles to canvas context
 */
function applyTextStyles(ctx: CanvasRenderingContext2D, css: CSSProperties): void {
    const fontSizeValue = css.fontSize || css['font-size'] || '16px'
    const fontSize =
        typeof fontSizeValue === 'string' &&
        (fontSizeValue.endsWith('em') || fontSizeValue.endsWith('rem'))
            ? `${parseUnit(fontSizeValue)}px`
            : fontSizeValue
    const fontFamily = css.fontFamily || css['font-family'] || 'sans-serif'
    const fontWeight = css.fontWeight || css['font-weight'] || 'normal'
    const fontStyle = css.fontStyle || css['font-style'] || 'normal'

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`

    if (css.color) {
        ctx.fillStyle = css.color
        ctx.strokeStyle = css.color
    }

    if (css.textAlign || css['text-align']) {
        ctx.textAlign = (css.textAlign || css['text-align'])!
    }

    if (css.textBaseline || css['text-baseline']) {
        ctx.textBaseline = (css.textBaseline || css['text-baseline'])!
    }

    // Apply text shadow
    const textShadow = css.textShadow || css['text-shadow']

    if (textShadow) {
        const shadow = parseTextShadow(textShadow)

        if (shadow) {
            ctx.shadowOffsetX = shadow.offsetX
            ctx.shadowOffsetY = shadow.offsetY
            ctx.shadowBlur = shadow.blur
            ctx.shadowColor = shadow.color
        }
    }
}

/**
 * Draws a rounded rectangle path
 */
function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radii: number[]
): void {
    const [tl, tr, br, bl] = radii

    ctx.beginPath()
    ctx.moveTo(x + tl, y)
    ctx.lineTo(x + width - tr, y)
    ctx.arcTo(x + width, y, x + width, y + tr, tr)
    ctx.lineTo(x + width, y + height - br)
    ctx.arcTo(x + width, y + height, x + width - br, y + height, br)
    ctx.lineTo(x + bl, y + height)
    ctx.arcTo(x, y + height, x, y + height - bl, bl)
    ctx.lineTo(x, y + tl)
    ctx.arcTo(x, y, x + tl, y, tl)
    ctx.closePath()
}

/**
 * Draws background with optional gradient or image
 */
function drawBackground(ctx: CanvasRenderingContext2D, css: CSSProperties, box: ParsedBox): void {
    const bg = css.backgroundColor || css['background-color'] || css.background

    if (!bg) return

    ctx.fillStyle = bg
    const radii = parseBorderRadius(css)

    ctx.save()
    roundedRect(ctx, box.x, box.y, box.width, box.height, radii)
    ctx.fill()
    ctx.restore()
}

/**
 * Draws border
 */
function drawBorder(ctx: CanvasRenderingContext2D, css: CSSProperties, box: ParsedBox): void {
    const borderWidth = parseUnit(css.borderWidth || css['border-width'] || css.border || 0)
    const borderColor = css.borderColor || css['border-color'] || css.color || '#000'
    const borderStyle = css.borderStyle || css['border-style'] || 'solid'

    if (borderWidth <= 0) return

    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth

    if (borderStyle === 'dashed') {
        ctx.setLineDash([5, 5])
    } else if (borderStyle === 'dotted') {
        ctx.setLineDash([2, 2])
    }

    const radii = parseBorderRadius(css)

    ctx.save()
    roundedRect(
        ctx,
        box.x + borderWidth / 2,
        box.y + borderWidth / 2,
        box.width - borderWidth,
        box.height - borderWidth,
        radii
    )
    ctx.stroke()
    ctx.restore()

    ctx.setLineDash([])
}

/**
 * Draws box shadow
 */
function drawBoxShadow(ctx: CanvasRenderingContext2D, css: CSSProperties, box: ParsedBox): void {
    const boxShadow = css.boxShadow || css['box-shadow']
    if (!boxShadow) return

    const shadow = parseBoxShadow(boxShadow)
    if (!shadow) return

    const radii = parseBorderRadius(css)

    ctx.save()
    ctx.shadowOffsetX = shadow.offsetX
    ctx.shadowOffsetY = shadow.offsetY
    ctx.shadowBlur = shadow.blur
    ctx.shadowColor = shadow.color

    roundedRect(ctx, box.x, box.y, box.width, box.height, radii)
    ctx.fill()
    ctx.restore()
}

/**
 * Calculate positions for flex layout
 */
function calculateFlexLayout(
    css: CSSProperties,
    box: ParsedBox,
    children: ChildElement[]
): Array<{ x: number; y: number; width: number; height: number }> {
    const flexDirection = css.flexDirection || css['flex-direction'] || 'row'
    const justifyContent = css.justifyContent || css['justify-content'] || 'flex-start'
    const alignItems = css.alignItems || css['align-items'] || 'stretch'
    const gap = parseUnit(css.gap || 0)

    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse'
    const positions: Array<{ x: number; y: number; width: number; height: number }> = []

    // Calculate total size of children
    let totalSize = 0
    const childSizes: number[] = []

    for (const child of children) {
        const childWidth = parseUnit(child.css.width || 100)
        const childHeight = parseUnit(child.css.height || 100)
        const size = isRow ? childWidth : childHeight
        childSizes.push(size)
        totalSize += size
    }

    // Add gaps
    totalSize += gap * (children.length - 1)

    // Calculate start position based on justifyContent
    const containerSize = isRow ? box.width : box.height
    let currentPos = 0

    if (justifyContent === 'center') {
        currentPos = (containerSize - totalSize) / 2
    } else if (justifyContent === 'flex-end') {
        currentPos = containerSize - totalSize
    } else if (justifyContent === 'space-between') {
        currentPos = 0
    } else if (justifyContent === 'space-around') {
        const spacing = (containerSize - totalSize) / children.length
        currentPos = spacing / 2
    } else if (justifyContent === 'space-evenly') {
        const spacing = (containerSize - totalSize) / (children.length + 1)
        currentPos = spacing
    }

    // Position children
    for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const childWidth = parseUnit(child.css.width || 100)
        const childHeight = parseUnit(child.css.height || 100)

        let x = box.x + box.padding.left
        let y = box.y + box.padding.top

        if (isRow) {
            x += currentPos

            // Align items vertically
            if (alignItems === 'center') {
                y += (box.height - childHeight) / 2
            } else if (alignItems === 'flex-end') {
                y += box.height - childHeight
            }
        } else {
            y += currentPos

            // Align items horizontally
            if (alignItems === 'center') {
                x += (box.width - childWidth) / 2
            } else if (alignItems === 'flex-end') {
                x += box.width - childWidth
            }
        }

        positions.push({ x, y, width: childWidth, height: childHeight })

        // Update position for next child
        if (justifyContent === 'space-between') {
            const spacing = (containerSize - totalSize) / (children.length - 1)
            currentPos += childSizes[i] + spacing + gap
        } else if (justifyContent === 'space-around') {
            const spacing = (containerSize - totalSize) / children.length
            currentPos += childSizes[i] + spacing + gap
        } else if (justifyContent === 'space-evenly') {
            const spacing = (containerSize - totalSize) / (children.length + 1)
            currentPos += childSizes[i] + spacing + gap
        } else {
            currentPos += childSizes[i] + gap
        }
    }

    return positions
}

/**
 * Calculate positions for grid layout
 */
function calculateGridLayout(
    css: CSSProperties,
    box: ParsedBox,
    children: ChildElement[]
): Array<{ x: number; y: number; width: number; height: number }> {
    const gridTemplateColumns = css.gridTemplateColumns || css['grid-template-columns'] || 'auto'
    const gridTemplateRows = css.gridTemplateRows || css['grid-template-rows'] || 'auto'
    const gap = parseUnit(css.gap || css.gridGap || css['grid-gap'] || 0)

    // Parse column and row templates (simplified - supports 'repeat', 'fr', 'px', 'auto')
    const parseTemplate = (template: string): number[] => {
        if (template === 'auto') return []

        const parts = template.split(/\s+/)
        return parts.map(part => {
            if (part.endsWith('fr')) return parseFloat(part)
            if (part.endsWith('px')) return parseFloat(part)
            return 100 // Default size
        })
    }

    const columns = parseTemplate(gridTemplateColumns)
    const rows = parseTemplate(gridTemplateRows)

    const columnCount = columns.length || Math.ceil(Math.sqrt(children.length))
    const rowCount = rows.length || Math.ceil(children.length / columnCount)

    // Calculate column widths
    const availableWidth = box.width - gap * (columnCount - 1)
    const columnWidths = columns.map(col =>
        col <= 10 ? (availableWidth * col) / columnCount : col
    )

    // Calculate row heights
    const availableHeight = box.height - gap * (rowCount - 1)
    const rowHeights = rows.map(row => (row <= 10 ? (availableHeight * row) / rowCount : row))

    const positions: Array<{ x: number; y: number; width: number; height: number }> = []

    // Position children in grid
    for (let i = 0; i < children.length; i++) {
        const col = i % columnCount
        const row = Math.floor(i / columnCount)

        let x = box.x + box.padding.left
        let y = box.y + box.padding.top

        // Add up widths of previous columns
        for (let c = 0; c < col; c++) {
            x += columnWidths[c] + gap
        }

        // Add up heights of previous rows
        for (let r = 0; r < row; r++) {
            y += rowHeights[r] + gap
        }

        positions.push({
            x,
            y,
            width: columnWidths[col] || availableWidth / columnCount,
            height: rowHeights[row] || availableHeight / rowCount,
        })
    }

    return positions
}

/**
 * Renders CSS properties to Canvas
 */
export function renderCSSToCanvas(
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

    // Render text if provided
    if (text) {
        applyTextStyles(ctx, normalized)

        const textX = x + padding.left
        const textY = y + padding.top

        if (fill) {
            ctx.fillText(text, textX, textY)
        }

        if (stroke) {
            ctx.strokeText(text, textX, textY)
        }
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

    // Reset global alpha
    ctx.globalAlpha = 1
}

export default renderCSSToCanvas
