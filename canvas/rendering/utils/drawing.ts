/**
 * Drawing utilities for Canvas
 */

import type { CSSProperties } from '../renderCSSToCanvas'
import { parseUnit, parseBorderRadius } from './parsing'

export interface ParsedBox {
    x: number
    y: number
    width: number
    height: number
    padding: { top: number; right: number; bottom: number; left: number }
}

export interface ParsedShadow {
    offsetX: number
    offsetY: number
    blur: number
    color: string
}

/**
 * Parses box shadow string
 */
export function parseBoxShadow(shadow: string): ParsedShadow | null {
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
 * Draws a rounded rectangle path
 */
export function roundedRect(
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
export function drawBackground(
    ctx: CanvasRenderingContext2D,
    css: CSSProperties,
    box: ParsedBox
): void {
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
export function drawBorder(ctx: CanvasRenderingContext2D, css: CSSProperties, box: ParsedBox): void {
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
export function drawBoxShadow(
    ctx: CanvasRenderingContext2D,
    css: CSSProperties,
    box: ParsedBox
): void {
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
