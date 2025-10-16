// 🎨 Brand CSS Variables & Utility Classes Generator - converts Brand objects to CSS variables and utility classes
import Brand from '@sky-modules/design/Brand'

// Configuration interface for CSS generation
export interface BrandCssGeneratorConfig {
    prefix?: string // CSS variable prefix (default: '--')
    selector?: string // CSS selector (default: ':root')
    includeComments?: boolean // Include comments in output
    brandName?: string // Brand name for data-brand scoping (e.g., 'sky', 'custom')
    minify?: boolean // Minify output
    generateUtilities?: boolean // Generate utility classes
    utilityPrefix?: string // Utility class prefix (default: 'brand-')
}

// CSS generation result
export interface BrandCssGenerationResult {
    css: string
    variables: Record<string, string>
    utilities: Record<string, string>
    stats: {
        variableCount: number
        utilityCount: number
        bytes: number
    }
}

// Default configuration
const defaultConfig: Required<BrandCssGeneratorConfig> = {
    prefix: '--',
    selector: ':root',
    includeComments: true,
    brandName: '',
    minify: false,
    generateUtilities: true,
    utilityPrefix: 'brand-',
}

// Utility functions
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function sanitizeValue(value: unknown): string {
    if (typeof value === 'string') {
        // Shorten hex colors for Stylelint compliance
        return shortenHexColor(value)
    }

    if (typeof value === 'number') return value.toString()

    if (Array.isArray(value)) return value.join(', ')

    return String(value)
}

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

function formatComment(comment: string, minify: boolean, isFirst = false): string {
    return minify ? '' : `${isFirst ? '' : '\n'}    /* ${comment} */\n`
}

// Generate utility class for a CSS variable
function generateUtilityClass(
    varName: string,
    cssProperty: string,
    config: Required<BrandCssGeneratorConfig>,
    customClassName?: string
): string {
    if (!config.generateUtilities) return ''

    const className = customClassName || varName.replace(config.prefix, config.utilityPrefix)
    return `.${className} { ${cssProperty}: var(${varName}); }\n`
}

