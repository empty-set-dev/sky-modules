/**
 * Tailwind Merge (twrnc) for Canvas
 * Uses twrnc library to convert Tailwind classes to styles
 */

import tw from 'twrnc'

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
    return convertRNStylesToCSS(rnStyles)
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
