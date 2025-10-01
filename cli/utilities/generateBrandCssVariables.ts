// 🎨 Brand BrandCssVariables Generator - converts Brand objects to BrandCssVariables variables
import Brand, { BrandFoundation, BrandSemantic, BrandComponents } from '@sky-modules/design/Brand'

// Configuration interface for BrandCssVariables generation
export interface BrandCssVariablesGeneratorConfig {
    prefix?: string // CSS variable prefix (default: '--')
    selector?: string // CSS selector (default: ':root')
    includeComments?: boolean // Include comments in output
    brandName?: string // Brand name for data-brand scoping (e.g., 'sky', 'custom')
    minify?: boolean // Minify output
}

// BrandCssVariables generation result
export interface BrandCssVariablesGenerationResult {
    css: string
    variables: Record<string, string>
    stats: {
        variableCount: number
        bytes: number
    }
}

// Default configuration
const defaultConfig: Required<BrandCssVariablesGeneratorConfig> = {
    prefix: '--',
    selector: ':root',
    includeComments: true,
    brandName: '',
    minify: false,
}

// Utility functions
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function sanitizeValue(value: unknown): string {
    if (typeof value === 'string') return value

    if (typeof value === 'number') return value.toString()

    if (Array.isArray(value)) return value.join(', ')

    return String(value)
}

function formatComment(comment: string, minify: boolean, isFirst = false): string {
    return minify ? '' : `${isFirst ? '' : '\n'}    /* ${comment} */\n`
}

