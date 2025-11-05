/**
 * Universal Layout Engine
 * Platform-agnostic layout computation for Canvas, Three.js, and other renderers
 */

export interface LayoutStyles {
    display?: 'block' | 'flex' | 'inline' | 'inline-block' | 'grid' | 'none'
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
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    justifyContent?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    gap?: string | number
    rowGap?: string | number
    columnGap?: string | number
    // Internal computed properties
    _contentWidth?: number
    _contentHeight?: number
}

export interface LayoutBox {
    id?: string
    styles: LayoutStyles
    children?: LayoutBox[]
    position?: [number, number]
    size?: [number, number]
}

/**
 * Parse CSS unit value to pixels
 */
function parseUnit(value: string | number, baseSize = 16): number {
    if (typeof value === 'number') return value
    if (typeof value !== 'string') return 0

    const num = parseFloat(value)
    if (isNaN(num)) return 0

    if (value.endsWith('px')) return num
    if (value.endsWith('em')) return num * baseSize
    if (value.endsWith('rem')) return num * baseSize
    if (value.endsWith('%')) return num
    return num
}

/**
 * Parse spacing value (padding/margin)
 */
function parseSpacing(
    value: string | number | undefined
): { top: number; right: number; bottom: number; left: number } {
    if (value === undefined) return { top: 0, right: 0, bottom: 0, left: 0 }
    if (typeof value === 'number') return { top: value, right: value, bottom: value, left: value }

    const parts = String(value)
        .split(/\s+/)
        .map(p => parseUnit(p))

    if (parts.length === 1) {
        return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] }
    }
    if (parts.length === 2) {
        return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] }
    }
    if (parts.length === 3) {
        return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] }
    }
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] }
}

/**
 * Get individual spacing value (margin/padding)
 */
