import type { Brand } from '../types/brand'

// Utility function
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// Shorten hex colors for Stylelint compliance
function shortenHexColor(value: string): string {
    // Match full hex colors like #ffffff, #000000, etc.
    const hexMatch = value.match(/^#([0-9a-fA-F]{6})$/)

    if (hexMatch) {
        const hex = hexMatch[1]

        // Check if it can be shortened (e.g., ffffff -> fff)
        if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
            return `#${hex[0]}${hex[2]}${hex[4]}`
        }
    }

    return value
}

// Modernize color functions for Stylelint compliance
function modernizeColorFunction(value: string): string {
    // First shorten hex colors
    let modernized = shortenHexColor(value)

    // Convert rgba(r, g, b, a) to rgb(r g b / a%) modern notation
    modernized = modernized.replace(
        /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g,
        (_, r, g, b, a) => {
            const alphaPercent = (parseFloat(a) * 100).toString() + '%'
            return `rgb(${r} ${g} ${b} / ${alphaPercent})`
        }
    )

    // Convert hsla(h, s%, l%, a) to hsl(h s% l% / a%) modern notation
    modernized = modernized.replace(
        /hsla\((\d+),\s*(\d+%),\s*(\d+%),\s*([\d.]+)\)/g,
        (_, h, s, l, a) => {
            const alphaPercent = (parseFloat(a) * 100).toString() + '%'
            return `hsl(${h} ${s} ${l} / ${alphaPercent})`
        }
    )

    // Convert decimal alpha to percentage in modern notation
    modernized = modernized.replace(
        /(rgb|hsl|oklch)\(([^)]+)\s\/\s([\d.]+)\)/g,
        (_, func, values, alpha) => {
            // If alpha is already a percentage, leave it
            if (alpha.includes('%')) return `${func}(${values} / ${alpha})`

            // Convert decimal to percentage
            const alphaPercent = (parseFloat(alpha) * 100).toString() + '%'
            return `${func}(${values} / ${alphaPercent})`
        }
    )

    return modernized
}

// Sanitize value for CSS output
function sanitizeValue(value: string): string {
    return modernizeColorFunction(value)
}