// Foundation BrandCssVariables generator
export function generateFoundationBrandCssVariables(
    foundation: BrandFoundation,
    config: Partial<BrandCssVariablesGeneratorConfig> = {}
): string {
    const cfg = { ...defaultConfig, ...config }
    let css = ''

    if (cfg.includeComments) {
        css += formatComment('🏗️ Foundation - Atomic Design Tokens', cfg.minify)
    }

    // Colors
    if (cfg.includeComments) {
        css += formatComment('Color Scales', cfg.minify)
    }

    Object.entries(foundation.colors).forEach(([colorName, colorScale]) => {
        Object.entries(colorScale).forEach(([shade, value]) => {
            const varName = `${cfg.prefix}${camelToKebab(colorName)}-${shade}`
            css += `    ${varName}: ${sanitizeValue(value)};\n`
        })
    })

    // Typography
    if (cfg.includeComments) {
        css += formatComment('Typography', cfg.minify)
    }

    // Font families
    Object.entries(foundation.typography.fontFamily).forEach(([name, fonts]) => {
        const varName = `${cfg.prefix}font-${camelToKebab(name)}`
        css += `    ${varName}: ${fonts.join(', ')};\n`
    })

    // Font sizes
    Object.entries(foundation.typography.fontSize).forEach(([size, [value, meta]]) => {
        const baseVar = `${cfg.prefix}text-${size}`
        css += `    ${baseVar}: ${value};\n`
        css += `    ${baseVar}-lh: ${meta.lineHeight};\n`

        if (meta.letterSpacing) {
            css += `    ${baseVar}-ls: ${meta.letterSpacing};\n`
        }
    })

    // Spacing
    if (cfg.includeComments) {
        css += formatComment('Spacing Scale', cfg.minify)
    }

    Object.entries(foundation.spacing).forEach(([size, value]) => {
        const varName = `${cfg.prefix}spacing-${size.replace('.', '-')}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Border radius
    if (cfg.includeComments) {
        css += formatComment('Border Radius', cfg.minify)
    }

    Object.entries(foundation.borderRadius).forEach(([size, value]) => {
        const varName = `${cfg.prefix}radius-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Shadows
    if (cfg.includeComments) {
        css += formatComment('Shadows', cfg.minify)
    }

    Object.entries(foundation.boxShadow).forEach(([size, value]) => {
        const varName = `${cfg.prefix}shadow-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Foundation glow
    if (cfg.includeComments) {
        css += formatComment('Foundation Glow', cfg.minify)
    }

    Object.entries(foundation.glow).forEach(([size, value]) => {
        const varName = `${cfg.prefix}glow-foundation-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Breakpoints
    if (cfg.includeComments) {
        css += formatComment('Breakpoints', cfg.minify)
    }

    Object.entries(foundation.screens).forEach(([screen, value]) => {
        const varName = `${cfg.prefix}screen-${screen}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    return css
}

// Semantic BrandCssVariables generator
export function generateSemanticBrandCssVariables(
    semantic: BrandSemantic,
    config: Partial<BrandCssVariablesGeneratorConfig> = {}
): string {
    const cfg = { ...defaultConfig, ...config }
    let css = ''

    if (cfg.includeComments) {
        css += formatComment('🎨 Semantic Tokens - Role-based Colors', cfg.minify)
    }

    // Generate semantic color variables
    function generateColorGroup(groupName: string, colors: Record<string, string>): void {
        if (cfg.includeComments) {
            css += formatComment(
                `${groupName.charAt(0).toUpperCase() + groupName.slice(1)} Colors`,
                cfg.minify
            )
        }

        Object.entries(colors).forEach(([colorName, value]) => {
            const varName = `${cfg.prefix}${camelToKebab(groupName)}-${camelToKebab(colorName)}`
            css += `    ${varName}: ${sanitizeValue(value)};\n`
        })
    }

    // Generate all semantic color groups
    Object.entries(semantic.colors).forEach(([groupName, colors]) => {
        generateColorGroup(groupName, colors as Record<string, string>)
    })

    // Semantic opacity
    if (cfg.includeComments) {
        css += formatComment('Semantic Opacity', cfg.minify)
    }

    Object.entries(semantic.opacity).forEach(([name, value]) => {
        const varName = `${cfg.prefix}opacity-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Semantic duration
    if (cfg.includeComments) {
        css += formatComment('Semantic Duration', cfg.minify)
    }

    Object.entries(semantic.duration).forEach(([name, value]) => {
        const varName = `${cfg.prefix}duration-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Semantic z-index
    if (cfg.includeComments) {
        css += formatComment('Semantic Z-Index', cfg.minify)
    }

    Object.entries(semantic.zIndex).forEach(([name, value]) => {
        const varName = `${cfg.prefix}z-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Semantic glow
    if (cfg.includeComments) {
        css += formatComment('Semantic Glow', cfg.minify)
    }

    Object.entries(semantic.glow).forEach(([name, value]) => {
        const varName = `${cfg.prefix}glow-${name}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Semantic animations
    if (cfg.includeComments) {
        css += formatComment('Semantic Animations', cfg.minify)
    }

    Object.entries(semantic.animations).forEach(([name, value]) => {
        const varName = `${cfg.prefix}animation-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    // Semantic typography
    if (cfg.includeComments) {
        css += formatComment('Semantic Typography', cfg.minify)
    }

    Object.entries(semantic.typography).forEach(([category, sizes]) => {
        Object.entries(sizes).forEach(([size, value]) => {
            const varName = `${cfg.prefix}${camelToKebab(category)}-${size}`
            css += `    ${varName}: ${sanitizeValue(value)};\n`
        })
    })

    return css
}

// Component BrandCssVariables generator
export function generateComponentBrandCssVariables(
    components: BrandComponents,
    config: Partial<BrandCssVariablesGeneratorConfig> = {}
): string {
    const cfg = { ...defaultConfig, ...config }
    let css = ''

    if (cfg.includeComments) {
        css += formatComment('🎭 Component Tokens', cfg.minify)
    }

    // Generate component variables recursively
    function generateComponentVars(componentName: string, obj: object, prefix = ''): void {
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                generateComponentVars(componentName, value, `${prefix}${camelToKebab(key)}-`)
            } else {
                const varName = `${cfg.prefix}${camelToKebab(componentName)}-${prefix}${camelToKebab(key)}`
                css += `    ${varName}: ${sanitizeValue(value)};\n`
            }
        })
    }

    // Generate all component variables
    Object.entries(components).forEach(([componentName, componentConfig]) => {
        if (cfg.includeComments) {
            css += formatComment(
                `${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Component`,
                cfg.minify
            )
        }

        generateComponentVars(componentName, componentConfig)
    })

    return css
}

// Main Brand BrandCssVariables generator
export default function generateBrandBrandCssVariables(
    brand: Brand,
    config: Partial<BrandCssVariablesGeneratorConfig> = {}
): BrandCssVariablesGenerationResult {
    const cfg = { ...defaultConfig, ...config }
    const variables: Record<string, string> = {}

    let css = ''

    // Add selector and opening brace
    const brandSelector = cfg.brandName ? `[data-brand="${cfg.brandName}"]` : cfg.selector
    css += `${brandSelector} {\n`

    if (cfg.includeComments) {
        css += formatComment(`Generated from Brand configuration`, cfg.minify, true)
    }

    // Generate foundation BrandCssVariables
    const foundationBrandCssVariables = generateFoundationBrandCssVariables(brand.foundation, {
        ...config,
        includeComments: cfg.includeComments,
    })
    css += foundationBrandCssVariables

    // Generate semantic BrandCssVariables
    const semanticBrandCssVariables = generateSemanticBrandCssVariables(brand.semantic, {
        ...config,
        includeComments: cfg.includeComments,
    })
    css += semanticBrandCssVariables

    // Generate component BrandCssVariables
    const componentBrandCssVariables = generateComponentBrandCssVariables(brand.components, {
        ...config,
        includeComments: cfg.includeComments,
    })
    css += componentBrandCssVariables

    // Close selector
    css += '}\n'

    // Count variables
    const variableCount = (css.match(/--[\w-]+:/g) || []).length

    // Minify if requested
    if (cfg.minify) {
        css = css
            .replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, '}') // Remove last semicolon before }
            .trim()
    }

    return {
        css,
        variables,
        stats: {
            variableCount,
            bytes: css.length,
        },
    }
}
