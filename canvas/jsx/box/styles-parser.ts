/**
 * CSS Style Props Parser for Canvas Box Component
 * Converts CSS properties and className (twrn) to canvas-renderable styles
 */

import { getTokens } from './tokens'

import type { CSSProperties } from '../../rendering/renderCSSToCanvas'

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

/**
 * Resolve token value from design tokens
 */
function resolveTokenValue(value: string | number, tokenType: 'spacing' | 'sizing' | 'radius' = 'spacing'): string | number {
    if (typeof value === 'number') return value

    const tokens = getTokens()
    if (!tokens) return value

    // Try specified token type first
    if (tokenType === 'spacing' && tokens.spacing && tokens.spacing[value]) {
        return tokens.spacing[value]
    }
    if (tokenType === 'sizing' && tokens.sizing && tokens.sizing[value]) {
        return tokens.sizing[value]
    }
    if (tokenType === 'radius' && tokens.radius && tokens.radius[value]) {
        return tokens.radius[value]
    }

    // Fallback to any token type
    if (tokens.spacing && tokens.spacing[value]) return tokens.spacing[value]
    if (tokens.sizing && tokens.sizing[value]) return tokens.sizing[value]
    if (tokens.radius && tokens.radius[value]) return tokens.radius[value]

    return value
}

/**
 * Expand Panda CSS shorthand props to full CSS properties
 */
export function expandPandaCSSProps(props: Record<string, unknown>): CSSProperties {
    const expanded: CSSProperties = {}

    // Margin shorthands
    if ('m' in props) {
        const value = resolveTokenValue(props.m as string | number)
        expanded.margin = value
    }
    if ('mt' in props) {
        const value = resolveTokenValue(props.mt as string | number)
        expanded.marginTop = value
    }
    if ('mr' in props) {
        const value = resolveTokenValue(props.mr as string | number)
        expanded.marginRight = value
    }
    if ('mb' in props) {
        const value = resolveTokenValue(props.mb as string | number)
        expanded.marginBottom = value
    }
    if ('ml' in props) {
        const value = resolveTokenValue(props.ml as string | number)
        expanded.marginLeft = value
    }
    if ('mx' in props) {
        const value = resolveTokenValue(props.mx as string | number)
        expanded.marginLeft = value
        expanded.marginRight = value
    }
    if ('my' in props) {
        const value = resolveTokenValue(props.my as string | number)
        expanded.marginTop = value
        expanded.marginBottom = value
    }

    // Padding shorthands
    if ('p' in props) {
        const value = resolveTokenValue(props.p as string | number)
        expanded.padding = value
    }
    if ('pt' in props) {
        const value = resolveTokenValue(props.pt as string | number)
        expanded.paddingTop = value
    }
    if ('pr' in props) {
        const value = resolveTokenValue(props.pr as string | number)
        expanded.paddingRight = value
    }
    if ('pb' in props) {
        const value = resolveTokenValue(props.pb as string | number)
        expanded.paddingBottom = value
    }
    if ('pl' in props) {
        const value = resolveTokenValue(props.pl as string | number)
        expanded.paddingLeft = value
    }
    if ('px' in props) {
        const value = resolveTokenValue(props.px as string | number)
        expanded.paddingLeft = value
        expanded.paddingRight = value
    }
    if ('py' in props) {
        const value = resolveTokenValue(props.py as string | number)
        expanded.paddingTop = value
        expanded.paddingBottom = value
    }

    // Size shorthands
    if ('w' in props) {
        const value = resolveTokenValue(props.w as string | number, 'sizing')
        expanded.width = value
    }
    if ('h' in props) {
        const value = resolveTokenValue(props.h as string | number, 'sizing')
        expanded.height = value
    }

    // Background shorthand
    if ('bg' in props) {
        expanded.backgroundColor = props.bg as string
    }

    // Border radius shorthand
    if ('rounded' in props) {
        const value = resolveTokenValue(props.rounded as string | number, 'radius')
        expanded.borderRadius = value
    }

    return expanded
}
