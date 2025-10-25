// Main entry point for brand CSS generation
import '@sky-modules/cli/configuration/Sky.App.namespace'

import Brand from '@sky-modules/design/Brand'

import { generateTailwindConfig } from '../generateTailwindConfig'
import { generateComponentCss } from './components'
import { generateFoundationCss } from './foundation'
import { generatePandaConfig } from './panda-config'
import { generatePaletteCss, generatePaletteColorsCss } from './palette'
import { generateSemanticCss } from './semantic'
import type { BrandCssGenerationResult, BrandCssGeneratorConfig } from './types'
import { defaultConfig } from './types'

// Re-export types and sub-generators
export type { BrandCssGeneratorConfig, BrandCssGenerationResult, GeneratorResult } from './types'
export { generateFoundationCss } from './foundation'
export { generateSemanticCss } from './semantic'
export { generateComponentCss } from './components'
export { generatePaletteCss, generatePaletteColorsCss } from './palette'
export { generatePandaConfig } from './panda-config'
export * from './helpers'
export * from './utilities'

// Main Brand CSS generator with new architecture
export default function generateBrandCss(brand: Brand, config: Partial<BrandCssGeneratorConfig> = {}): BrandCssGenerationResult {
    const cfg = { ...defaultConfig, ...config }
    const variables: Record<string, string> = {}
    const utilities: Record<string, string> = {}

    let css = ''
    let utilitiesCss = ''

    // Add selector and opening brace
    const brandSelector = cfg.brandName ? `[data-brand="${cfg.brandName}"]` : cfg.selector
    css += `${brandSelector} {\n`

    if (cfg.includeComments) {
        const comment = `Generated from Brand configuration: ${brand.name}`
        css += cfg.minify ? '' : `    /* ${comment} */\n`
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

    // Generate palette color system (data-palette selectors)
    const paletteColorsCss = generatePaletteColorsCss(brand.foundation, {
        ...config,
        includeComments: cfg.includeComments,
    })
    css += paletteColorsCss

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
