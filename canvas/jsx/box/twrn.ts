/**
 * Tailwind Merge (twrnc) for Canvas
 * Uses twrnc library to convert Tailwind classes to styles
 */

import tw from 'twrnc'

import { getColor } from './tokens'

import type { CSSProperties } from '../../rendering/renderCSSToCanvas'

/**
 * Merges Tailwind classes using twrnc
 * Last class wins for conflicting properties
 */
export function mergeTailwindClasses(classNames: string | string[]): string {
    const classes = Array.isArray(classNames) ? classNames.join(' ') : classNames

    // twrnc automatically handles class merging
    return classes
}

/**
 * Converts Tailwind utility classes to CSS properties using twrnc
 */
export function tailwindClassesToCSS(className: string): CSSProperties {
    // Use twrnc to get React Native styles
    const rnStyles = tw.style(className)

    // Convert React Native styles to CSS properties
    let css = convertRNStylesToCSS(rnStyles)

    // Post-process to add semantic color support
    css = addSemanticColorSupport(css, className)

    return css
}

/**
 * Converts React Native styles (from twrnc) to CSS properties for Canvas
 */
function convertRNStylesToCSS(rnStyles: Record<string, unknown>): CSSProperties {
    const css: CSSProperties = {}

    for (const [key, value] of Object.entries(rnStyles)) {
        // Convert camelCase to kebab-case if needed
        const cssKey = key as keyof CSSProperties

        // Handle specific conversions
        if (typeof value === 'number') {
            // React Native uses unitless numbers, convert to px
            css[cssKey] = `${value}px` as never
        } else if (typeof value === 'string') {
            css[cssKey] = value as never
        } else if (value !== null && value !== undefined) {
            // Handle other types (objects, arrays, etc.)
            css[cssKey] = String(value) as never
        }
    }

    return css
}

/**
 * Extract color value from Tailwind class
 */
function extractTailwindColorValue(className: string, prefix: string): string | null {
    const value = className.replace(prefix, '')

    // Arbitrary value [#abc123]
    if (value.startsWith('[') && value.endsWith(']')) {
        return value.slice(1, -1)
    }

    // Try to get color from design tokens
    const tokenColor = getColor(value)
    if (tokenColor) return tokenColor

    // Basic colors fallback
    const colorMap: Record<string, string> = {
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
        // Semantic colors fallback
        primary: '#171717',
        secondary: '#525252',
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6',
    }

    return colorMap[value] || null
}

/**
 * Add semantic color support to CSS
 */
function addSemanticColorSupport(css: CSSProperties, className: string): CSSProperties {
    const classes = className.split(/\s+/)
    const enhanced = { ...css }

    for (const cls of classes) {
        // Background colors
        if (cls.startsWith('bg-')) {
            const color = extractTailwindColorValue(cls, 'bg-')
            if (color) enhanced.backgroundColor = color
        }

        // Text colors
        if (cls.startsWith('text-')) {
            const color = extractTailwindColorValue(cls, 'text-')
            if (color) enhanced.color = color
        }

        // Border colors
        if (cls.startsWith('border-') && !cls.match(/^border-[0-9]/)) {
            const color = extractTailwindColorValue(cls, 'border-')
            if (color) enhanced.borderColor = color
        }
    }

    return enhanced
}
