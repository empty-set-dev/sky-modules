import Brand from '@sky-modules/design/Brand'

import { wrapTokenValues } from './helpers'

// Generate Panda CSS theme configuration
export function generatePandaConfig(brand: Brand): Record<string, unknown> {
    const tokens: Record<string, unknown> = {
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
    }

    const semanticTokens: Record<string, unknown> = {
        colors: {},
    }

    const config: Record<string, unknown> = {
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
            tokens,
            semanticTokens,
        },
    }

    // Foundation colors
    if (brand.foundation?.colors) {
        Object.entries(brand.foundation.colors).forEach(([colorName, colorScale]) => {
            if (typeof colorScale === 'object' && colorScale !== null) {
                tokens.colors[colorName] = wrapTokenValues(colorScale)
            }
        })
    }

    // Foundation spacing
    if (brand.foundation?.spacing) {
        tokens.spacing = wrapTokenValues(brand.foundation.spacing)
    }

    // Foundation typography
    if (brand.foundation?.typography) {
        const { fontSize, letterSpacing, lineHeight } = brand.foundation.typography

        if (fontSize) {
            Object.entries(fontSize).forEach(([size, value]) => {
                const [fontSizeValue, meta] = Array.isArray(value) ? value : [value, {}]
                tokens.fontSizes[size] = { value: fontSizeValue }

                if (meta.lineHeight) {
                    tokens.lineHeights[size] = { value: meta.lineHeight }
                }

                if (meta.letterSpacing) {
                    tokens.letterSpacings[size] = { value: meta.letterSpacing }
                }
            })
        }

        if (letterSpacing) {
            const wrappedLetterSpacing = wrapTokenValues(letterSpacing)
            tokens.letterSpacings = {
                ...(tokens.letterSpacings as Record<string, unknown>),
                ...(wrappedLetterSpacing as Record<string, unknown>),
            }
        }

        if (lineHeight) {
            const wrappedLineHeight = wrapTokenValues(lineHeight)
            tokens.lineHeights = {
                ...(tokens.lineHeights as Record<string, unknown>),
                ...(wrappedLineHeight as Record<string, unknown>),
            }
        }
    }

    // Foundation border radius
    if (brand.foundation?.radius) {
        tokens.radii = wrapTokenValues(brand.foundation.radius)
    }

    // Foundation shadows
    if (brand.foundation?.boxShadow) {
        tokens.shadows = wrapTokenValues(brand.foundation.boxShadow)
    }

    // Foundation blur
    if (brand.foundation?.blur) {
        tokens.blurs = wrapTokenValues(brand.foundation.blur)
    }

    // Foundation sizing
    if (brand.foundation?.sizing) {
        tokens.sizes = wrapTokenValues(brand.foundation.sizing)
    }

    // Semantic colors
    if (brand.semantic?.colors) {
        Object.entries(brand.semantic.colors).forEach(([groupName, colors]) => {
            if (typeof colors === 'object' && colors !== null) {
                semanticTokens.colors[groupName] = wrapTokenValues(colors)
            }
        })
    }

    // Semantic z-index
    if (brand.semantic?.zIndex) {
        tokens.zIndex = wrapTokenValues(brand.semantic.zIndex)
    }

    // Semantic durations
    if (brand.semantic?.duration) {
        tokens.durations = wrapTokenValues(brand.semantic.duration)
    }

    // Semantic opacity
    if (brand.semantic?.opacity) {
        tokens.opacity = wrapTokenValues(brand.semantic.opacity)
    }

    return config
}
