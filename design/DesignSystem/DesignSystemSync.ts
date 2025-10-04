import type { ColorPalette, ColorScale, ThemeConfig } from './ColorPalette'

/**
 * Design system synchronization interface for cross-framework compatibility
 */
export interface DesignSystemSync {
    /**
     * Generate Tailwind CSS configuration from design system palette
     */
    generateTailwindConfig(palette: ColorPalette): Record<string, unknown>

    /**
     * Generate Panda CSS configuration from design system palette
     */
    generatePandaConfig(palette: ColorPalette): Record<string, unknown>

    /**
     * Convert design system palette to CSS custom properties
     */
    generateCSSVariables(theme: ThemeConfig): string

    /**
     * Validate color palette consistency
     */
    validatePalette(palette: ColorPalette): boolean

    /**
     * Sync palette between different CSS frameworks
     */
    syncPalettes(sourcePalette: ColorPalette): {
        tailwind: Record<string, unknown>
        panda: Record<string, unknown>
        cssVars: string
    }
}

/**
 * Color format conversion utilities
 */
export interface ColorConverter {
    /**
     * Convert hex to RGB
     */
    hexToRgb(hex: string): { r: number; g: number; b: number }

    /**
     * Convert RGB to HSL
     */
    rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number }

    /**
     * Convert HSL to RGB
     */
    hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number }

    /**
     * Generate color scale from base color
     */
    generateColorScale(baseColor: string): ColorScale

    /**
     * Calculate contrast ratio between two colors
     */
    getContrastRatio(color1: string, color2: string): number

    /**
     * Check if color meets WCAG accessibility standards
     */
    isAccessible(foreground: string, background: string, level?: 'AA' | 'AAA'): boolean
}

/**
 * Palette generation utilities
 */
export interface PaletteGenerator {
    /**
     * Generate complementary color palette
     */
    generateComplementary(baseColor: string): ColorPalette

    /**
     * Generate analogous color palette
     */
    generateAnalogous(baseColor: string): ColorPalette

    /**
     * Generate triadic color palette
     */
    generateTriadic(baseColor: string): ColorPalette

    /**
     * Generate monochromatic color palette
     */
    generateMonochromatic(baseColor: string): ColorPalette
}