// Foundation CSS generator
export function generateFoundationCss(
    foundation: Brand['foundation'],
    config: Partial<BrandCssGeneratorConfig> = {}
): { css: string; utilities: string } {
    const cfg = { ...defaultConfig, ...config }
    let css = ''
    let utilities = ''

    if (cfg.includeComments) {
        css += formatComment('🏗️ Foundation - Atomic Design Tokens', cfg.minify)
    }

    // Colors
    if (cfg.includeComments) {
        css += formatComment('Color Scales', cfg.minify)
    }

    Object.entries(foundation.colors).forEach(([colorName, colorScale]) => {
        if (typeof colorScale === 'object' && colorScale !== null) {
            Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                const varName = `${cfg.prefix}${camelToKebab(colorName)}-${shade}`
                css += `    ${varName}: ${sanitizeValue(value)};\n`

                // Generate utility classes for colors
                utilities += generateUtilityClass(
                    varName,
                    'color',
                    cfg,
                    `text-${camelToKebab(colorName)}-${shade}`
                )
                utilities += generateUtilityClass(
                    varName,
                    'background-color',
                    cfg,
                    `bg-${camelToKebab(colorName)}-${shade}`
                )
                utilities += generateUtilityClass(
                    varName,
                    'border-color',
                    cfg,
                    `border-${camelToKebab(colorName)}-${shade}`
                )
            })
        } else {
            // Handle simple color value
            const varName = `${cfg.prefix}${camelToKebab(colorName)}`
            css += `    ${varName}: ${sanitizeValue(colorScale)};\n`

            utilities += generateUtilityClass(varName, 'color', cfg, `text-${camelToKebab(colorName)}`)
            utilities += generateUtilityClass(varName, 'background-color', cfg, `bg-${camelToKebab(colorName)}`)
            utilities += generateUtilityClass(varName, 'border-color', cfg, `border-${camelToKebab(colorName)}`)
        }
    })

    // Typography
    if (cfg.includeComments) {
        css += formatComment('Typography', cfg.minify)
    }

    // Font families
    Object.entries(foundation.typography.fontFamily).forEach(([name, fonts]) => {
        const varName = `${cfg.prefix}font-${camelToKebab(name)}`
        const fontList = Array.isArray(fonts) ? fonts : [String(fonts)]
        css += `    ${varName}: ${fontList.join(', ')};\n`
        utilities += generateUtilityClass(varName, 'font-family', cfg, `font-${camelToKebab(name)}`)
    })

    // Font sizes
    Object.entries(foundation.typography.fontSize).forEach(([size, sizeConfig]) => {
        const [value, meta] = Array.isArray(sizeConfig)
            ? sizeConfig
            : [String(sizeConfig), { lineHeight: '1' }]
        const baseVar = `${cfg.prefix}text-${size}`
        css += `    ${baseVar}: ${value};\n`
        css += `    ${baseVar}-lh: ${meta.lineHeight};\n`
        utilities += generateUtilityClass(baseVar, 'font-size', cfg, `text-${size}`)

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
        utilities += generateUtilityClass(varName, 'padding', cfg, `p-${size}`)
        utilities += generateUtilityClass(varName, 'margin', cfg, `m-${size}`)
        utilities += generateUtilityClass(varName, 'gap', cfg, `gap-${size}`)
    })

    // Border radius
    if (cfg.includeComments) {
        css += formatComment('Border Radius', cfg.minify)
    }

    Object.entries(foundation.borderRadius).forEach(([size, value]) => {
        const varName = `${cfg.prefix}radius-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, 'border-radius', cfg, `rounded-${size}`)
    })

    // Shadows
    if (cfg.includeComments) {
        css += formatComment('Shadows', cfg.minify)
    }

    Object.entries(foundation.boxShadow).forEach(([size, value]) => {
        const varName = `${cfg.prefix}shadow-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, 'box-shadow', cfg, `shadow-${size}`)
    })

    // Foundation glow
    if (cfg.includeComments) {
        css += formatComment('Foundation Glow', cfg.minify)
    }

    Object.entries(foundation.glow).forEach(([size, value]) => {
        const varName = `${cfg.prefix}glow-foundation-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, 'filter', cfg, `glow-${size}`)
    })

    // Breakpoints
    if (cfg.includeComments) {
        css += formatComment('Breakpoints', cfg.minify)
    }

    Object.entries(foundation.screens).forEach(([screen, value]) => {
        const varName = `${cfg.prefix}screen-${screen}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    return { css, utilities }
}

// Semantic CSS generator
export function generateSemanticCss(
    semantic: Brand['semantic'],
    config: Partial<BrandCssGeneratorConfig> = {}
): { css: string; utilities: string } {
    const cfg = { ...defaultConfig, ...config }
    let css = ''
    let utilities = ''

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

            // Generate utility classes for semantic colors
            utilities += generateUtilityClass(
                varName,
                'color',
                cfg,
                `text-${camelToKebab(groupName)}-${camelToKebab(colorName)}`
            )
            utilities += generateUtilityClass(
                varName,
                'background-color',
                cfg,
                `bg-${camelToKebab(groupName)}-${camelToKebab(colorName)}`
            )
            utilities += generateUtilityClass(
                varName,
                'border-color',
                cfg,
                `border-${camelToKebab(groupName)}-${camelToKebab(colorName)}`
            )
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
        utilities += generateUtilityClass(varName, 'opacity', cfg, `opacity-${camelToKebab(name)}`)
    })

    // Semantic duration
    if (cfg.includeComments) {
        css += formatComment('Semantic Duration', cfg.minify)
    }

    Object.entries(semantic.duration).forEach(([name, value]) => {
        const varName = `${cfg.prefix}duration-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(
            varName,
            'transition-duration',
            cfg,
            `duration-${camelToKebab(name)}`
        )
    })

    // Semantic z-index
    if (cfg.includeComments) {
        css += formatComment('Semantic Z-Index', cfg.minify)
    }

    Object.entries(semantic.zIndex).forEach(([name, value]) => {
        const varName = `${cfg.prefix}z-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, 'z-index', cfg, `z-${camelToKebab(name)}`)
    })

    // Semantic glow
    if (cfg.includeComments) {
        css += formatComment('Semantic Glow', cfg.minify)
    }

    Object.entries(semantic.glow).forEach(([name, value]) => {
        const varName = `${cfg.prefix}glow-${name}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, 'filter', cfg, `glow-${name}`)
    })

    // Semantic animations
    if (cfg.includeComments) {
        css += formatComment('Semantic Animations', cfg.minify)
    }

    Object.entries(semantic.animations).forEach(([name, value]) => {
        const varName = `${cfg.prefix}animation-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(
            varName,
            'animation',
            cfg,
            `animate-${camelToKebab(name)}`
        )
    })

    // Semantic typography
    if (cfg.includeComments) {
        css += formatComment('Semantic Typography', cfg.minify)
    }

    Object.entries(semantic.typography).forEach(([category, sizes]) => {
        Object.entries(sizes).forEach(([size, value]) => {
            const varName = `${cfg.prefix}${camelToKebab(category)}-${size}`
            css += `    ${varName}: ${sanitizeValue(value)};\n`
            utilities += generateUtilityClass(
                varName,
                'font-size',
                cfg,
                `${camelToKebab(category)}-${size}`
            )
        })
    })

    return { css, utilities }
}

