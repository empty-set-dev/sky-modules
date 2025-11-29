/**
 * Layout calculation utilities for Canvas
 */

import type { CSSProperties, ChildElement } from '../renderCSSToCanvas'
import { parseUnit } from './parsing'
import type { ParsedBox } from './drawing'

export interface LayoutPosition {
    x: number
    y: number
    width: number
    height: number
}

/**
 * Calculate positions for flex layout
 */
export function calculateFlexLayout(
    css: CSSProperties,
    box: ParsedBox,
    children: ChildElement[]
): LayoutPosition[] {
    const flexDirection = css.flexDirection || css['flex-direction'] || 'row'
    const justifyContent = css.justifyContent || css['justify-content'] || 'flex-start'
    const alignItems = css.alignItems || css['align-items'] || 'stretch'
    const gap = parseUnit(css.gap || 0)

    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse'
    const positions: LayoutPosition[] = []

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
export function calculateGridLayout(
    css: CSSProperties,
    box: ParsedBox,
    children: ChildElement[]
): LayoutPosition[] {
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

    const positions: LayoutPosition[] = []

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
