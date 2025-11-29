/**
 * Text rendering utilities for Canvas
 */

import type { CSSProperties } from '../renderCSSToCanvas'
import { parseUnit } from './parsing'
import { wrapText } from '../wrapText'

export interface ParsedShadow {
    offsetX: number
    offsetY: number
    blur: number
    color: string
}

/**
 * Parses text shadow string
 */
export function parseTextShadow(shadow: string): ParsedShadow | null {
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
 * Applies text styles to canvas context
 */
export function applyTextStyles(
    ctx: CanvasRenderingContext2D,
    css: CSSProperties,
    pixelRatio: number = 1
): void {
    const fontSizeValue = css.fontSize || css['font-size'] || '16px'
    let fontSizeNum = typeof fontSizeValue === 'string' ? parseUnit(fontSizeValue) : fontSizeValue

    // Apply pixelRatio to fontSize for high-DPI displays
    fontSizeNum = fontSizeNum * pixelRatio
    const fontSize = `${fontSizeNum}px`

    const fontFamily = css.fontFamily || css['font-family'] || 'sans-serif'
    const fontWeight = css.fontWeight || css['font-weight'] || 'normal'
    const fontStyle = css.fontStyle || css['font-style'] || 'normal'

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`

    // Set text color (default to black if not specified)
    const textColor = css.color || '#000000'
    ctx.fillStyle = textColor
    ctx.strokeStyle = textColor

    if (css.textAlign || css['text-align']) {
        ctx.textAlign = (css.textAlign || css['text-align'])!
    }

    if (css.textBaseline || css['text-baseline']) {
        ctx.textBaseline = (css.textBaseline || css['text-baseline'])!
    } else {
        // Default to 'top' so Y coordinate points to top of text, not baseline
        ctx.textBaseline = 'top'
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

export interface RenderTextOptions {
    text: string
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    maxWidth: number
    lineHeight: number
    fill: boolean
    stroke: boolean
    pixelRatio: number
}

/**
 * Renders text with wrapping support
 */
export function renderText(options: RenderTextOptions): void {
    const { text, ctx, x, y, maxWidth, lineHeight, fill, stroke, pixelRatio } = options

    // Wrap text if we have enough space
    if (maxWidth > 0) {
        const lines = wrapText({
            text,
            maxWidth: maxWidth * pixelRatio,
            ctx,
            wordWrap: 'normal',
        })

        // Render each line
        lines.forEach((line, index) => {
            const lineY = y + index * lineHeight * pixelRatio

            if (fill) {
                ctx.fillText(line, x, lineY)
            }

            if (stroke) {
                ctx.strokeText(line, x, lineY)
            }
        })
    } else {
        // Fallback: render as single line if no width constraint
        if (fill) {
            ctx.fillText(text, x, y)
        }

        if (stroke) {
            ctx.strokeText(text, x, y)
        }
    }
}