// Component CSS generator
export function generateComponentCss(
    components: Brand['components'],
    config: Partial<BrandCssGeneratorConfig> = {}
): { css: string; utilities: string } {
    const cfg = { ...defaultConfig, ...config }
    let css = ''
    let utilities = ''

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

                // Generate utility classes for component tokens
                const utilityName = `${camelToKebab(componentName)}-${prefix}${camelToKebab(key)}`
                utilities += generateUtilityClass(varName, 'color', cfg, utilityName)
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

    return { css, utilities }
}

// Palette CSS generator
export function generatePaletteCss(
    palette: Brand['palettes'],
    config: Partial<BrandCssGeneratorConfig> = {}
): { css: string; utilities: string } {
    const cfg = { ...defaultConfig, ...config }
    let css = ''
    let utilities = ''

    if (!palette) return { css, utilities }

    if (cfg.includeComments) {
        css += formatComment('🎨 Theme Palette Colors', cfg.minify)
    }

    Object.entries(palette).forEach(([themeName, themeColors]) => {
        if (cfg.includeComments) {
            css += formatComment(`${themeName} Theme`, cfg.minify)
        }

        Object.entries(themeColors as Record<string, Record<string, string>>).forEach(
            ([groupName, colors]) => {
                Object.entries(colors).forEach(([colorName, value]) => {
                    const varName = `${cfg.prefix}${camelToKebab(groupName)}-${camelToKebab(colorName)}`
                    css += `    ${varName}: ${sanitizeValue(value)};\n`

                    // Generate utility classes for palette colors
                    utilities += generateUtilityClass(
                        varName,
                        'color',
                        cfg,
                        `text-${camelToKebab(groupName)}-${camelToKebab(colorName)}`
                    )
                    utilities += generateUtilityClass(
                        varName,
                        'background-color',
                        cfg,
                        `bg-${camelToKebab(groupName)}-${camelToKebab(colorName)}`
                    )
                })
            }
        )
    })

    return { css, utilities }
}

// Main Brand CSS generator with new architecture
export default function generateBrandCss(
    brand: Brand,
    config: Partial<BrandCssGeneratorConfig> = {}
): BrandCssGenerationResult {
    const cfg = { ...defaultConfig, ...config }
    const variables: Record<string, string> = {}
    const utilities: Record<string, string> = {}

    let css = ''
    let utilitiesCss = ''

    // Add selector and opening brace
    const brandSelector = cfg.brandName ? `[data-brand="${cfg.brandName}"]` : cfg.selector
    css += `${brandSelector} {\n`

    if (cfg.includeComments) {
        css += formatComment(`Generated from Brand configuration: ${brand.name}`, cfg.minify, true)
    }

    // Generate foundation CSS
    const foundationResult = generateFoundationCss(brand.foundation, {
        ...config,
        includeComments: cfg.includeComments,
    })
    css += foundationResult.css
    utilitiesCss += foundationResult.utilities

    // Generate semantic CSS
    const semanticResult = generateSemanticCss(brand.semantic, {
        ...config,
        includeComments: cfg.includeComments,
    })
    css += semanticResult.css
    utilitiesCss += semanticResult.utilities

    // Generate component CSS
    const componentResult = generateComponentCss(brand.components, {
        ...config,
        includeComments: cfg.includeComments,
    })
    css += componentResult.css
    utilitiesCss += componentResult.utilities

    // Generate palettes CSS
    if (brand.palettes) {
        const paletteResult = generatePaletteCss(brand.palettes, {
            ...config,
            includeComments: cfg.includeComments,
        })
        css += paletteResult.css
        utilitiesCss += paletteResult.utilities
    }

    // Close selector
    css += '}\n'

    // Add utilities section
    if (cfg.generateUtilities && utilitiesCss) {
        css += '\n/* Utility Classes */\n'
        css += utilitiesCss
    }

    // Count variables and utilities
    const variableCount = (css.match(/--[\w-]+:/g) || []).length
    const utilityCount = (utilitiesCss.match(/\./g) || []).length

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
        utilities,
        stats: {
            variableCount,
            utilityCount,
            bytes: css.length,
        },
    }
}
