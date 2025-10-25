import Brand from '@sky-modules/design/Brand'

import type { BrandCssGeneratorConfig, GeneratorResult } from './types'

import { camelToKebab, formatComment, sanitizeValue } from './helpers'
import { defaultConfig } from './types'
import { generateColorUtilities, generateUtilityClass } from './utilities'

// Generate foundation colors CSS
function generateColors(
    colors: Brand['foundation']['colors'],
    config: Required<BrandCssGeneratorConfig>
): { css: string; utilities: string } {
    let css = ''
    let utilities = ''

    if (config.includeComments) {
        css += formatComment('Color Scales', config.minify)
    }

    Object.entries(colors || {}).forEach(([colorName, colorScale]) => {
        if (typeof colorScale === 'object' && colorScale !== null) {
            // Check if this is a direct color scale (has numeric keys)
            const hasNumericKeys = Object.keys(colorScale).some(key => !isNaN(Number(key)))

            if (hasNumericKeys) {
                // Direct color scale like neutral: {50: ..., 500: ...}
                Object.entries(colorScale as Record<string, string>).forEach(([shade, value]) => {
                    const varName = `${config.prefix}${camelToKebab(colorName)}-${shade}`
                    css += `    ${varName}: ${sanitizeValue(value)};\n`
                    utilities += generateColorUtilities(varName, value, `${camelToKebab(colorName)}-${shade}`, config)
                })
            } else {
                // Nested structure like brand: {primary: {50: ..., 500: ...}}
                Object.entries(colorScale).forEach(([subName, subScale]) => {
                    if (typeof subScale === 'object' && subScale !== null) {
                        Object.entries(subScale as Record<string, string>).forEach(([shade, value]) => {
                            const varName = `${config.prefix}${camelToKebab(colorName)}-${camelToKebab(subName)}-${shade}`
                            css += `    ${varName}: ${sanitizeValue(value)};\n`
                            utilities += generateColorUtilities(
                                varName,
                                value,
                                `${camelToKebab(colorName)}-${camelToKebab(subName)}-${shade}`,
                                config
                            )
                        })

                        // Create bare utility using 400 shade: brand-primary: #34d5dc
                        if (subScale['400']) {
                            const defaultValue = subScale['400'] as string
                            const varName = `${config.prefix}${camelToKebab(colorName)}-${camelToKebab(subName)}`
                            css += `    ${varName}: ${sanitizeValue(defaultValue)};\n`
                            utilities += generateColorUtilities(
                                varName,
                                defaultValue,
                                `${camelToKebab(colorName)}-${camelToKebab(subName)}`,
                                config
                            )
                        }
                    }
                })
            }
        } else if (typeof colorScale === 'string') {
            // Handle simple color value
            const varName = `${config.prefix}${camelToKebab(colorName)}`
            css += `    ${varName}: ${sanitizeValue(colorScale)};\n`
            utilities += generateColorUtilities(varName, colorScale, camelToKebab(colorName), config)
        }
    })

    return { css, utilities }
}

// Generate typography CSS
function generateTypography(
    typography: Brand['foundation']['typography'],
    config: Required<BrandCssGeneratorConfig>
): { css: string; utilities: string } {
    let css = ''
    let utilities = ''

    if (config.includeComments) {
        css += formatComment('Typography', config.minify)
    }

    // Font families
    Object.entries(typography.fontFamily).forEach(([name, fonts]) => {
        const varName = `${config.prefix}font-${camelToKebab(name)}`
        const fontList = Array.isArray(fonts) ? fonts : [String(fonts)]
        css += `    ${varName}: ${fontList.join(', ')};\n`
        utilities += generateUtilityClass(varName, fontList.join(', '), 'font-family', config, `font-${camelToKebab(name)}`)
    })

    // Font sizes
    Object.entries(typography.fontSize).forEach(([size, sizeConfig]) => {
        const [value, meta] = Array.isArray(sizeConfig) ? sizeConfig : [String(sizeConfig), { lineHeight: '1' }]
        const baseVar = `${config.prefix}text-${size}`
        css += `    ${baseVar}: ${value};\n`
        css += `    ${baseVar}-lh: ${meta.lineHeight};\n`
        utilities += generateUtilityClass(baseVar, value, 'font-size', config, `text-${size}`)

        if (meta.letterSpacing) {
            css += `    ${baseVar}-ls: ${meta.letterSpacing};\n`
        }
    })

    return { css, utilities }
}

