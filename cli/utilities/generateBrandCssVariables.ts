// 🎨 Brand CSS Variables & Utility Classes Generator - converts Brand objects to CSS variables and utility classes
import '@sky-modules/cli/configuration/Sky.App.global'

import path from 'path'

import Brand from '@sky-modules/design/Brand'

import { generateTailwindConfig } from './generateTailwindConfig'

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
    pandaConfig: Record<string, any>
    tailwindConfig: string
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

// Helper function to wrap primitive values in { value: ... } format for Panda CSS
function wrapTokenValues(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj
    }

    // If it's a primitive value, wrap it
    if (typeof obj !== 'object' || Array.isArray(obj)) {
        return { value: obj }
    }

    // If it's an object, recursively process it
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
        result[key] = wrapTokenValues(value)
    }
    return result
}

// Generate Panda CSS theme configuration
function generatePandaConfig(brand: Brand): Record<string, any> {
    const config: Record<string, any> = {
        // Whether to use css reset
        preflight: false,
        // JSX framework for component generation
        jsxFramework: 'react',
        // Include files that use Panda CSS (relative to cwd which is app root)
        include: [`**/*.{js,jsx,ts,tsx}`],
        // Files to exclude
        exclude: ['**/node_modules/**', '**/.dev/**'],
        // The output directory for your css system (relative to cwd in web.ts which is app root)
        outdir: `x/design-system/panda`,
        // Configure CSS extraction
        watch: true,
        theme: {
            tokens: {
                colors: {},
                spacing: {},
                fontSizes: {},
                fontWeights: {},
                lineHeights: {},
                letterSpacings: {},
                radii: {},
                shadows: {},
                blurs: {},
                sizes: {},
                zIndex: {},
                durations: {},
                opacity: {},
            },
            semanticTokens: {
                colors: {},
            },
        },
    }

    // Foundation colors
    if (brand.foundation?.colors) {
        Object.entries(brand.foundation.colors).forEach(([colorName, colorScale]) => {
            if (typeof colorScale === 'object' && colorScale !== null) {
                config.theme.tokens.colors[colorName] = wrapTokenValues(colorScale)
            }
        })
    }

    // Foundation spacing
    if (brand.foundation?.spacing) {
        config.theme.tokens.spacing = wrapTokenValues(brand.foundation.spacing)
    }

    // Foundation typography
    if (brand.foundation?.typography) {
        const { fontSize, letterSpacing, lineHeight } = brand.foundation.typography

        if (fontSize) {
            Object.entries(fontSize).forEach(([size, value]) => {
                const [fontSizeValue, meta] = Array.isArray(value) ? value : [value, {}]
                config.theme.tokens.fontSizes[size] = { value: fontSizeValue }

                if (meta.lineHeight) {
                    config.theme.tokens.lineHeights[size] = { value: meta.lineHeight }
                }

                if (meta.letterSpacing) {
                    config.theme.tokens.letterSpacings[size] = { value: meta.letterSpacing }
                }
            })
        }

        if (letterSpacing) {
            config.theme.tokens.letterSpacings = {
                ...config.theme.tokens.letterSpacings,
                ...wrapTokenValues(letterSpacing),
            }
        }

        if (lineHeight) {
            config.theme.tokens.lineHeights = {
                ...config.theme.tokens.lineHeights,
                ...wrapTokenValues(lineHeight),
            }
        }
    }

    // Foundation border radius
    if (brand.foundation?.radius) {
        config.theme.tokens.radii = wrapTokenValues(brand.foundation.radius)
    }

    // Foundation shadows
    if (brand.foundation?.boxShadow) {
        config.theme.tokens.shadows = wrapTokenValues(brand.foundation.boxShadow)
    }

    // Foundation blur
    if (brand.foundation?.blur) {
        config.theme.tokens.blurs = wrapTokenValues(brand.foundation.blur)
    }

    // Foundation sizing
    if (brand.foundation?.sizing) {
        config.theme.tokens.sizes = wrapTokenValues(brand.foundation.sizing)
    }

    // Semantic colors
    if (brand.semantic?.colors) {
        Object.entries(brand.semantic.colors).forEach(([groupName, colors]) => {
            if (typeof colors === 'object' && colors !== null) {
                config.theme.semanticTokens.colors[groupName] = wrapTokenValues(colors)
            }
        })
    }

    // Semantic z-index
    if (brand.semantic?.zIndex) {
        config.theme.tokens.zIndex = wrapTokenValues(brand.semantic.zIndex)
    }

    // Semantic durations
    if (brand.semantic?.duration) {
        config.theme.tokens.durations = wrapTokenValues(brand.semantic.duration)
    }

    // Semantic opacity
    if (brand.semantic?.opacity) {
        config.theme.tokens.opacity = wrapTokenValues(brand.semantic.opacity)
    }

    return config
}

