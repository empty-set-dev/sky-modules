import type { ColorPalette } from './ColorPalette'
import { designSystem } from './index'

/**
 * Pre-built color palettes for common use cases
 */
export const colorPresets = {
    /**
     * Modern blue palette
     */
    ocean: {
        primary: designSystem.generateColorScale('#0ea5e9'),
        secondary: designSystem.generateColorScale('#06b6d4'),
        accent: designSystem.generateColorScale('#8b5cf6'),
        neutral: designSystem.generateColorScale('#64748b'),
        success: designSystem.generateColorScale('#10b981'),
        warning: designSystem.generateColorScale('#f59e0b'),
        error: designSystem.generateColorScale('#ef4444'),
        info: designSystem.generateColorScale('#3b82f6')
    } as ColorPalette,

    /**
     * Warm sunset palette
     */
    sunset: {
        primary: designSystem.generateColorScale('#f97316'),
        secondary: designSystem.generateColorScale('#eab308'),
        accent: designSystem.generateColorScale('#ec4899'),
        neutral: designSystem.generateColorScale('#6b7280'),
        success: designSystem.generateColorScale('#22c55e'),
        warning: designSystem.generateColorScale('#f59e0b'),
        error: designSystem.generateColorScale('#ef4444'),
        info: designSystem.generateColorScale('#06b6d4')
    } as ColorPalette,

    /**
     * Nature green palette
     */
    forest: {
        primary: designSystem.generateColorScale('#059669'),
        secondary: designSystem.generateColorScale('#16a34a'),
        accent: designSystem.generateColorScale('#84cc16'),
        neutral: designSystem.generateColorScale('#6b7280'),
        success: designSystem.generateColorScale('#10b981'),
        warning: designSystem.generateColorScale('#f59e0b'),
        error: designSystem.generateColorScale('#ef4444'),
        info: designSystem.generateColorScale('#06b6d4')
    } as ColorPalette,

    /**
     * Purple cosmic palette
     */
    cosmic: {
        primary: designSystem.generateColorScale('#8b5cf6'),
        secondary: designSystem.generateColorScale('#a855f7'),
        accent: designSystem.generateColorScale('#06b6d4'),
        neutral: designSystem.generateColorScale('#6b7280'),
        success: designSystem.generateColorScale('#10b981'),
        warning: designSystem.generateColorScale('#f59e0b'),
        error: designSystem.generateColorScale('#ef4444'),
        info: designSystem.generateColorScale('#3b82f6')
    } as ColorPalette,

    /**
     * Rose elegant palette
     */
    rose: {
        primary: designSystem.generateColorScale('#f43f5e'),
        secondary: designSystem.generateColorScale('#ec4899'),
        accent: designSystem.generateColorScale('#8b5cf6'),
        neutral: designSystem.generateColorScale('#6b7280'),
        success: designSystem.generateColorScale('#10b981'),
        warning: designSystem.generateColorScale('#f59e0b'),
        error: designSystem.generateColorScale('#ef4444'),
        info: designSystem.generateColorScale('#06b6d4')
    } as ColorPalette,

    /**
     * Minimal grayscale palette
     */
    minimal: {
        primary: designSystem.generateColorScale('#374151'),
        secondary: designSystem.generateColorScale('#6b7280'),
        accent: designSystem.generateColorScale('#9ca3af'),
        neutral: designSystem.generateColorScale('#6b7280'),
        success: designSystem.generateColorScale('#10b981'),
        warning: designSystem.generateColorScale('#f59e0b'),
        error: designSystem.generateColorScale('#ef4444'),
        info: designSystem.generateColorScale('#3b82f6')
    } as ColorPalette
}

/**
 * Generate complete framework configurations from a palette
 */
export function createFrameworkConfigs(palette: ColorPalette) {
    const configs = designSystem.syncPalettes(palette)

    return {
        /**
         * Tailwind CSS configuration
         */
        tailwind: {
            ...configs.tailwind,
            // Add custom utilities
            content: ["./src/**/*.{js,ts,jsx,tsx}"],
            plugins: []
        },

        /**
         * Panda CSS configuration
         */
        panda: {
            ...configs.panda,
            // Add Panda-specific configuration
            include: ["./src/**/*.{js,jsx,ts,tsx}"],
            exclude: [],
            jsxFramework: "react" as const,
            outdir: "styled-system"
        },

        /**
         * CSS Variables string ready to use
         */
        cssVariables: configs.cssVars,

        /**
         * JavaScript/TypeScript color tokens object
         */
        tokens: palette
    }
}

/**
 * Quick helpers for common operations
 */
export const paletteUtils = {
    /**
     * Get a specific color from a palette
     */
    getColor: (palette: ColorPalette, colorName: keyof ColorPalette, shade: keyof ColorPalette[keyof ColorPalette]) => {
        return palette[colorName][shade]
    },

    /**
     * Check if a color combination is accessible
     */
    checkAccessibility: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA') => {
        return designSystem.isAccessible(foreground, background, level)
    },

    /**
     * Generate a new palette from a base color using different harmony rules
     */
    generateFromBase: (baseColor: string, harmony: 'complementary' | 'analogous' | 'triadic' | 'monochromatic' = 'complementary') => {
        switch (harmony) {
            case 'complementary':
                return designSystem.generateComplementary(baseColor)
            case 'analogous':
                return designSystem.generateAnalogous(baseColor)
            case 'triadic':
                return designSystem.generateTriadic(baseColor)
            case 'monochromatic':
                return designSystem.generateMonochromatic(baseColor)
            default:
                return designSystem.generateComplementary(baseColor)
        }
    },

    /**
     * Convert any palette to all supported formats
     */
    exportPalette: (palette: ColorPalette) => {
        return createFrameworkConfigs(palette)
    }
}