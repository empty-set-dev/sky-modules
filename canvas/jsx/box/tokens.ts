/**
 * Design tokens loader for Canvas CSS
 * Provides semantic colors from brand.tokens.js
 */

// Tokens storage
let tokens: any = null

/**
 * Set design tokens manually (called by consuming app)
 */
export function setTokens(brandTokens: any) {
    tokens = brandTokens
}

/**
 * Get current tokens
 */
export function getTokens() {
    return tokens
}

/**
 * Get semantic color value by name
 */
export function getSemanticColor(colorName: string): string | null {
    if (!tokens?.semantic?.colors) return null

    // Try direct lookup in all semantic color categories
    const categories = ['background', 'foreground', 'border', 'brand', 'status', 'surface']

    for (const category of categories) {
        const colors = tokens.semantic.colors[category]
        if (!colors) continue

        // Try exact match
        if (colors[colorName]) return colors[colorName]

        // Try camelCase conversion (primary-hover -> primaryHover)
        const camelName = colorName.replace(/-([a-z])/g, (_: string, letter: string) =>
            letter.toUpperCase()
        )
        if (colors[camelName]) return colors[camelName]
    }

    return null
}

/**
 * Get foundation color value (neutral-500, brand-primary-500, etc.)
 */
export function getFoundationColor(colorName: string): string | null {
    if (!tokens?.colors) return null

    // Parse color path: neutral-500 -> colors.neutral[500]
    const parts = colorName.split('-')

    if (parts.length < 2) return null

    let current = tokens.colors

    for (const part of parts) {
        if (!current) return null
        current = current[part]
    }

    return typeof current === 'string' ? current : null
}

/**
 * Get any color value (semantic or foundation)
 */
export function getColor(colorName: string): string | null {
    // Try semantic first
    const semantic = getSemanticColor(colorName)
    if (semantic) return semantic

    // Try foundation
    const foundation = getFoundationColor(colorName)
    if (foundation) return foundation

    return null
}

/**
 * Export tokens for direct access
 */
export { tokens }
