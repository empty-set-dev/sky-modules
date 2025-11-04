/**
 * CSS Style Props Parser for Canvas Box Component
 * Converts CSS properties and className (twrn) to canvas-renderable styles
 */

import type { CSSProperties } from './renderCSSToCanvas'

export interface ParsedStyles extends CSSProperties {
    // Additional computed properties
    _computed?: {
        finalWidth?: number
        finalHeight?: number
        padding?: { top: number; right: number; bottom: number; left: number }
        margin?: { top: number; right: number; bottom: number; left: number }
    }
}

/**
 * Parses CSS unit value to pixels
 */
export function parseUnit(value: string | number, baseSize = 16): number {
    if (typeof value === 'number') return value
    if (typeof value !== 'string') return 0

    const num = parseFloat(value)
    if (isNaN(num)) return 0

    if (value.endsWith('px')) return num
    if (value.endsWith('em')) return num * baseSize
    if (value.endsWith('rem')) return num * baseSize
    if (value.endsWith('%')) return num // Will be calculated relative to parent
    return num
}

/**
 * Parses padding/margin shorthand
 */
export function parseSpacing(value: string | number): {
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
        return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] }
    }

    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] }
}

/**
 * Converts kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Normalizes CSS properties to camelCase
 */
export function normalizeProperties(css: Record<string, unknown>): CSSProperties {
    const normalized: CSSProperties = {}

    for (const [key, value] of Object.entries(css)) {
        if (value === undefined || value === null) continue

        const camelKey = key.includes('-') ? kebabToCamel(key) : key
        normalized[camelKey] = value
    }

    return normalized
}

/**
 * Merges multiple style objects with proper priority
 * Later objects override earlier ones
 */
export function mergeStyles(...styles: Array<CSSProperties | undefined>): CSSProperties {
    const merged: CSSProperties = {}

    for (const style of styles) {
        if (!style) continue

        for (const [key, value] of Object.entries(style)) {
            if (value !== undefined && value !== null) {
                merged[key] = value
            }
        }
    }

    return merged
}

/**
 * Extracts direct CSS props from component props
 * (width, height, backgroundColor, etc. as direct props, not in style object)
 */
export function extractDirectCSSProps(props: Record<string, unknown>): CSSProperties {
    const cssProps: CSSProperties = {}

    const cssPropNames = [
        'width',
        'height',
        'padding',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'margin',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'backgroundColor',
        'background',
        'backgroundImage',
        'backgroundSize',
        'backgroundPosition',
        'backgroundRepeat',
        'border',
        'borderWidth',
        'borderStyle',
        'borderColor',
        'borderRadius',
        'borderTopLeftRadius',
        'borderTopRightRadius',
        'borderBottomLeftRadius',
        'borderBottomRightRadius',
        'boxShadow',
        'textShadow',
        'color',
        'fontSize',
        'fontFamily',
        'fontWeight',
        'fontStyle',
        'textAlign',
        'lineHeight',
        'opacity',
        'transform',
        'display',
        'position',
        'top',
        'left',
        'right',
        'bottom',
        'flexDirection',
        'justifyContent',
        'alignItems',
        'alignContent',
        'flexWrap',
        'gap',
        'rowGap',
        'columnGap',
        'gridTemplateColumns',
        'gridTemplateRows',
        'gridGap',
        'gridRowGap',
        'gridColumnGap',
        'gridAutoFlow',
    ]

    for (const propName of cssPropNames) {
        if (propName in props && props[propName] !== undefined) {
            cssProps[propName] = props[propName] as never
        }
    }

    return cssProps
}