// Generate spacing CSS
function generateSpacing(
    spacing: Brand['foundation']['spacing'],
    config: Required<BrandCssGeneratorConfig>
): { css: string; utilities: string } {
    let css = ''
    let utilities = ''

    if (config.includeComments) {
        css += formatComment('Spacing Scale', config.minify)
    }

    Object.entries(spacing).forEach(([size, value]) => {
        const varName = `${config.prefix}spacing-${size.replace('.', '-')}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`

        // Padding utilities
        utilities += generateUtilityClass(varName, value, 'padding', config, `p-${size}`)
        utilities += generateUtilityClass(varName, `${value} ${value}`, 'padding', config, `px-${size}`)
        utilities += generateUtilityClass(varName, `${value} 0`, 'padding', config, `py-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-top', config, `pt-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-right', config, `pr-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-bottom', config, `pb-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-left', config, `pl-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-inline-start', config, `ps-${size}`)
        utilities += generateUtilityClass(varName, value, 'padding-inline-end', config, `pe-${size}`)

        // Margin utilities
        utilities += generateUtilityClass(varName, value, 'margin', config, `m-${size}`)
        utilities += generateUtilityClass(varName, `${value} ${value}`, 'margin', config, `mx-${size}`)
        utilities += generateUtilityClass(varName, `${value} 0`, 'margin', config, `my-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-top', config, `mt-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-right', config, `mr-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-bottom', config, `mb-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-left', config, `ml-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-inline-start', config, `ms-${size}`)
        utilities += generateUtilityClass(varName, value, 'margin-inline-end', config, `me-${size}`)

        // Gap utilities
        utilities += generateUtilityClass(varName, value, 'gap', config, `gap-${size}`)
        utilities += generateUtilityClass(varName, value, 'column-gap', config, `gap-x-${size}`)
        utilities += generateUtilityClass(varName, value, 'row-gap', config, `gap-y-${size}`)
    })

    return { css, utilities }
}

// Generate sizing CSS
function generateSizing(
    sizing: Brand['foundation']['sizing'] | undefined,
    config: Required<BrandCssGeneratorConfig>
): { css: string; utilities: string } {
    let css = ''
    let utilities = ''

    if (!sizing) return { css, utilities }

    if (config.includeComments) {
        css += formatComment('Sizing Scale', config.minify)
    }

    Object.entries(sizing).forEach(([size, value]) => {
        const varName = `${config.prefix}size-${size.replace('.', '-')}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'width', config, `w-${size}`)
        utilities += generateUtilityClass(varName, value, 'height', config, `h-${size}`)
        utilities += generateUtilityClass(varName, value, 'min-width', config, `min-w-${size}`)
        utilities += generateUtilityClass(varName, value, 'min-height', config, `min-h-${size}`)
        utilities += generateUtilityClass(varName, value, 'max-width', config, `max-w-${size}`)
        utilities += generateUtilityClass(varName, value, 'max-height', config, `max-h-${size}`)
    })

    return { css, utilities }
}

// Generate radius, shadows, and other foundation tokens
function generateOtherTokens(
    foundation: Brand['foundation'],
    config: Required<BrandCssGeneratorConfig>
): { css: string; utilities: string } {
    let css = ''
    let utilities = ''

    // Border radius
    if (config.includeComments) {
        css += formatComment('Border Radius', config.minify)
    }

    Object.entries(foundation.radius).forEach(([size, value]) => {
        const varName = `${config.prefix}radius-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'border-radius', config, `rounded-${size}`)
    })

    // Shadows
    if (config.includeComments) {
        css += formatComment('Shadows', config.minify)
    }

    Object.entries(foundation.boxShadow).forEach(([size, value]) => {
        const varName = `${config.prefix}shadow-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'box-shadow', config, `shadow-${size}`)
    })

    // Foundation glow
    if (config.includeComments) {
        css += formatComment('Foundation Glow', config.minify)
    }

    Object.entries(foundation.glow).forEach(([size, value]) => {
        const varName = `${config.prefix}glow-foundation-${size}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'filter', config, `glow-${size}`)
    })

    // Breakpoints
    if (config.includeComments) {
        css += formatComment('Breakpoints', config.minify)
    }

    Object.entries(foundation.screens).forEach(([screen, value]) => {
        const varName = `${config.prefix}screen-${screen}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
    })

    return { css, utilities }
}

// Foundation CSS generator
export function generateFoundationCss(
    foundation: Brand['foundation'],
    config: Partial<BrandCssGeneratorConfig> = {}
): GeneratorResult {
    const cfg = { ...defaultConfig, ...config }
    let css = ''
    let utilities = ''

    if (cfg.includeComments) {
        css += formatComment('🏗️ Foundation - Atomic Design Tokens', cfg.minify)
    }

    // Generate each category
    const colors = generateColors(foundation.colors, cfg)
    css += colors.css
    utilities += colors.utilities

    const typography = generateTypography(foundation.typography, cfg)
    css += typography.css
    utilities += typography.utilities

    const spacing = generateSpacing(foundation.spacing, cfg)
    css += spacing.css
    utilities += spacing.utilities

    const sizing = generateSizing(foundation.sizing, cfg)
    css += sizing.css
    utilities += sizing.utilities

    const other = generateOtherTokens(foundation, cfg)
    css += other.css
    utilities += other.utilities

    return { css, utilities }
}
