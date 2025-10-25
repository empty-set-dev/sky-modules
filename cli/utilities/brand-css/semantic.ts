import Brand from '@sky-modules/design/Brand'

import type { BrandCssGeneratorConfig, GeneratorResult } from './types'

import { camelToKebab, formatComment, sanitizeValue } from './helpers'
import { defaultConfig } from './types'
import { generateSemanticUtilityClass, generateUtilityClass } from './utilities'

// Semantic CSS generator
export function generateSemanticCss(
    semantic: Brand['semantic'],
    foundation: Brand['foundation'],
    config: Partial<BrandCssGeneratorConfig> = {}
): GeneratorResult {
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
        utilities += generateUtilityClass(varName, value, 'opacity', cfg, `opacity-${camelToKebab(name)}`)
    })

    // Semantic duration
    if (cfg.includeComments) {
        css += formatComment('Semantic Duration', cfg.minify)
    }

    Object.entries(semantic.duration).forEach(([name, value]) => {
        const varName = `${cfg.prefix}duration-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'transition-duration', cfg, `duration-${camelToKebab(name)}`)
    })

    // Semantic z-index
    if (cfg.includeComments) {
        css += formatComment('Semantic Z-Index', cfg.minify)
    }

    Object.entries(semantic.zIndex).forEach(([name, value]) => {
        const varName = `${cfg.prefix}z-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, String(value), 'z-index', cfg, `z-${camelToKebab(name)}`)
    })

    // Semantic radius
    if (semantic.radius) {
        if (cfg.includeComments) {
            css += formatComment('Semantic Radius', cfg.minify)
        }

        Object.entries(semantic.radius).forEach(([name, value]) => {
            const varName = `${cfg.prefix}radius-${camelToKebab(name)}`
            css += `    ${varName}: ${sanitizeValue(value)};\n`
            utilities += generateUtilityClass(varName, value, 'border-radius', cfg, `rounded-${camelToKebab(name)}`)
        })
    }

    // Semantic animations
    if (cfg.includeComments) {
        css += formatComment('Semantic Animations', cfg.minify)
    }

    Object.entries(semantic.animations).forEach(([name, value]) => {
        const varName = `${cfg.prefix}animation-${camelToKebab(name)}`
        css += `    ${varName}: ${sanitizeValue(value)};\n`
        utilities += generateUtilityClass(varName, value, 'animation', cfg, `animate-${camelToKebab(name)}`)
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
                utilities += generateUtilityClass(varName, values as string, 'transform', cfg, `motion-${camelToKebab(category)}`)
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
        utilities += generateUtilityClass(varName, resolvedValue, 'font-family', cfg, 'font-primary')
    }

    if (semantic.typography.secondary) {
        const varName = `${cfg.prefix}font-secondary`
        const resolvedValue = semantic.typography.secondary
        css += `    ${varName}: ${sanitizeValue(resolvedValue)};\n`
        utilities += generateUtilityClass(varName, resolvedValue, 'font-family', cfg, 'font-secondary')
    }

    if (semantic.typography.tertiary) {
        const varName = `${cfg.prefix}font-tertiary`
        const resolvedValue = semantic.typography.tertiary
        css += `    ${varName}: ${sanitizeValue(resolvedValue)};\n`
        utilities += generateUtilityClass(varName, resolvedValue, 'font-family', cfg, 'font-tertiary')
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
                    const fontSizeToken = foundation.typography.fontSize[value as keyof typeof foundation.typography.fontSize]

                    if (fontSizeToken) {
                        const [fontSize] = Array.isArray(fontSizeToken) ? fontSizeToken : [fontSizeToken]
                        resolvedValue = fontSize
                    }
                }

                css += `    ${varName}: ${sanitizeValue(resolvedValue)};\n`
                utilities += generateUtilityClass(varName, resolvedValue, 'font-size', cfg, `${camelToKebab(category)}-${size}`)
            })
        }
    })

    return { css, utilities }
}
