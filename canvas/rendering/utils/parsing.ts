/**
 * Parsing utilities for CSS values
 */

import type { CSSProperties } from '../renderCSSToCanvas'

export interface ParsedShadow {
    offsetX: number
    offsetY: number
    blur: number
    color: string
}

export interface ParsedSpacing {
    top: number
    right: number
    bottom: number
    left: number
}

/**
 * Converts kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Normalizes CSS properties object to camelCase
 */
export function normalizeProperties(css: CSSProperties): CSSProperties {
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
export function parseUnit(value: string | number, baseSize = 16): number {
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
export function parsePadding(value: string | number): ParsedSpacing {
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
 * Parses text shadow string
 */
export function parseTextShadow(shadow: string): ParsedShadow | null {
    return parseBoxShadow(shadow)
}

/**
 * Parses border radius values
 */
export function parseBorderRadius(css: CSSProperties): number[] {
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