// Generate Tailwind CSS v4 plugin using JavaScript
export function generateTailwindConfig(brand: Brand): string {
    let jsCode = '// Auto-generated Tailwind plugin from brand config\n'
    jsCode += 'import plugin from "tailwindcss/plugin"\n\n'
    jsCode += 'export default plugin(({ matchUtilities, addUtilities }) => {\n'

    // Helper to format values object
    function formatValues(values: Record<string, string>): string {
        return JSON.stringify(values, null, 4).replace(/"([a-z][a-z0-9]*)":/gi, '$1:')
    }

    // Collect foundation colors
    const foundationColors: Record<string, string> = {}
    if (brand.foundation?.colors) {
        Object.entries(brand.foundation.colors).forEach(([colorName, colorScale]) => {
            if (typeof colorScale === 'object' && colorScale !== null) {
                Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                    if (typeof value === 'string') {
                        foundationColors[`${camelToKebab(colorName)}-${shade}`] = sanitizeValue(value)
                    }
                })
            }
        })
    }

    // Collect semantic colors
    const semanticBgColors: Record<string, string> = {}
    const semanticTextColors: Record<string, string> = {}
    const semanticBorderColors: Record<string, string> = {}

    if (brand.semantic?.colors?.background) {
        Object.entries(brand.semantic.colors.background).forEach(([colorName, value]) => {
            if (typeof value === 'string') {
                semanticBgColors[camelToKebab(colorName)] = sanitizeValue(value)
            }
        })
    }

    if (brand.semantic?.colors?.foreground) {
        Object.entries(brand.semantic.colors.foreground).forEach(([colorName, value]) => {
            if (typeof value === 'string') {
                semanticTextColors[camelToKebab(colorName)] = sanitizeValue(value)
            }
        })
    }

    if (brand.semantic?.colors?.border) {
        Object.entries(brand.semantic.colors.border).forEach(([colorName, value]) => {
            if (typeof value === 'string') {
                semanticBorderColors[camelToKebab(colorName)] = sanitizeValue(value)
            }
        })
    }

    // Collect semantic brand colors
    if (brand.semantic?.colors?.brand) {
        Object.entries(brand.semantic.colors.brand).forEach(([colorName, value]) => {
            if (typeof value === 'string') {
                const kebabName = `brand-${camelToKebab(colorName)}`
                semanticBgColors[kebabName] = sanitizeValue(value)
                semanticTextColors[kebabName] = sanitizeValue(value)
                semanticBorderColors[kebabName] = sanitizeValue(value)
            }
        })
    }

    // Collect semantic status colors
    if (brand.semantic?.colors?.status) {
        Object.entries(brand.semantic.colors.status).forEach(([colorName, value]) => {
            if (typeof value === 'string') {
                const kebabName = `status-${camelToKebab(colorName)}`
                semanticBgColors[kebabName] = sanitizeValue(value)
                semanticTextColors[kebabName] = sanitizeValue(value)
                semanticBorderColors[kebabName] = sanitizeValue(value)
            }
        })
    }

    // Collect semantic surface colors
    if (brand.semantic?.colors?.surface) {
        Object.entries(brand.semantic.colors.surface).forEach(([colorName, value]) => {
            if (typeof value === 'string') {
                const kebabName = `surface-${camelToKebab(colorName)}`
                semanticBgColors[kebabName] = sanitizeValue(value)
            }
        })
    }

    // Generate color utilities
    if (Object.keys(foundationColors).length > 0) {
        jsCode += '  // Foundation color utilities\n'
        const colorsStr = formatValues(foundationColors)
        jsCode += `  matchUtilities({ bg: (value) => ({ backgroundColor: value }) }, { values: ${colorsStr} })\n`
        jsCode += `  matchUtilities({ text: (value) => ({ color: value }) }, { values: ${colorsStr} })\n`
        jsCode += `  matchUtilities({ border: (value) => ({ borderColor: value }) }, { values: ${colorsStr} })\n\n`
    }

    // Generate semantic color utilities
    if (Object.keys(semanticBgColors).length > 0) {
        jsCode += '  // Semantic background colors\n'
        jsCode += `  matchUtilities({ bg: (value) => ({ backgroundColor: value }) }, { values: ${formatValues(semanticBgColors)} })\n\n`
    }

    if (Object.keys(semanticTextColors).length > 0) {
        jsCode += '  // Semantic text colors\n'
        jsCode += `  matchUtilities({ text: (value) => ({ color: value }) }, { values: ${formatValues(semanticTextColors)} })\n\n`
    }

    if (Object.keys(semanticBorderColors).length > 0) {
        jsCode += '  // Semantic border colors\n'
        jsCode += `  matchUtilities({ border: (value) => ({ borderColor: value }) }, { values: ${formatValues(semanticBorderColors)} })\n\n`
    }

    // Collect spacing values
    const spacingValues: Record<string, string> = {}
    if (brand.foundation?.spacing) {
        Object.entries(brand.foundation.spacing).forEach(([size, value]) => {
            spacingValues[size] = value
        })
    }

    // Generate matchUtilities for spacing
    if (Object.keys(spacingValues).length > 0) {
        const spacingValuesStr = formatValues(spacingValues)

        jsCode += '  // Padding utilities\n'
        jsCode += `  matchUtilities({ p: (value) => ({ padding: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ px: (value) => ({ paddingLeft: value, paddingRight: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ py: (value) => ({ paddingTop: value, paddingBottom: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ pt: (value) => ({ paddingTop: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ pr: (value) => ({ paddingRight: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ pb: (value) => ({ paddingBottom: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ pl: (value) => ({ paddingLeft: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ ps: (value) => ({ paddingInlineStart: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ pe: (value) => ({ paddingInlineEnd: value }) }, { values: ${spacingValuesStr} })\n`

        jsCode += '\n  // Margin utilities\n'
        jsCode += `  matchUtilities({ m: (value) => ({ margin: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ mx: (value) => ({ marginLeft: value, marginRight: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ my: (value) => ({ marginTop: value, marginBottom: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ mt: (value) => ({ marginTop: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ mr: (value) => ({ marginRight: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ mb: (value) => ({ marginBottom: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ ml: (value) => ({ marginLeft: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ ms: (value) => ({ marginInlineStart: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ me: (value) => ({ marginInlineEnd: value }) }, { values: ${spacingValuesStr} })\n`

        jsCode += '\n  // Gap utilities\n'
        jsCode += `  matchUtilities({ gap: (value) => ({ gap: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ 'gap-x': (value) => ({ columnGap: value }) }, { values: ${spacingValuesStr} })\n`
        jsCode += `  matchUtilities({ 'gap-y': (value) => ({ rowGap: value }) }, { values: ${spacingValuesStr} })\n`
    }

    // Collect foundation radius values
    const foundationRadiusValues: Record<string, string> = {}
    if (brand.foundation?.radius) {
        Object.entries(brand.foundation.radius).forEach(([size, value]) => {
            foundationRadiusValues[size] = value
        })
    }

    // Collect semantic radius values
    const semanticRadiusValues: Record<string, string> = {}
    if (brand.semantic?.radius) {
        Object.entries(brand.semantic.radius).forEach(([name, value]) => {
            if (typeof value === 'string') {
                semanticRadiusValues[camelToKebab(name)] = value
            }
        })
    }

    // Merge radius values
    const radiusValues = { ...foundationRadiusValues, ...semanticRadiusValues }

    // Generate matchUtilities for border radius
    if (Object.keys(radiusValues).length > 0) {
        const radiusValuesStr = formatValues(radiusValues)

        jsCode += '\n  // Border radius utilities\n'
        jsCode += `  matchUtilities({ rounded: (value) => ({ borderRadius: value }) }, { values: ${radiusValuesStr} })\n`
    }

    // Collect semantic duration values
    const durationValues: Record<string, string> = {}
    if (brand.semantic?.duration) {
        Object.entries(brand.semantic.duration).forEach(([name, value]) => {
            if (typeof value === 'string') {
                durationValues[camelToKebab(name)] = value
            }
        })
    }

    // Generate matchUtilities for duration
    if (Object.keys(durationValues).length > 0) {
        const durationValuesStr = formatValues(durationValues)

        jsCode += '\n  // Duration utilities\n'
        jsCode += `  matchUtilities({ duration: (value) => ({ transitionDuration: value }) }, { values: ${durationValuesStr} })\n`
    }

    // Collect semantic opacity values
    const opacityValues: Record<string, string> = {}
    if (brand.semantic?.opacity) {
        Object.entries(brand.semantic.opacity).forEach(([name, value]) => {
            if (typeof value === 'string') {
                opacityValues[camelToKebab(name)] = value
            }
        })
    }

    // Generate matchUtilities for opacity
    if (Object.keys(opacityValues).length > 0) {
        const opacityValuesStr = formatValues(opacityValues)

        jsCode += '\n  // Opacity utilities\n'
        jsCode += `  matchUtilities({ opacity: (value) => ({ opacity: value }) }, { values: ${opacityValuesStr} })\n`
    }

    // Collect foundation font size values
    const fontSizeValues: Record<string, string> = {}
    if (brand.foundation?.typography?.fontSize) {
        Object.entries(brand.foundation.typography.fontSize).forEach(([size, value]) => {
            // Handle both string and tuple formats
            if (typeof value === 'string') {
                fontSizeValues[size] = value
            } else if (Array.isArray(value) && value.length >= 1) {
                fontSizeValues[size] = value[0]
            }
        })
    }

    // Generate matchUtilities for font size
    if (Object.keys(fontSizeValues).length > 0) {
        const fontSizeValuesStr = formatValues(fontSizeValues)

        jsCode += '\n  // Font size utilities\n'
        jsCode += `  matchUtilities({ text: (value) => ({ fontSize: value }) }, { values: ${fontSizeValuesStr} })\n`
    }

    // Collect semantic typography utilities (display, headline, title, label, body)
    const semanticTypographyClasses: Record<string, string> = {}
    if (brand.semantic?.typography) {
        const typography = brand.semantic.typography
        // Process nested typography scales
        ;['display', 'headline', 'title', 'label', 'body'].forEach((category) => {
            const categoryData = typography[category]
            if (categoryData && typeof categoryData === 'object') {
                Object.entries(categoryData).forEach(([size, value]) => {
                    if (typeof value === 'string') {
                        const className = `${category}-${camelToKebab(size)}`
                        // Get the actual font size from foundation
                        const fontSize = fontSizeValues[value]
                        if (fontSize) {
                            semanticTypographyClasses[className] = fontSize
                        }
                    }
                })
            }
        })
    }

    // Generate addUtilities for semantic typography
    if (Object.keys(semanticTypographyClasses).length > 0) {
        jsCode += '\n  // Semantic typography utilities\n'
        Object.entries(semanticTypographyClasses).forEach(([className, fontSize]) => {
            jsCode += `  addUtilities({ '.${className}': { fontSize: '${fontSize}' } })\n`
        })
    }

    // Collect foundation sizing values
    const sizingValues: Record<string, string> = {}
    if (brand.foundation?.sizing) {
        Object.entries(brand.foundation.sizing).forEach(([size, value]) => {
            sizingValues[size] = value
        })
    }

    // Generate matchUtilities for width, height, min-height
    if (Object.keys(sizingValues).length > 0) {
        const sizingValuesStr = formatValues(sizingValues)

        jsCode += '\n  // Sizing utilities\n'
        jsCode += `  matchUtilities({ w: (value) => ({ width: value }) }, { values: ${sizingValuesStr} })\n`
        jsCode += `  matchUtilities({ h: (value) => ({ height: value }) }, { values: ${sizingValuesStr} })\n`
        jsCode += `  matchUtilities({ 'min-h': (value) => ({ minHeight: value }) }, { values: ${sizingValuesStr} })\n`
        jsCode += `  matchUtilities({ 'min-w': (value) => ({ minWidth: value }) }, { values: ${sizingValuesStr} })\n`
        jsCode += `  matchUtilities({ 'max-h': (value) => ({ maxHeight: value }) }, { values: ${sizingValuesStr} })\n`
        jsCode += `  matchUtilities({ 'max-w': (value) => ({ maxWidth: value }) }, { values: ${sizingValuesStr} })\n`
    }

    jsCode += '})\n'
    return jsCode
}
