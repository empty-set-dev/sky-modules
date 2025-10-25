import type { BrandCssGeneratorConfig } from './types'

import { camelToKebab } from './helpers'

// Generate utility class for a CSS variable
export function generateUtilityClass(
    varName: string,
    value: string,
    cssProperty: string,
    config: Required<BrandCssGeneratorConfig>,
    customClassName?: string
): string {
    if (!config.generateUtilities) return ''

    const className = customClassName || varName.replace(config.prefix, config.utilityPrefix)
    // Use the actual value directly instead of CSS variable reference
    return `.${className} { ${cssProperty}: ${value}; }\n`
}

// Generate utility classes for color (text, bg, border)
export function generateColorUtilities(
    varName: string,
    value: string,
    className: string,
    config: Required<BrandCssGeneratorConfig>
): string {
    if (!config.generateUtilities) return ''

    const properties = [
        { prop: 'color', prefix: 'text' },
        { prop: 'background-color', prefix: 'bg' },
        { prop: 'border-color', prefix: 'border' },
    ]

    return properties
        .map(({ prop, prefix }) => generateUtilityClass(varName, value, prop, config, `${prefix}-${className}`))
        .join('')
}

// Generate semantic utility classes based on color purpose
export function generateSemanticUtilityClass(
    value: string,
    config: Required<BrandCssGeneratorConfig>,
    colorGroup: string,
    colorName: string
): string {
    if (!config.generateUtilities) return ''

    const className = `${camelToKebab(colorGroup)}-${camelToKebab(colorName)}`
    let utilities = ''

    // Generate utilities based on semantic meaning with proper grouping
    // Each utility uses the actual value directly instead of CSS variable
    if (colorGroup === 'background') {
        // Background colors: .bg-primary instead of .bg-background-primary
        utilities += `.bg-${camelToKebab(colorName)} { background-color: ${value}; }\n`
    } else if (colorGroup === 'surface') {
        // Surface colors: .surface-primary to avoid conflicts with background
        utilities += `.surface-${camelToKebab(colorName)} { background-color: ${value}; }\n`
    } else if (colorGroup === 'foreground') {
        // Foreground colors: .text-primary instead of .text-foreground-primary
        utilities += `.text-${camelToKebab(colorName)} { color: ${value}; }\n`
    } else if (colorGroup === 'border') {
        // Border colors: .border-primary instead of .border-border-primary
        utilities += `.border-${camelToKebab(colorName)} { border-color: ${value}; }\n`
    } else {
        // Other colors generate with semantic context
        utilities += `.text-${className} { color: ${value}; }\n`
        utilities += `.bg-${className} { background-color: ${value}; }\n`
        utilities += `.border-${className} { border-color: ${value}; }\n`
    }

    return utilities
}