function getSpacingValue(
    styles: LayoutStyles,
    property: 'margin' | 'padding',
    side: 'top' | 'right' | 'bottom' | 'left'
): number {
    // Check individual property first (marginTop, paddingLeft, etc.)
    const individualProp = `${property}${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof LayoutStyles
    if (styles[individualProp] !== undefined) {
        return parseUnit(styles[individualProp] as string | number)
    }

    // Fall back to shorthand property
    if (styles[property] !== undefined) {
        const parsed = parseSpacing(styles[property])
        return parsed[side]
    }

    return 0
}

/**
 * Compute content-based size
 */
function computeContentSize(
    value: string | number | undefined,
    contentSize: number | undefined,
    childrenSize: number,
    padding: number
): number {
    if (typeof value === 'number') return value

    if (typeof value === 'string') {
        if (value === 'auto') {
            return contentSize || childrenSize + padding || 100
        }
        if (value === 'min-content') {
            return contentSize || 0
        }
        if (value === 'max-content') {
            return contentSize || childrenSize + padding
        }
        if (value === 'fit-content') {
            return contentSize || childrenSize + padding
        }
        return parseUnit(value, 16)
    }

    // Default: use content size or fallback
    return contentSize || childrenSize + padding || 100
}

/**
 * Compute block layout (vertical stacking)
 */
function computeBlockLayout(
    children: LayoutBox[],
    padding: { top: number; right: number; bottom: number; left: number }
): { children: LayoutBox[]; totalWidth: number; totalHeight: number } {
    let currentY = padding.top
    let maxWidth = 0
    const layoutedChildren: LayoutBox[] = []

    for (const child of children) {
        const marginTop = getSpacingValue(child.styles, 'margin', 'top')
        const marginLeft = getSpacingValue(child.styles, 'margin', 'left')
        const marginBottom = getSpacingValue(child.styles, 'margin', 'bottom')

        const childWidth = child.size?.[0] || parseUnit(child.styles.width || 100)
        const childHeight = child.size?.[1] || parseUnit(child.styles.height || 100)

        const x = padding.left + marginLeft
        const y = currentY + marginTop

        layoutedChildren.push({
            ...child,
            position: [x, y] as [number, number],
            size: [childWidth, childHeight] as [number, number],
        })

        currentY = y + childHeight + marginBottom
        maxWidth = Math.max(maxWidth, x + childWidth)
    }

    return {
        children: layoutedChildren,
        totalWidth: maxWidth + padding.right,
        totalHeight: currentY + padding.bottom,
    }
}

/**
 * Compute flex layout
 */
function computeFlexLayout(
    children: LayoutBox[],
    flexDirection: string,
    gap: number,
    padding: { top: number; right: number; bottom: number; left: number }
): { children: LayoutBox[]; totalWidth: number; totalHeight: number } {
    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse'
    const layoutedChildren: LayoutBox[] = []

    let currentX = padding.left
    let currentY = padding.top
    let maxWidth = 0
    let maxHeight = 0

    for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const childWidth = child.size?.[0] || parseUnit(child.styles.width || 100)
        const childHeight = child.size?.[1] || parseUnit(child.styles.height || 100)

        const marginTop = getSpacingValue(child.styles, 'margin', 'top')
        const marginLeft = getSpacingValue(child.styles, 'margin', 'left')
        const marginRight = getSpacingValue(child.styles, 'margin', 'right')
        const marginBottom = getSpacingValue(child.styles, 'margin', 'bottom')

        let x = currentX + marginLeft
        let y = currentY + marginTop

        if (isRow) {
            layoutedChildren.push({
                ...child,
                position: [x, y] as [number, number],
                size: [childWidth, childHeight] as [number, number],
            })

            currentX = x + childWidth + marginRight + (i < children.length - 1 ? gap : 0)
            maxHeight = Math.max(maxHeight, y + childHeight + marginBottom)
        } else {
            // column
            layoutedChildren.push({
                ...child,
                position: [x, y] as [number, number],
                size: [childWidth, childHeight] as [number, number],
            })

            currentY = y + childHeight + marginBottom + (i < children.length - 1 ? gap : 0)
            maxWidth = Math.max(maxWidth, x + childWidth + marginRight)
        }
    }

    return {
        children: layoutedChildren,
        totalWidth: isRow ? currentX + padding.right : maxWidth + padding.right,
        totalHeight: isRow ? maxHeight + padding.bottom : currentY + padding.bottom,
    }
}

/**
 * Compute layout for a box and its children
 */
export function computeLayout(parent: LayoutBox): LayoutBox {
    const { styles, children = [] } = parent

    // Recursively compute layout for children first
    const childrenWithLayout = children.map(child => computeLayout(child))

    // Get padding
    const padding = {
        top: getSpacingValue(styles, 'padding', 'top'),
        right: getSpacingValue(styles, 'padding', 'right'),
        bottom: getSpacingValue(styles, 'padding', 'bottom'),
        left: getSpacingValue(styles, 'padding', 'left'),
    }

    // Get display mode
    const display = styles.display || 'block'
    const flexDirection = styles.flexDirection || 'column'
    const gap = parseUnit(styles.gap || styles.rowGap || styles.columnGap || 0)

    // Compute child positions
    let result: { children: LayoutBox[]; totalWidth: number; totalHeight: number }

    if (display === 'flex') {
        result = computeFlexLayout(childrenWithLayout, flexDirection, gap, padding)
    } else if (display === 'block') {
        result = computeBlockLayout(childrenWithLayout, padding)
    } else {
        // For other display modes, just stack vertically
        result = computeBlockLayout(childrenWithLayout, padding)
    }

    // Compute parent size based on content
    const paddingTotal = padding.left + padding.right
    const width = computeContentSize(
        styles.width,
        styles._contentWidth,
        result.totalWidth - paddingTotal,
        paddingTotal
    )

    const paddingVertical = padding.top + padding.bottom
    const height = computeContentSize(
        styles.height,
        styles._contentHeight,
        result.totalHeight - paddingVertical,
        paddingVertical
    )

    return {
        ...parent,
        styles: {
            ...styles,
            width,
            height,
            _contentWidth: result.totalWidth,
            _contentHeight: result.totalHeight,
        },
        children: result.children,
    }
}
