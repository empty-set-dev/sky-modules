import type { BrandCssGeneratorConfig, TokenObject, WrappedToken } from './types'

// Helper function to wrap primitive values in { value: ... } format for Panda CSS
export function wrapTokenValues<T extends TokenObject>(obj: T): unknown {
    if (obj === null || obj === undefined) {
        return obj
    }

    // If it's a primitive value, wrap it
    if (typeof obj !== 'object' || Array.isArray(obj)) {
        return { value: obj }
    }

    // If it's an object, recursively process it
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
        result[key] = wrapTokenValues(value as TokenObject)
    }
    return result
}

// Utility functions
export function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function sanitizeValue(value: unknown): string {
    if (typeof value === 'string') {
        // Shorten hex colors for Stylelint compliance
        const shortened = shortenHexColor(value)

        // Convert modern rgb/hsl with percentage alpha to decimal
        return modernizeColorFunction(shortened)
    }

    if (typeof value === 'number') return value.toString()

    if (Array.isArray(value)) return value.join(', ')

    return String(value)
}

export function shortenHexColor(value: string): string {
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

export function modernizeColorFunction(value: string): string {
    // Convert rgba(r, g, b, a) to rgb(r g b / a%) modern notation
    let modernized = value.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g, (_, r, g, b, a) => {
        const alphaPercent = (parseFloat(a) * 100).toString() + '%'
        return `rgb(${r} ${g} ${b} / ${alphaPercent})`
    })

    // Convert hsla(h, s%, l%, a) to hsl(h s% l% / a%) modern notation
    modernized = modernized.replace(
        /hsla\((\d+),\s*(\d+%),\s*(\d+%),\s*([\d.]+)\)/g,
        (_, h, s, l, a) => {
            const alphaPercent = (parseFloat(a) * 100).toString() + '%'
            return `hsl(${h} ${s} ${l} / ${alphaPercent})`
        }
    )

    // Convert decimal alpha to percentage in modern notation
    modernized = modernized.replace(/(rgb|hsl|oklch)\(([^)]+)\s\/\s([\d.]+)\)/g, (_, func, values, alpha) => {
        // If alpha is already a percentage, leave it
        if (alpha.includes('%')) return `${func}(${values} / ${alpha})`

        // Convert decimal to percentage
        const alphaPercent = (parseFloat(alpha) * 100).toString() + '%'
        return `${func}(${values} / ${alphaPercent})`
    })

    return modernized
}

export function formatComment(comment: string, minify: boolean, isFirst = false): string {
    return minify ? '' : `${isFirst ? '' : '\n'}    /* ${comment} */\n`
}
