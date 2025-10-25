import Brand from '@sky-modules/design/Brand'

import type { BrandCssGeneratorConfig, GeneratorResult } from './types'

import { camelToKebab, formatComment, sanitizeValue } from './helpers'
import { defaultConfig } from './types'
import { generateUtilityClass } from './utilities'

// Palette CSS generator
export function generatePaletteCss(palette: Brand['palettes'], config: Partial<BrandCssGeneratorConfig> = {}): GeneratorResult {
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

        Object.entries(themeColors as Record<string, Record<string, string>>).forEach(([groupName, colors]) => {
            Object.entries(colors).forEach(([colorName, value]) => {
                const varName = `${cfg.prefix}${camelToKebab(groupName)}-${camelToKebab(colorName)}`
                css += `    ${varName}: ${sanitizeValue(value)};\n`

                // Generate utility classes for palette colors
                utilities += generateUtilityClass(varName, value, 'color', cfg, `text-${camelToKebab(groupName)}-${camelToKebab(colorName)}`)
                utilities += generateUtilityClass(varName, value, 'background-color', cfg, `bg-${camelToKebab(groupName)}-${camelToKebab(colorName)}`)
            })
        })
    })

    return { css, utilities }
}

// Palette Color System CSS generator - generates palette variables with --palette- prefix
export function generatePaletteColorsCss(foundation: Brand['foundation'], config: Partial<BrandCssGeneratorConfig> = {}): string {
    const cfg = { ...defaultConfig, ...config }
    let css = ''

    if (!foundation.colors) return css

    // Helper to map color scale (50-950) to palette variables (1-12)
    const mapColorScaleToPaletteVars = (colorScale: Record<string, string>) => {
        const paletteMapping: Record<string, string> = {
            '50': 'palette-1',
            '100': 'palette-2',
            '200': 'palette-3',
            '300': 'palette-4',
            '400': 'palette-5',
            '500': 'palette-6',
            '600': 'palette-7',
            '700': 'palette-8',
            '800': 'palette-9',
            '900': 'palette-10',
            '950': 'palette-11',
        }

        let vars = ''
        Object.entries(paletteMapping).forEach(([shade, paletteVar]) => {
            if (colorScale[shade]) {
                vars += `    ${cfg.prefix}${paletteVar}: ${sanitizeValue(colorScale[shade])};\n`
            }
        })

        // Add palette-12 for highest contrast (use 950 or fallback to 900)
        if (colorScale['950']) {
            vars += `    ${cfg.prefix}palette-12: ${sanitizeValue(colorScale['950'])};\n`
        } else if (colorScale['900']) {
            vars += `    ${cfg.prefix}palette-12: ${sanitizeValue(colorScale['900'])};\n`
        }

        return vars
    }

    // Get all brand color palettes
    const brandColors = foundation.colors.brand || {}

    // Get neutral/gray palette
    const neutralColors = foundation.colors.neutral || foundation.colors.gray || {}

    // Generate palette selectors for brand colors
    Object.entries(brandColors).forEach(([colorName, colorScale]) => {
        if (typeof colorScale === 'object' && colorScale !== null) {
            css += `\n[data-palette="${camelToKebab(colorName)}"] {\n`
            css += mapColorScaleToPaletteVars(colorScale as Record<string, string>)
            css += '}\n'
        }
    })

    // Generate palette selector for neutral/gray
    if (neutralColors && typeof neutralColors === 'object') {
        css += `\n[data-palette="gray"], [data-palette="neutral"] {\n`
        css += mapColorScaleToPaletteVars(neutralColors as Record<string, string>)
        css += '}\n'
    }

    // Generate for Tailwind default color names if they exist in foundation
    const tailwindColorNames = [
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
        'slate',
        'zinc',
        'stone',
    ]

    tailwindColorNames.forEach(colorName => {
        const colorScale = foundation.colors?.[colorName]
        if (colorScale && typeof colorScale === 'object') {
            css += `\n[data-palette="${colorName}"] {\n`
            css += mapColorScaleToPaletteVars(colorScale as Record<string, string>)
            css += '}\n'
        }
    })

    return css
}