// Utility functions
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function sanitizeValue(value: unknown): string {
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

function modernizeColorFunction(value: string): string {
    // Convert rgba(r, g, b, a) to rgb(r g b / a%) modern notation
    let modernized = value.replace(
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

function formatComment(comment: string, minify: boolean, isFirst = false): string {
    return minify ? '' : `${isFirst ? '' : '\n'}    /* ${comment} */\n`
}

// Generate utility class for a CSS variable
function generateUtilityClass(
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

// Generate semantic utility classes based on color purpose
function generateSemanticUtilityClass(
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

    Object.entries(foundation.colors || {}).forEach(([colorName, colorScale]) => {
        if (typeof colorScale === 'object' && colorScale !== null) {
            // Check if this is a direct color scale (has numeric keys)
            const hasNumericKeys = Object.keys(colorScale).some(key => !isNaN(Number(key)))

            if (hasNumericKeys) {
                // Direct color scale like neutral: {50: ..., 500: ...}
                Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                    const varName = `${cfg.prefix}${camelToKebab(colorName)}-${shade}`
                    css += `    ${varName}: ${sanitizeValue(value)};\n`

                    utilities += generateUtilityClass(
                        varName,
                        value,
                        'color',
                        cfg,
                        `text-${camelToKebab(colorName)}-${shade}`
                    )
                    utilities += generateUtilityClass(
                        varName,
                        value,
                        'background-color',
                        cfg,
                        `bg-${camelToKebab(colorName)}-${shade}`
                    )
                    utilities += generateUtilityClass(
                        varName,
                        value,
                        'border-color',
                        cfg,
                        `border-${camelToKebab(colorName)}-${shade}`
                    )
                })
            } else {
                // Nested structure like brand: {primary: {50: ..., 500: ...}}
                Object.entries(colorScale).forEach(([subName, subScale]) => {
                    if (typeof subScale === 'object' && subScale !== null) {
                        Object.entries(subScale as Record<string, string>).forEach(
                            ([shade, value]) => {
                                const varName = `${cfg.prefix}${camelToKebab(colorName)}-${camelToKebab(subName)}-${shade}`
                                css += `    ${varName}: ${sanitizeValue(value)};\n`

                                utilities += generateUtilityClass(
                                    varName,
                                    value,
                                    'color',
                                    cfg,
                                    `text-${camelToKebab(colorName)}-${camelToKebab(subName)}-${shade}`
                                )
                                utilities += generateUtilityClass(
                                    varName,
                                    value,
                                    'background-color',
                                    cfg,
                                    `bg-${camelToKebab(colorName)}-${camelToKebab(subName)}-${shade}`
                                )
                                utilities += generateUtilityClass(
                                    varName,
                                    value,
                                    'border-color',
                                    cfg,
                                    `border-${camelToKebab(colorName)}-${camelToKebab(subName)}-${shade}`
                                )
                            }
                        )

                        // Create bare utility using 400 shade: brand-primary: #34d5dc
                        if (subScale['400']) {
                            const defaultValue = subScale['400'] as string
                            const varName = `${cfg.prefix}${camelToKebab(colorName)}-${camelToKebab(subName)}`
                            css += `    ${varName}: ${sanitizeValue(defaultValue)};\n`

                            utilities += generateUtilityClass(
                                varName,
                                defaultValue,
                                'color',
                                cfg,
                                `text-${camelToKebab(colorName)}-${camelToKebab(subName)}`
                            )
                            utilities += generateUtilityClass(
                                varName,
                                defaultValue,
                                'background-color',
                                cfg,
                                `bg-${camelToKebab(colorName)}-${camelToKebab(subName)}`
                            )
                            utilities += generateUtilityClass(
                                varName,
                                defaultValue,
                                'border-color',
                                cfg,
                                `border-${camelToKebab(colorName)}-${camelToKebab(subName)}`
                            )
                        }
                    }
                })
            }
        } else if (typeof colorScale === 'string') {
            Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                const varName = `${cfg.prefix}${camelToKebab(colorName)}-${shade}`
                css += `    ${varName}: ${sanitizeValue(value)};\n`

                // Generate utility classes for colors
                utilities += generateUtilityClass(
                    varName,
                    value,
                    'color',
                    cfg,
                    `text-${camelToKebab(colorName)}-${shade}`
                )
                utilities += generateUtilityClass(
                    varName,
                    value,
                    'background-color',
                    cfg,
                    `bg-${camelToKebab(colorName)}-${shade}`
                )
                utilities += generateUtilityClass(
                    varName,
                    value,
                    'border-color',
                    cfg,
                    `border-${camelToKebab(colorName)}-${shade}`
                )
            })
        } else if (typeof colorScale === 'string') {
            // Handle simple color value (only for string values)
            const varName = `${cfg.prefix}${camelToKebab(colorName)}`
            css += `    ${varName}: ${sanitizeValue(colorScale)};\n`

            utilities += generateUtilityClass(
                varName,
                colorScale,
                'color',
                cfg,
                `text-${camelToKebab(colorName)}`
            )
            utilities += generateUtilityClass(
                varName,
                colorScale,
                'background-color',
                cfg,
                `bg-${camelToKebab(colorName)}`
            )
            utilities += generateUtilityClass(
                varName,
                colorScale,
                'border-color',
                cfg,
                `border-${camelToKebab(colorName)}`
            )
        } else if (typeof colorScale === 'object' && colorScale !== null && colorScale['400']) {
            // Handle color scale objects - use 400 as default shade for bare color name
            const defaultValue = colorScale['400'] as string
            const varName = `${cfg.prefix}${camelToKebab(colorName)}`
            css += `    ${varName}: ${sanitizeValue(defaultValue)};\n`

            utilities += generateUtilityClass(
                varName,
                defaultValue,
                'color',
                cfg,
                `text-${camelToKebab(colorName)}`
            )
            utilities += generateUtilityClass(
                varName,
                defaultValue,
                'background-color',
                cfg,
                `bg-${camelToKebab(colorName)}`
            )
            utilities += generateUtilityClass(
                varName,
                defaultValue,
                'border-color',
                cfg,
                `border-${camelToKebab(colorName)}`
            )
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
        utilities += generateUtilityClass(
            varName,
            fontList.join(', '),
            'font-family',
            cfg,
            `font-${camelToKebab(name)}`
        )
    })

    // Font sizes
    Object.entries(foundation.typography.fontSize).forEach(([size, sizeConfig]) => {
        const [value, meta] = Array.isArray(sizeConfig)
            ? sizeConfig
            : [String(sizeConfig), { lineHeight: '1' }]
        const baseVar = `${cfg.prefix}text-${size}`
        css += `    ${baseVar}: ${value};\n`
        css += `    ${baseVar}-lh: ${meta.lineHeight};\n`
        utilities += generateUtilityClass(baseVar, value, 'font-size', cfg, `text-${size}`)

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

        // Padding utilities
        utilities += generateUtilityClass(varName, value, 'padding', cfg, `p-${size}`)
        utilities += generateUtilityClass(
            varName,
            `${value} ${value}`,
            'padding',
            cfg,
            `px-${size}`
        )
        utilities += generateUtilityClass(varName, `${value} 0`, 'padding', cfg, `py-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-top', cfg, `pt-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-right', cfg, `pr-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-bottom', cfg, `pb-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-left', cfg, `pl-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-inline-start', cfg, `ps-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-inline-end', cfg, `pe-${size}`)

        // Margin utilities
        utilities += generateUtilityClass(varName, value, 'margin', cfg, `m-${size}`)
        utilities += generateUtilityClass(varName, `${value} ${value}`, 'margin', cfg, `mx-${size}`)
        utilities += generateUtilityClass(varName, `${value} 0`, 'margin', cfg, `my-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-top', cfg, `mt-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-right', cfg, `mr-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-bottom', cfg, `mb-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-left', cfg, `ml-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-inline-start', cfg, `ms-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-inline-end', cfg, `me-${size}`)

        // Gap utilities
        utilities += generateUtilityClass(varName, value, 'gap', cfg, `gap-${size}`)
        utilities += generateUtilityClass(varName, value, 'column-gap', cfg, `gap-x-${size}`)
        utilities += generateUtilityClass(varName, value, 'row-gap', cfg, `gap-y-${size}`)
    })

    // Sizing
    if (foundation.sizing) {
        if (cfg.includeComments) {
            css += formatComment('Sizing Scale', cfg.minify)
        }

        Object.entries(foundation.sizing).forEach(([size, value]) => {
            const varName = `${cfg.prefix}size-${size.replace('.', '-')}`
            css += `    ${varName}: ${sanitizeValue(value)};\n`
            utilities += generateUtilityClass(varName, value, 'width', cfg, `w-${size}`)
            utilities += generateUtilityClass(varName, value, 'height', cfg, `h-${size}`)
            utilities += generateUtilityClass(varName, value, 'min-width', cfg, `min-w-${size}`)
            utilities += generateUtilityClass(varName, value, 'min-height', cfg, `min-h-${size}`)
            utilities += generateUtilityClass(varName, value, 'max-width', cfg, `max-w-${size}`)
            utilities += generateUtilityClass(varName, value, 'max-height', cfg, `max-h-${size}`)
        })
    }

    // Border radius
    if (cfg.includeComments) {
        css += formatComment('Border Radius', cfg.minify)
    }

    Object.entries(foundation.radius).forEach(([size, value]) => {
        const varName = `${cfg.prefix}radius-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'border-radius', cfg, `rounded-${size}`)
    })

    // Shadows
    if (cfg.includeComments) {
        css += formatComment('Shadows', cfg.minify)
    }

    Object.entries(foundation.boxShadow).forEach(([size, value]) => {
        const varName = `${cfg.prefix}shadow-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'box-shadow', cfg, `shadow-${size}`)
    })

    // Foundation glow
    if (cfg.includeComments) {
        css += formatComment('Foundation Glow', cfg.minify)
    }

    Object.entries(foundation.glow).forEach(([size, value]) => {
        const varName = `${cfg.prefix}glow-foundation-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'filter', cfg, `glow-${size}`)
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
    foundation: Brand['foundation'],
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

            // Generate semantic utility classes
            utilities += generateSemanticUtilityClass(value, cfg, groupName, colorName)
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
        utilities += generateUtilityClass(
            varName,
            value,
            'opacity',
            cfg,
            `opacity-${camelToKebab(name)}`
        )
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
            value,
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
        utilities += generateUtilityClass(
            varName,
            String(value),
            'z-index',
            cfg,
            `z-${camelToKebab(name)}`
        )
    })

    // Semantic glow
    // Semantic glow was removed from interface, skip this section

    // Semantic radius
    if (semantic.radius) {
        if (cfg.includeComments) {
            css += formatComment('Semantic Radius', cfg.minify)
        }

        Object.entries(semantic.radius).forEach(([name, value]) => {
            const varName = `${cfg.prefix}radius-${camelToKebab(name)}`
            css += `    ${varName}: ${sanitizeValue(value)};\n`
            utilities += generateUtilityClass(
                varName,
                value,
                'border-radius',
                cfg,
                `rounded-${camelToKebab(name)}`
            )
        })
    }

    // Semantic animations
    if (cfg.includeComments) {
        css += formatComment('Semantic Animations', cfg.minify)
    }

    Object.entries(semantic.animations).forEach(([name, value]) => {
        const varName = `${cfg.prefix}animation-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(
            varName,
            value,
            'animation',
            cfg,
            `animate-${camelToKebab(name)}`
        )
    })

    // Semantic motion
    if (semantic.motion) {
        if (cfg.includeComments) {
            css += formatComment('Semantic Motion', cfg.minify)
        }

        // Handle nested motion objects (translate, scale, button, card)
        Object.entries(semantic.motion).forEach(([category, values]) => {
            if (typeof values === 'object' && values !== null) {
                Object.entries(values).forEach(([name, value]) => {
                    const varName = `${cfg.prefix}motion-${camelToKebab(category)}-${camelToKebab(name)}`
                    css += `    ${varName}: ${sanitizeValue(value)};\n`
                    utilities += generateUtilityClass(
                        varName,
                        value,
                        'transform',
                        cfg,
                        `motion-${camelToKebab(category)}-${camelToKebab(name)}`
                    )
                })
            } else {
                // Handle direct motion values (pop, push, bounce, wiggle)
                const varName = `${cfg.prefix}motion-${camelToKebab(category)}`
                css += `    ${varName}: ${sanitizeValue(values)};\n`
                utilities += generateUtilityClass(
                    varName,
                    values as string,
                    'transform',
                    cfg,
                    `motion-${camelToKebab(category)}`
                )
            }
        })
    }

    // Semantic typography
    if (cfg.includeComments) {
        css += formatComment('Semantic Typography', cfg.minify)
    }

    // Handle direct typography tokens (primary, secondary, tertiary font families)
    if (semantic.typography.primary) {
        const varName = `${cfg.prefix}font-primary`
        const resolvedValue = semantic.typography.primary
        css += `    ${varName}: ${sanitizeValue(resolvedValue)};\n`
        utilities += generateUtilityClass(
            varName,
            resolvedValue,
            'font-family',
            cfg,
            'font-primary'
        )
    }

    if (semantic.typography.secondary) {
        const varName = `${cfg.prefix}font-secondary`
        const resolvedValue = semantic.typography.secondary
        css += `    ${varName}: ${sanitizeValue(resolvedValue)};\n`
        utilities += generateUtilityClass(
            varName,
            resolvedValue,
            'font-family',
            cfg,
            'font-secondary'
        )
    }

    if (semantic.typography.tertiary) {
        const varName = `${cfg.prefix}font-tertiary`
        const resolvedValue = semantic.typography.tertiary
        css += `    ${varName}: ${sanitizeValue(resolvedValue)};\n`
        utilities += generateUtilityClass(
            varName,
            resolvedValue,
            'font-family',
            cfg,
            'font-tertiary'
        )
    }

    // Handle nested typography categories
    Object.entries(semantic.typography).forEach(([category, sizes]) => {
        if (
            typeof sizes === 'object' &&
            sizes !== null &&
            category !== 'primary' &&
            category !== 'secondary' &&
            category !== 'tertiary'
        ) {
            Object.entries(sizes).forEach(([size, value]) => {
                const varName = `${cfg.prefix}${camelToKebab(category)}-${size}`

                // Resolve typography token to actual font size
                let resolvedValue = value

                if (typeof value === 'string' && foundation?.typography?.fontSize) {
                    const fontSizeToken =
                        foundation.typography.fontSize[
                            value as keyof typeof foundation.typography.fontSize
                        ]

                    if (fontSizeToken) {
                        const [fontSize] = Array.isArray(fontSizeToken)
                            ? fontSizeToken
                            : [fontSizeToken]
                        resolvedValue = fontSize
                    }
                }

                css += `    ${varName}: ${sanitizeValue(resolvedValue)};\n`
                utilities += generateUtilityClass(
                    varName,
                    resolvedValue,
                    'font-size',
                    cfg,
                    `${camelToKebab(category)}-${size}`
                )
            })
        }
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
                utilities += generateUtilityClass(varName, String(value), 'color', cfg, utilityName)
            }
        })
    }

    // Generate all component variables
    Object.entries(components || {}).forEach(([componentName, componentConfig]) => {
        if (cfg.includeComments) {
            css += formatComment(
                `${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Component`,
                cfg.minify
            )
        }

        if (componentConfig && typeof componentConfig === 'object') {
            generateComponentVars(componentName, componentConfig)
        }
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
                        value,
                        'color',
                        cfg,
                        `text-${camelToKebab(groupName)}-${camelToKebab(colorName)}`
                    )
                    utilities += generateUtilityClass(
                        varName,
                        value,
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
    const semanticResult = generateSemanticCss(brand.semantic, brand.foundation, {
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

    // Generate framework mappings
    const pandaConfig = generatePandaConfig(brand)
    const tailwindConfig = generateTailwindConfig(brand)

    return {
        css,
        variables,
        utilities,
        pandaConfig,
        tailwindConfig,
        stats: {
            variableCount,
            utilityCount,
            bytes: css.length,
        },
    }
}
