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
    // Flex item properties
    flexGrow?: number
    flexShrink?: number
    flexBasis?: string | number
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
    padding: number,
    parentSize?: number
): number {
    if (typeof value === 'number') return value

    if (typeof value === 'string') {
        if (value === 'auto') {
            // Use parent size if available (like CSS block elements)
            return parentSize !== undefined ? parentSize : contentSize || childrenSize + padding || 100
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

    // Default: use parent size if available (like CSS block elements), otherwise use content size
    return parentSize !== undefined ? parentSize : contentSize || childrenSize + padding || 100
}

/**
 * Compute block layout (vertical stacking)
 */
function computeBlockLayout(
    children: LayoutBox[],
    padding: { top: number; right: number; bottom: number; left: number },
    parentWidth?: number
): { children: LayoutBox[]; totalWidth: number; totalHeight: number } {
    let currentY = padding.top
    let maxWidth = 0
    const layoutedChildren: LayoutBox[] = []

    for (const child of children) {
        const marginTop = getSpacingValue(child.styles, 'margin', 'top')
        const marginLeft = getSpacingValue(child.styles, 'margin', 'left')
        const marginRight = getSpacingValue(child.styles, 'margin', 'right')
        const marginBottom = getSpacingValue(child.styles, 'margin', 'bottom')

        // Child already has computed size from recursive computeLayout call
        const childWidth = (child.styles.width as number) || 100
        const childHeight = (child.styles.height as number) || 100

        const x = padding.left + marginLeft
        const y = currentY + marginTop

        layoutedChildren.push({
            ...child,
            position: [x, y] as [number, number],
            size: [childWidth, childHeight] as [number, number],
        })

        currentY = y + childHeight + marginBottom
        maxWidth = Math.max(maxWidth, x + childWidth + marginRight)
    }

    return {
        children: layoutedChildren,
        totalWidth: maxWidth + padding.right,
        totalHeight: currentY + padding.bottom,
    }
}

/**
 * Compute flex layout with flex-grow, flex-shrink, and flex-basis support
 */
function computeFlexLayout(
    children: LayoutBox[],
    flexDirection: string,
    justifyContent: string,
    gap: number,
    padding: { top: number; right: number; bottom: number; left: number },
    parentWidth?: number,
    parentHeight?: number,
    hasExplicitSize?: boolean
): { children: LayoutBox[]; totalWidth: number; totalHeight: number } {
    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse'
    const layoutedChildren: LayoutBox[] = []

    // Calculate flex basis for each child
    const flexItems = children.map(child => {
        const marginTop = getSpacingValue(child.styles, 'margin', 'top')
        const marginLeft = getSpacingValue(child.styles, 'margin', 'left')
        const marginRight = getSpacingValue(child.styles, 'margin', 'right')
        const marginBottom = getSpacingValue(child.styles, 'margin', 'bottom')

        const flexGrow = child.styles.flexGrow !== undefined ? child.styles.flexGrow : 0
        const flexShrink = child.styles.flexShrink !== undefined ? child.styles.flexShrink : 1
        const flexBasis = child.styles.flexBasis

        // Compute flex basis (initial main size)
        let basis: number
        if (flexBasis !== undefined) {
            basis = typeof flexBasis === 'number' ? flexBasis : parseUnit(flexBasis)
        } else if (isRow) {
            basis = (child.styles.width as number) || 100
        } else {
            basis = (child.styles.height as number) || 100
        }

        const childWidth = (child.styles.width as number) || 100
        const childHeight = (child.styles.height as number) || 100

        return {
            child,
            flexGrow,
            flexShrink,
            basis,
            marginTop,
            marginLeft,
            marginRight,
            marginBottom,
            childWidth,
            childHeight,
        }
    })

    // Calculate total gaps
    const totalGaps = gap * Math.max(0, children.length - 1)

    // Calculate total flex basis
    const totalBasis = flexItems.reduce((sum, item) => {
        const margins = isRow ? item.marginLeft + item.marginRight : item.marginTop + item.marginBottom
        return sum + item.basis + margins
    }, 0)

    // Calculate available space
    const availableSpace = isRow
        ? (parentWidth || 0) - padding.left - padding.right
        : (parentHeight || 0) - padding.top - padding.bottom

    const freeSpace = availableSpace - totalBasis - totalGaps

    // Distribute free space according to flex-grow or flex-shrink
    const totalFlexGrow = flexItems.reduce((sum, item) => sum + item.flexGrow, 0)
    const totalFlexShrink = flexItems.reduce((sum, item) => sum + item.flexShrink, 0)

    const finalSizes = flexItems.map(item => {
        let mainSize = item.basis

        // Apply flex-grow/flex-shrink when there is free space or overflow
        if (freeSpace > 0 && totalFlexGrow > 0) {
            // Distribute positive free space with flex-grow
            mainSize += (freeSpace * item.flexGrow) / totalFlexGrow
        } else if (freeSpace < 0 && totalFlexShrink > 0 && hasExplicitSize) {
            // Only shrink if parent has explicit size (prevents unwanted shrinking)
            mainSize += (freeSpace * item.flexShrink) / totalFlexShrink
        }

        return Math.max(0, mainSize) // Size cannot be negative
    })

    // Calculate total used space
    const totalUsedSpace = flexItems.reduce((sum, item, i) => {
        const margins = isRow ? item.marginLeft + item.marginRight : item.marginTop + item.marginBottom
        return sum + finalSizes[i] + margins + (i < flexItems.length - 1 ? gap : 0)
    }, 0)

    const remainingSpace = availableSpace - totalUsedSpace

    // Calculate justify-content offsets
    let startOffset = 0
    let spaceBetween = 0

    if (justifyContent === 'flex-end') {
        startOffset = remainingSpace
    } else if (justifyContent === 'center') {
        startOffset = remainingSpace / 2
    } else if (justifyContent === 'space-between' && flexItems.length > 1) {
        spaceBetween = remainingSpace / (flexItems.length - 1)
    } else if (justifyContent === 'space-around') {
        spaceBetween = remainingSpace / flexItems.length
        startOffset = spaceBetween / 2
    } else if (justifyContent === 'space-evenly') {
        spaceBetween = remainingSpace / (flexItems.length + 1)
        startOffset = spaceBetween
    }

    // Position children
    let currentX = padding.left + (isRow ? startOffset : 0)
    let currentY = padding.top + (isRow ? 0 : startOffset)
    let maxWidth = 0
    let maxHeight = 0

    for (let i = 0; i < flexItems.length; i++) {
        const item = flexItems[i]
        const mainSize = finalSizes[i]

        const x = currentX + item.marginLeft
        const y = currentY + item.marginTop

        const width = isRow ? mainSize : item.childWidth
        const height = isRow ? item.childHeight : mainSize

        layoutedChildren.push({
            ...item.child,
            position: [x, y] as [number, number],
            size: [width, height] as [number, number],
        })

        if (isRow) {
            currentX =
                x + width + item.marginRight + (i < flexItems.length - 1 ? gap : 0) + spaceBetween
            maxHeight = Math.max(maxHeight, y + height + item.marginBottom)
        } else {
            currentY =
                y + height + item.marginBottom + (i < flexItems.length - 1 ? gap : 0) + spaceBetween
            maxWidth = Math.max(maxWidth, x + width + item.marginRight)
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
export function computeLayout(
    parent: LayoutBox,
    parentSize?: { width?: number; height?: number }
): LayoutBox {
    const { styles, children = [] } = parent

    // Get padding
    const padding = {
        top: getSpacingValue(styles, 'padding', 'top'),
        right: getSpacingValue(styles, 'padding', 'right'),
        bottom: getSpacingValue(styles, 'padding', 'bottom'),
        left: getSpacingValue(styles, 'padding', 'left'),
    }

    // Compute parent size first (so we can pass it to children)
    const paddingTotal = padding.left + padding.right
    const paddingVertical = padding.top + padding.bottom

    // Calculate this box's width (to pass to children)
    const parentWidth = computeContentSize(
        styles.width,
        styles._contentWidth,
        0, // Will be updated after children layout
        paddingTotal,
        parentSize?.width
    )

    const parentHeight = computeContentSize(
        styles.height,
        styles._contentHeight,
        0, // Will be updated after children layout
        paddingVertical,
        parentSize?.height
    )

    // Calculate available space for children (minus padding)
    const availableWidth = parentWidth - paddingTotal
    const availableHeight = parentHeight - paddingVertical

    // Get display mode to determine layout behavior
    const display = styles.display || 'block'
    const flexDirection = styles.flexDirection || 'column'
    const isFlexRow = display === 'flex' && (flexDirection === 'row' || flexDirection === 'row-reverse')

    // Recursively compute layout for children, passing available size (not parent size!)
    const childrenWithLayout = children.map(child => {
        // Calculate child margins
        const childMarginLeft = getSpacingValue(child.styles, 'margin', 'left')
        const childMarginRight = getSpacingValue(child.styles, 'margin', 'right')
        const childMarginTop = getSpacingValue(child.styles, 'margin', 'top')
        const childMarginBottom = getSpacingValue(child.styles, 'margin', 'bottom')

        // For flex containers, children size themselves based on flex properties
        // For block layout, children fill parent width but size themselves for height
        const isFlexColumn = display === 'flex' && (flexDirection === 'column' || flexDirection === 'column-reverse')

        const childAvailableWidth = isFlexRow
            ? undefined // Flex row children size themselves
            : availableWidth - childMarginLeft - childMarginRight

        const childAvailableHeight = isFlexColumn
            ? undefined // Flex column children size themselves
            : availableHeight - childMarginTop - childMarginBottom

        return computeLayout(child, {
            width: childAvailableWidth,
            height: childAvailableHeight,
        })
    })

    const gap = parseUnit(styles.gap || styles.rowGap || styles.columnGap || 0)
    const justifyContent = styles.justifyContent || 'flex-start'

    // Check if parent has explicit size (not auto or undefined)
    const hasExplicitWidth =
        styles.width !== undefined &&
        styles.width !== 'auto' &&
        styles.width !== 'min-content' &&
        styles.width !== 'max-content' &&
        styles.width !== 'fit-content'

    const hasExplicitHeight =
        styles.height !== undefined &&
        styles.height !== 'auto' &&
        styles.height !== 'min-content' &&
        styles.height !== 'max-content' &&
        styles.height !== 'fit-content'

    const hasExplicitSize = isFlexRow ? hasExplicitWidth : hasExplicitHeight

    // Compute child positions
    let result: { children: LayoutBox[]; totalWidth: number; totalHeight: number }

    if (display === 'flex') {
        result = computeFlexLayout(
            childrenWithLayout,
            flexDirection,
            justifyContent,
            gap,
            padding,
            parentWidth,
            parentHeight,
            hasExplicitSize
        )
    } else if (display === 'block') {
        result = computeBlockLayout(childrenWithLayout, padding, parentWidth)
    } else {
        // For other display modes, just stack vertically
        result = computeBlockLayout(childrenWithLayout, padding, parentWidth)
    }

    // Recompute parent size based on actual content if needed
    const finalWidth = computeContentSize(
        styles.width,
        styles._contentWidth,
        result.totalWidth - paddingTotal,
        paddingTotal,
        parentSize?.width
    )

    const finalHeight = computeContentSize(
        styles.height,
        styles._contentHeight,
        result.totalHeight - paddingVertical,
        paddingVertical,
        parentSize?.height
    )

    return {
        ...parent,
        styles: {
            ...styles,
            width: finalWidth,
            height: finalHeight,
            _contentWidth: result.totalWidth,
            _contentHeight: result.totalHeight,
        },
        children: result.children,
    }
}
